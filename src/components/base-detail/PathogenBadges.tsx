import type { PathogenConcentration } from '../../types';
import { pathogenMap } from '../../data/pathogens';
import { computeAlertLevel } from '../../utils/alertLevel';
import { alertColors } from '../../utils/colorScale';

interface PathogenBadgesProps {
  pathogens: PathogenConcentration[];
}

export default function PathogenBadges({ pathogens }: PathogenBadgesProps) {
  const detected = pathogens
    .filter(p => p.detected)
    .sort((a, b) => b.ratio - a.ratio);

  if (detected.length === 0) {
    return (
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
        검출 없음
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {detected.map((p) => {
        const info = pathogenMap[p.pathogenId];
        const level = computeAlertLevel(p.ratio);
        const levelColor = alertColors[level];

        return (
          <div
            key={p.pathogenId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: 2,
              border: `1px solid ${info?.color || '#888'}40`,
              background: `${info?.color || '#888'}10`,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
            }}
          >
            <span style={{ color: info?.color || '#888', fontWeight: 600 }}>
              {info?.nameKo || p.pathogenId}
            </span>
            <span style={{ color: levelColor, fontSize: '0.6rem' }}>
              x{p.ratio.toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
