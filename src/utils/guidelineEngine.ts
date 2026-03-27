import type { Season, BaseType } from '../types';
import type { PathogenConcentration } from '../types';
import type { PreventionGuideline } from '../types';
import { computeAlertLevel } from './alertLevel';
import { guidelineTemplates } from '../data/guidelines';

export function getCurrentSeason(): Season {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

export function generateGuidelines(
  pathogens: PathogenConcentration[],
  baseType: BaseType,
  characteristics: string[],
): PreventionGuideline[] {
  const season = getCurrentSeason();
  const detected = pathogens.filter(p => p.detected && p.ratio >= 1.3);

  const matched: PreventionGuideline[] = [];

  for (const guideline of guidelineTemplates) {
    const pathogenMatch = detected.find(p => p.pathogenId === guideline.pathogenId);
    if (!pathogenMatch) continue;

    const alertLevel = computeAlertLevel(pathogenMatch.ratio);
    if (guideline.severity === 'critical' && alertLevel !== 'critical') continue;
    if (guideline.severity === 'warning' && alertLevel !== 'warning' && alertLevel !== 'critical') continue;

    const seasonMatch =
      guideline.applicableSeasons.length === 0 ||
      guideline.applicableSeasons.includes(season);

    const typeMatch =
      guideline.applicableBaseTypes.length === 0 ||
      guideline.applicableBaseTypes.includes(baseType);

    if (!seasonMatch || !typeMatch) continue;

    let priorityBoost = 0;
    if (guideline.applicableCharacteristics.length > 0) {
      const charMatch = guideline.applicableCharacteristics.some(c =>
        characteristics.includes(c)
      );
      if (charMatch) priorityBoost = -1;
    }

    matched.push({ ...guideline, priority: guideline.priority + priorityBoost });
  }

  matched.sort((a, b) => a.priority - b.priority);
  return matched.slice(0, 10);
}
