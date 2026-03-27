import type { AlertLevel } from '../../types';
import { alertColors, alertLabels } from '../../utils/colorScale';

interface BadgeProps {
  level: AlertLevel;
}

export default function Badge({ level }: BadgeProps) {
  const color = alertColors[level];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 2,
        border: `1px solid ${color}`,
        backgroundColor: `${color}15`,
        color: color,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
      {alertLabels[level]}
    </span>
  );
}
