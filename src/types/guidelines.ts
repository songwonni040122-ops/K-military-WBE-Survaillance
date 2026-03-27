import type { AlertLevel, BaseType, Season } from './base';
import type { PathogenId } from './pathogen';

export interface PreventionGuideline {
  id: string;
  pathogenId: PathogenId;
  severity: AlertLevel;
  title: string;
  description: string;
  actions: string[];
  applicableSeasons: Season[];
  applicableBaseTypes: BaseType[];
  applicableCharacteristics: string[];
  priority: number;
}
