import type { AlertLevel } from '../types';
import type { PathogenConcentration } from '../types';

export function computeAlertLevel(ratio: number): AlertLevel {
  if (ratio >= 3.0) return 'critical';
  if (ratio >= 2.0) return 'warning';
  if (ratio >= 1.5) return 'caution';
  return 'normal';
}

export function getZoneAlertLevel(pathogens: PathogenConcentration[]): AlertLevel {
  const levels: AlertLevel[] = pathogens
    .filter(p => p.detected)
    .map(p => computeAlertLevel(p.ratio));

  if (levels.includes('critical')) return 'critical';
  if (levels.includes('warning')) return 'warning';
  if (levels.includes('caution')) return 'caution';
  return 'normal';
}

export function getBaseAlertLevel(zoneAlerts: AlertLevel[]): AlertLevel {
  if (zoneAlerts.includes('critical')) return 'critical';
  if (zoneAlerts.includes('warning')) return 'warning';
  if (zoneAlerts.includes('caution')) return 'caution';
  return 'normal';
}
