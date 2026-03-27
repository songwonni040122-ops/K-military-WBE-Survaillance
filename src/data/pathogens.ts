import type { PathogenInfo } from '../types';

export const pathogenList: PathogenInfo[] = [
  {
    id: 'norovirus',
    name: 'Norovirus',
    nameKo: '노로바이러스',
    baselineConcentration: 3.5,
    cautionThreshold: 1.5,
    warningThreshold: 2.0,
    criticalThreshold: 3.0,
    seasonalPeaks: ['winter', 'autumn'],
    color: '#00e5ff',
  },
  {
    id: 'influenza_a',
    name: 'Influenza A',
    nameKo: '인플루엔자 A',
    baselineConcentration: 2.8,
    cautionThreshold: 1.5,
    warningThreshold: 2.0,
    criticalThreshold: 3.0,
    seasonalPeaks: ['winter'],
    color: '#ff6e40',
  },
  {
    id: 'influenza_b',
    name: 'Influenza B',
    nameKo: '인플루엔자 B',
    baselineConcentration: 2.5,
    cautionThreshold: 1.5,
    warningThreshold: 2.0,
    criticalThreshold: 3.0,
    seasonalPeaks: ['winter', 'spring'],
    color: '#ffab00',
  },
  {
    id: 'sars_cov_2',
    name: 'SARS-CoV-2',
    nameKo: '코로나19',
    baselineConcentration: 2.0,
    cautionThreshold: 1.5,
    warningThreshold: 2.0,
    criticalThreshold: 3.0,
    seasonalPeaks: ['winter'],
    color: '#ff1744',
  },
  {
    id: 'adenovirus',
    name: 'Adenovirus',
    nameKo: '아데노바이러스',
    baselineConcentration: 3.0,
    cautionThreshold: 1.5,
    warningThreshold: 2.0,
    criticalThreshold: 3.0,
    seasonalPeaks: ['summer', 'spring'],
    color: '#e040fb',
  },
  {
    id: 'rotavirus',
    name: 'Rotavirus',
    nameKo: '로타바이러스',
    baselineConcentration: 2.2,
    cautionThreshold: 1.5,
    warningThreshold: 2.0,
    criticalThreshold: 3.0,
    seasonalPeaks: ['spring'],
    color: '#00e676',
  },
];

export const pathogenMap = Object.fromEntries(
  pathogenList.map(p => [p.id, p])
) as Record<string, PathogenInfo>;
