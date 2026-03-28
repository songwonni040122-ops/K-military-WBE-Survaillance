import { getCurrentSeason } from '../../utils/guidelineEngine';

const seasonInfo: Record<string, { label: string; color: string }> = {
  spring: { label: '봄', color: '#00e676' },
  summer: { label: '여름', color: '#ffab00' },
  autumn: { label: '가을', color: '#ff6e40' },
  winter: { label: '겨울', color: '#00e5ff' },
};

export default function SeasonalBanner() {
  const season = getCurrentSeason();
  const info = seasonInfo[season];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 10px',
        background: `${info.color}10`,
        border: `1px solid ${info.color}30`,
        borderRadius: 2,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        marginBottom: 8,
      }}
    >
      <span style={{ color: info.color, fontWeight: 700 }}>[{info.label}]</span>
      <span style={{ color: 'var(--text-dim)' }}>계절 특성 반영 지침 적용 중</span>
    </div>
  );
}
