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

/**
 * Generate 3-tier guidelines:
 * 1. Regular (정기): always included - legal compliance schedules
 * 2. Seasonal (계절): included if current season matches
 * 3. Emergency (긴급): included only when pathogen ratio >= 1.3
 */
export function generateGuidelines(
  pathogens: PathogenConcentration[],
  baseType: BaseType,
  characteristics: string[],
): PreventionGuideline[] {
  const season = getCurrentSeason();
  const detected = pathogens.filter(p => p.detected && p.ratio >= 1.3);
  const matched: PreventionGuideline[] = [];

  for (const guideline of guidelineTemplates) {
    // Season/type matching
    const seasonMatch = guideline.applicableSeasons.length === 0 || guideline.applicableSeasons.includes(season);
    const typeMatch = guideline.applicableBaseTypes.length === 0 || guideline.applicableBaseTypes.includes(baseType);
    if (!typeMatch) continue;

    if (guideline.tier === 'regular') {
      // Regular: always include
      matched.push({ ...guideline });
    } else if (guideline.tier === 'seasonal') {
      // Seasonal: include if season matches
      if (seasonMatch) {
        matched.push({ ...guideline });
      }
    } else if (guideline.tier === 'emergency') {
      // Emergency: only when pathogen is detected at elevated level
      const pathogenMatch = detected.find(p => p.pathogenId === guideline.pathogenId);
      if (!pathogenMatch) continue;

      const alertLevel = computeAlertLevel(pathogenMatch.ratio);
      if (guideline.severity === 'critical' && alertLevel !== 'critical') continue;
      if (guideline.severity === 'warning' && alertLevel !== 'warning' && alertLevel !== 'critical') continue;

      if (!seasonMatch) continue;

      let priorityBoost = 0;
      if (guideline.applicableCharacteristics.length > 0) {
        const charMatch = guideline.applicableCharacteristics.some(c => characteristics.includes(c));
        if (charMatch) priorityBoost = -1;
      }
      matched.push({ ...guideline, priority: guideline.priority + priorityBoost });
    }
  }

  // Sort: emergency first, then seasonal, then regular. Within each tier, by priority.
  const tierOrder = { emergency: 0, seasonal: 1, regular: 2 };
  matched.sort((a, b) => {
    const ta = tierOrder[a.tier] ?? 2;
    const tb = tierOrder[b.tier] ?? 2;
    if (ta !== tb) return ta - tb;
    return a.priority - b.priority;
  });

  return matched.slice(0, 15);
}
