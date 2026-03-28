import { useAlertSummary } from '../../hooks/useAlertSummary';
import { alertColors } from '../../utils/colorScale';
import { pathogenMap } from '../../data/pathogens';

export default function ThreatTicker() {
  const { alertBases } = useAlertSummary();

  if (alertBases.length === 0) return null;

  // Show up to 3 most critical alerts as fixed notification cards
  const top = alertBases.slice(0, 3);

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        padding: '4px 12px',
        background: 'rgba(255, 23, 68, 0.06)',
        borderBottom: '1px solid rgba(255, 23, 68, 0.12)',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {top.map((ab, i) => {
        const color = alertColors[ab.level];
        const pathogen = pathogenMap[ab.pathogen];
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 10px',
              background: `${color}10`,
              border: `1px solid ${color}25`,
              borderRadius: 2,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6rem' }}>
              [{ab.level}]
            </span>
            <span style={{ color: 'var(--text-primary)' }}>
              {ab.baseName}
            </span>
            <span style={{ color: 'var(--text-dim)' }}>-</span>
            <span style={{ color: 'var(--text-secondary)' }}>
              {pathogen?.nameKo || ab.pathogen}
            </span>
          </div>
        );
      })}
      {alertBases.length > 3 && (
        <div style={{
          display: 'flex', alignItems: 'center',
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)',
          padding: '0 6px',
        }}>
          +{alertBases.length - 3}건
        </div>
      )}
    </div>
  );
}
