import type { AlertLevel } from '../types';

export const alertColors: Record<AlertLevel, string> = {
  normal: '#00e5ff',
  caution: '#ffab00',
  warning: '#ff6e40',
  critical: '#ff1744',
};

export const alertLabels: Record<AlertLevel, string> = {
  normal: '정상',
  caution: '주의',
  warning: '경고',
  critical: '위험',
};

export const alertAnimation: Record<AlertLevel, string> = {
  normal: 'pulse-normal',
  caution: 'pulse-caution',
  warning: 'pulse-warning',
  critical: 'pulse-critical',
};

export function getAlertColor(level: AlertLevel): string {
  return alertColors[level];
}
