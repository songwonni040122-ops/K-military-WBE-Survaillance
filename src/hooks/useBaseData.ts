import { useMemo } from 'react';
import { bases, baseMap } from '../data/bases';
import { samplesByZone, getLatestSample } from '../data/samples';
import { getZoneAlertLevel, getBaseAlertLevel } from '../utils/alertLevel';
import type { AlertLevel, MilitaryBase } from '../types';

export interface BaseWithAlert extends MilitaryBase {
  alertLevel: AlertLevel;
}

export function useBaseData() {
  const basesWithAlerts = useMemo<BaseWithAlert[]>(() => {
    return bases.map(base => {
      const zoneAlerts = base.zones.map(zone => {
        const latest = getLatestSample(zone.id);
        if (!latest) return 'normal' as AlertLevel;
        return getZoneAlertLevel(latest.pathogens);
      });
      return {
        ...base,
        alertLevel: getBaseAlertLevel(zoneAlerts),
      };
    });
  }, []);

  const getBase = (id: string) => baseMap[id];
  const getZoneSamples = (zoneId: string) => samplesByZone[zoneId] || [];

  return { bases: basesWithAlerts, getBase, getZoneSamples };
}
