import { useAlertSummary } from '../../hooks/useAlertSummary';
import { alertColors } from '../../utils/colorScale';
import { pathogenMap } from '../../data/pathogens';

export default function ThreatTicker() {
  const { alertBases } = useAlertSummary();

  if (alertBases.length === 0) return null;

  const items = alertBases.map((ab) => {
    const pathogen = pathogenMap[ab.pathogen];
    return `[${ab.level.toUpperCase()}] ${ab.baseName} - ${pathogen?.nameKo || ab.pathogen} 검출 상승`;
  });

  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        background: 'rgba(255, 23, 68, 0.08)',
        borderBottom: '1px solid rgba(255, 23, 68, 0.15)',
        padding: '4px 0',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          animation: 'ticker-scroll 30s linear infinite',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          letterSpacing: '0.05em',
        }}
      >
        {items.map((_item, i) => (
          <span key={i}>
            <span style={{ color: alertColors[alertBases[i].level], fontWeight: 600 }}>
              [{alertBases[i].level.toUpperCase()}]
            </span>
            <span style={{ color: 'var(--text-primary)', marginLeft: 4 }}>
              {alertBases[i].baseName} - {pathogenMap[alertBases[i].pathogen]?.nameKo} 검출 상승
            </span>
            {i < items.length - 1 && (
              <span style={{ color: 'var(--text-dim)', margin: '0 16px' }}>///</span>
            )}
          </span>
        ))}
        <span style={{ color: 'var(--text-dim)', margin: '0 16px' }}>///</span>
        {items.map((_item, i) => (
          <span key={`dup-${i}`}>
            <span style={{ color: alertColors[alertBases[i].level], fontWeight: 600 }}>
              [{alertBases[i].level.toUpperCase()}]
            </span>
            <span style={{ color: 'var(--text-primary)', marginLeft: 4 }}>
              {alertBases[i].baseName} - {pathogenMap[alertBases[i].pathogen]?.nameKo} 검출 상승
            </span>
            {i < items.length - 1 && (
              <span style={{ color: 'var(--text-dim)', margin: '0 16px' }}>///</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
