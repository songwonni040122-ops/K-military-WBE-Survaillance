import type { Zone, SampleResult } from '../../types';
import { getZoneAlertLevel } from '../../utils/alertLevel';
import ConcentrationChart from './ConcentrationChart';
import PathogenBadges from './PathogenBadges';
import GlassPanel from '../ui/GlassPanel';
import PulsingDot from '../ui/PulsingDot';

interface ZonePanelProps {
  zone: Zone;
  samples: SampleResult[];
  isSelected: boolean;
  onSelect: () => void;
  zoneColor: string;
}

export default function ZonePanel({ zone, samples, isSelected, onSelect, zoneColor }: ZonePanelProps) {
  const latest = samples[samples.length - 1];
  const alertLevel = latest ? getZoneAlertLevel(latest.pathogens) : 'normal';

  return (
    <GlassPanel
      style={{
        padding: '12px',
        cursor: 'pointer',
        borderColor: isSelected ? zoneColor + '60' : 'var(--border-subtle)',
        transition: 'border-color 0.2s',
      }}
    >
      <div
        onClick={onSelect}
        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 2,
            background: zoneColor,
            opacity: 0.7,
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '0.05em',
            flex: 1,
          }}
        >
          {zone.name}
        </span>
        <PulsingDot level={alertLevel} size={8} />
      </div>

      <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
        {zone.confluencePoint}
      </div>

      {/* Chart */}
      <div style={{ marginBottom: 8 }}>
        <ConcentrationChart samples={samples} />
      </div>

      {/* Pathogen badges */}
      <div>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginBottom: 4, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
          검출 병원체
        </div>
        {latest && <PathogenBadges pathogens={latest.pathogens} />}
      </div>
    </GlassPanel>
  );
}
