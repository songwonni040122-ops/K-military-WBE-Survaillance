import { alertColors, alertLabels } from '../../utils/colorScale';
import type { AlertLevel } from '../../types';

const levels: AlertLevel[] = ['normal', 'caution', 'warning', 'critical'];

export default function MapControls() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 40,
        right: 12,
        zIndex: 1000,
        background: 'rgba(10, 10, 15, 0.9)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 4,
        padding: '10px 14px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
      }}
    >
      <div
        style={{
          color: 'var(--text-secondary)',
          marginBottom: 8,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        Alert Level
      </div>
      {levels.map((level) => (
        <div
          key={level}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: alertColors[level],
            }}
          />
          <span style={{ color: 'var(--text-primary)' }}>{alertLabels[level]}</span>
        </div>
      ))}
    </div>
  );
}
