import type { SampleResult, PathogenConcentration, PathogenId } from '../types';
import { pathogenList } from './pathogens';
import { bases } from './bases';

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateSampleDates(count: number): string[] {
  const dates: string[] = [];
  const now = new Date(2026, 2, 27); // 2026-03-27
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - Math.floor(i * 3.5));
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

// Pre-defined spike patterns for specific zones to make data interesting
const spikeConfig: Record<string, { pathogen: PathogenId; multiplier: number }[]> = {
  'b01-z2': [{ pathogen: 'norovirus', multiplier: 2.3 }],
  'b03-z1': [{ pathogen: 'influenza_a', multiplier: 1.7 }],
  'b05-z1': [{ pathogen: 'norovirus', multiplier: 3.5 }, { pathogen: 'rotavirus', multiplier: 2.8 }],
  'b05-z2': [{ pathogen: 'norovirus', multiplier: 2.4 }],
  'b08-z3': [{ pathogen: 'influenza_a', multiplier: 1.6 }],
  'b10-z2': [{ pathogen: 'adenovirus', multiplier: 1.8 }],
  'b15-z2': [{ pathogen: 'sars_cov_2', multiplier: 2.2 }, { pathogen: 'influenza_b', multiplier: 2.0 }],
  'b20-z1': [{ pathogen: 'norovirus', multiplier: 2.0 }],
  'b25-z3': [{ pathogen: 'influenza_a', multiplier: 1.9 }],
  'b30-z1': [{ pathogen: 'rotavirus', multiplier: 2.5 }],
  'b35-z2': [{ pathogen: 'sars_cov_2', multiplier: 1.8 }],
  'b40-z1': [{ pathogen: 'adenovirus', multiplier: 2.1 }],
  'b45-z3': [{ pathogen: 'norovirus', multiplier: 2.6 }, { pathogen: 'influenza_b', multiplier: 1.5 }],
  'b50-z2': [{ pathogen: 'influenza_a', multiplier: 2.3 }],
};

function generatePathogens(
  zoneId: string,
  sampleIndex: number,
  rand: () => number,
): PathogenConcentration[] {
  const spikes = spikeConfig[zoneId] || [];

  return pathogenList.map((p) => {
    const baseline = p.baselineConcentration;
    const spike = spikes.find(s => s.pathogen === p.id);

    let concentration: number;
    if (spike) {
      // Ramp up over last few samples
      const rampFactor = Math.min(1, sampleIndex / 7);
      const spikeAmount = spike.multiplier * rampFactor;
      const noise = (rand() - 0.5) * 0.4;
      concentration = baseline * (1 + (spikeAmount - 1) * rampFactor + noise);
    } else {
      const noise = (rand() - 0.5) * 0.6;
      concentration = baseline * (1 + noise * 0.3);
    }

    concentration = Math.max(0.1, concentration);
    const ratio = concentration / baseline;
    const detected = concentration > baseline * 0.5;

    return {
      pathogenId: p.id,
      concentration: Math.round(concentration * 100) / 100,
      baseline,
      ratio: Math.round(ratio * 100) / 100,
      detected,
    };
  });
}

function generateAllSamples(): Record<string, SampleResult[]> {
  const result: Record<string, SampleResult[]> = {};
  const dates = generateSampleDates(10);
  let seedCounter = 42;

  for (const base of bases) {
    for (const zone of base.zones) {
      const rand = seededRandom(seedCounter++);
      const samples: SampleResult[] = dates.map((date, i) => ({
        id: `${zone.id}-s${i}`,
        zoneId: zone.id,
        date,
        pathogens: generatePathogens(zone.id, i, rand),
      }));
      result[zone.id] = samples;
    }
  }

  return result;
}

export const samplesByZone = generateAllSamples();

export function getLatestSample(zoneId: string): SampleResult | undefined {
  const samples = samplesByZone[zoneId];
  return samples?.[samples.length - 1];
}
