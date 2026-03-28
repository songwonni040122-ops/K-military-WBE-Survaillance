import type { PreventionGuideline } from '../../types';
import { alertColors } from '../../utils/colorScale';
import { pathogenMap } from '../../data/pathogens';
import { getCurrentSeason } from '../../utils/guidelineEngine';

const seasonLabels: Record<string, string> = {
  spring: '봄', summer: '여름', autumn: '가을', winter: '겨울',
};
const severityLabels: Record<string, string> = {
  caution: '주의', warning: '경고', critical: '위험',
};

interface Props {
  guideline: PreventionGuideline;
  baseName: string;
  onClose: () => void;
}

export default function GuidelineDocumentModal({ guideline, baseName, onClose }: Props) {
  const pathogen = pathogenMap[guideline.pathogenId];
  const severityColor = alertColors[guideline.severity];
  const season = getCurrentSeason();
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '.');

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0d0d18', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 4, width: '100%', maxWidth: 520, maxHeight: '85vh',
          overflow: 'auto', fontFamily: 'var(--font-mono)',
        }}
      >
        {/* Document header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '2px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                DEEPSTREAM / ROK-MND
              </div>
              <div style={{ fontSize: '0.55rem', color: 'var(--text-dim)', marginTop: 2 }}>
                방역지침 공문 #{guideline.id.replace('guide-', '')}
              </div>
            </div>
            <div style={{
              padding: '3px 10px', borderRadius: 2,
              background: `${severityColor}20`, color: severityColor,
              border: `1px solid ${severityColor}40`,
              fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
            }}>
              {severityLabels[guideline.severity] || guideline.severity}
            </div>
          </div>

          <h2 style={{
            margin: 0, fontSize: '1rem', fontFamily: 'var(--font-display)',
            color: 'var(--text-primary)', letterSpacing: '0.05em',
          }}>
            {guideline.title}
          </h2>
        </div>

        {/* Document metadata */}
        <div style={{
          padding: '12px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '6px 16px', fontSize: '0.65rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div>
            <span style={{ color: 'var(--text-dim)' }}>발행일: </span>
            <span style={{ color: 'var(--text-primary)' }}>{today}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)' }}>우선순위: </span>
            <span style={{ color: severityColor }}>P{guideline.priority}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)' }}>대상 부대: </span>
            <span style={{ color: 'var(--text-primary)' }}>{baseName}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)' }}>적용 계절: </span>
            <span style={{ color: 'var(--text-primary)' }}>
              {guideline.applicableSeasons.length === 0
                ? '전 계절'
                : guideline.applicableSeasons.map((s) => seasonLabels[s] || s).join(', ')}
              {' '}(현재: {seasonLabels[season]})
            </span>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <span style={{ color: 'var(--text-dim)' }}>대상 병원체: </span>
            <span style={{ color: pathogen?.color || '#888' }}>
              {pathogen?.nameKo || guideline.pathogenId}
            </span>
          </div>
        </div>

        {/* Description */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{
            fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: 8,
          }}>
            상황 요약
          </div>
          <p style={{
            margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}>
            {guideline.description}
          </p>
        </div>

        {/* Actions */}
        <div style={{ padding: '16px 24px' }}>
          <div style={{
            fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: 12,
          }}>
            조치 사항
          </div>
          <ol style={{ margin: 0, paddingLeft: 20 }}>
            {guideline.actions.map((action, i) => (
              <li key={i} style={{
                fontSize: '0.73rem', color: 'var(--text-primary)',
                marginBottom: 8, lineHeight: 1.5, paddingLeft: 4,
              }}>
                {action}
              </li>
            ))}
          </ol>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 24px', borderTop: '2px solid rgba(255,255,255,0.1)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ fontSize: '0.55rem', color: 'var(--text-dim)' }}>
            RESTRICTED // ROK-MND // DEEPSTREAM v1.0
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: '1px solid var(--border-accent)',
              color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem', padding: '4px 12px', cursor: 'pointer', borderRadius: 2,
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
