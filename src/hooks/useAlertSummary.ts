import { useMemo } from 'react';
import { useBaseData } from './useBaseData';
import type { AlertLevel } from '../types';
import type { PathogenId } from '../types';
import { getLatestSample } from '../data/samples';

export interface AlertSummary {
  total: number;
  byLevel: Record<AlertLevel, number>;
  pathogenCounts: Record<string, number>;
  alertBases: { baseId: string; baseName: string; level: AlertLevel; pathogen: string }[];
}

export function useAlertSummary(): AlertSummary {
  const { bases } = useBaseData();

  return useMemo(() => {
    const byLevel: Record<AlertLevel, number> = {
      normal: 0,
      caution: 0,
      warning: 0,
      critical: 0,
    };

    const pathogenCounts: Record<string, number> = {};
    const alertBases: AlertSummary['alertBases'] = [];

    for (const base of bases) {
      byLevel[base.alertLevel]++;

      if (base.alertLevel !== 'normal') {
        let worstPathogen: PathogenId = 'norovirus';
        let worstRatio = 0;

        for (const zone of base.zones) {
          const latest = getLatestSample(zone.id);
          if (!latest) continue;
          for (const p of latest.pathogens) {
            if (p.detected && p.ratio > worstRatio) {
              worstRatio = p.ratio;
              worstPathogen = p.pathogenId;
            }
          }
        }

        alertBases.push({
          baseId: base.id,
          baseName: base.name,
          level: base.alertLevel,
          pathogen: worstPathogen,
        });
      }

      for (const zone of base.zones) {
        const latest = getLatestSample(zone.id);
        if (!latest) continue;
        for (const p of latest.pathogens) {
          if (p.detected && p.ratio >= 1.5) {
            pathogenCounts[p.pathogenId] = (pathogenCounts[p.pathogenId] || 0) + 1;
          }
        }
      }
    }

    return {
      total: bases.length,
      byLevel,
      pathogenCounts,
      alertBases,
    };
  }, [bases]);
}
