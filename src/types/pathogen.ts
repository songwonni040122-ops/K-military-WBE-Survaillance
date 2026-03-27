import type { Season } from './base';

export type PathogenId = 'norovirus' | 'influenza_a' | 'influenza_b' | 'sars_cov_2' | 'adenovirus' | 'rotavirus';

export interface PathogenInfo {
  id: PathogenId;
  name: string;
  nameKo: string;
  baselineConcentration: number;
  cautionThreshold: number;
  warningThreshold: number;
  criticalThreshold: number;
  seasonalPeaks: Season[];
  color: string;
}

export interface SampleResult {
  id: string;
  zoneId: string;
  date: string;
  pathogens: PathogenConcentration[];
}

export interface PathogenConcentration {
  pathogenId: PathogenId;
  concentration: number;
  baseline: number;
  ratio: number;
  detected: boolean;
}
