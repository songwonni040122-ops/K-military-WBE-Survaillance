import type { MilitaryBase, AlertLevel } from '../../types';
import { useAppStore } from '../../stores/appStore';
import Badge from '../ui/Badge';

const baseTypeLabels: Record<string, string> = {
  infantry: '보병',
  armored: '기갑',
  artillery: '포병',
  logistics: '군수',
  airforce: '공군/공수',
  headquarters: '사령부',
};

interface BaseInfoHeaderProps {
  base: MilitaryBase;
  alertLevel: AlertLevel;
}

export default function BaseInfoHeader({ base, alertLevel }: BaseInfoHeaderProps) {
  const goBack = useAppStore((s) => s.goBack);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '10px 16px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}
    >
      <button
        onClick={goBack}
        style={{
          background: 'none',
          border: '1px solid var(--border-accent)',
          color: 'var(--accent-cyan)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          padding: '4px 10px',
          cursor: 'pointer',
          borderRadius: 2,
        }}
      >
        &larr; BACK
      </button>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h2
            style={{
              margin: 0,
              fontSize: '1rem',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.1em',
            }}
          >
            {base.name}
          </h2>
          <Badge level={alertLevel} />
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-dim)',
            marginTop: 2,
          }}
        >
          {baseTypeLabels[base.type]} | {base.region} | {base.personnelCount.toLocaleString()}명 |
          {' '}{base.location.lat.toFixed(2)}°N, {base.location.lng.toFixed(2)}°E
        </div>
      </div>
    </div>
  );
}
