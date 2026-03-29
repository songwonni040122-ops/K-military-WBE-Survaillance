import type { AlertLevel, BaseType, Season } from './base';
import type { PathogenId } from './pathogen';

export type GuidelineTier = 'regular' | 'seasonal' | 'emergency';

export interface PreventionGuideline {
  id: string;
  pathogenId: PathogenId;
  severity: AlertLevel;
  tier: GuidelineTier;
  title: string;
  description: string;
  actions: string[];
  applicableSeasons: Season[];
  applicableBaseTypes: BaseType[];
  applicableCharacteristics: string[];
  priority: number;
}
