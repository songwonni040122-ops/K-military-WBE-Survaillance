import type { PreventionGuideline } from '../../types';
import { alertColors } from '../../utils/colorScale';
import { pathogenMap } from '../../data/pathogens';

interface ChecklistItemProps {
  guideline: PreventionGuideline;
}

export default function ChecklistItem({ guideline }: ChecklistItemProps) {
  const pathogen = pathogenMap[guideline.pathogenId];
  const severityColor = alertColors[guideline.severity];

  return (
    <div
      style={{
        padding: '10px 12px',
        borderLeft: `3px solid ${severityColor}`,
        background: 'rgba(255,255,255,0.02)',
        marginBottom: 8,
        borderRadius: '0 2px 2px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: pathogen?.color || '#888',
            padding: '1px 4px',
            border: `1px solid ${pathogen?.color || '#888'}40`,
            borderRadius: 1,
          }}
        >
          {pathogen?.nameKo || guideline.pathogenId}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: severityColor,
            textTransform: 'uppercase',
          }}
        >
          P{guideline.priority}
        </span>
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 4,
        }}
      >
        {guideline.title}
      </div>
      <div
        style={{
          fontSize: '0.7rem',
          color: 'var(--text-secondary)',
          marginBottom: 6,
        }}
      >
        {guideline.description}
      </div>
      <ul style={{ margin: 0, paddingLeft: 16, listStyleType: 'none' }}>
        {guideline.actions.map((action, i) => (
          <li
            key={i}
            style={{
              fontSize: '0.68rem',
              color: 'var(--text-primary)',
              marginBottom: 3,
              paddingLeft: 8,
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: -8,
                color: severityColor,
                fontFamily: 'var(--font-mono)',
              }}
            >
              &gt;
            </span>
            {action}
          </li>
        ))}
      </ul>
    </div>
  );
}
