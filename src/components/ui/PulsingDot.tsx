import type { AlertLevel } from '../../types';
import { alertColors, alertAnimation } from '../../utils/colorScale';

interface PulsingDotProps {
  level: AlertLevel;
  size?: number;
}

export default function PulsingDot({ level, size = 10 }: PulsingDotProps) {
  const color = alertColors[level];
  const animation = alertAnimation[level];

  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        animation: `${animation} 2s ease-in-out infinite`,
      }}
    />
  );
}
