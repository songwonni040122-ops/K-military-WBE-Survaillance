import { getCurrentSeason } from '../../utils/guidelineEngine';

const seasonInfo: Record<string, { label: string; icon: string; color: string }> = {
  spring: { label: '봄', icon: '🌸', color: '#00e676' },
  summer: { label: '여름', icon: '☀️', color: '#ffab00' },
  autumn: { label: '가을', icon: '🍂', color: '#ff6e40' },
  winter: { label: '겨울', icon: '❄️', color: '#00e5ff' },
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
      <span>{info.icon}</span>
      <span style={{ color: info.color }}>현재 계절: {info.label}</span>
      <span style={{ color: 'var(--text-dim)' }}>| 계절 특성 반영 지침</span>
    </div>
  );
}
