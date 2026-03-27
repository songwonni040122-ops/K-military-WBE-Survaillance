import { useBaseData } from '../../hooks/useBaseData';
import { useAppStore } from '../../stores/appStore';
import { alertColors, alertLabels } from '../../utils/colorScale';
import PulsingDot from '../ui/PulsingDot';
import GlassPanel from '../ui/GlassPanel';

const baseTypeLabels: Record<string, string> = {
  infantry: '보병',
  armored: '기갑',
  artillery: '포병',
  logistics: '군수',
  airforce: '공군/공수',
  headquarters: '사령부',
};

export default function BaseStatusTable() {
  const { bases } = useBaseData();
  const selectBase = useAppStore((s) => s.selectBase);

  const sorted = [...bases].sort((a, b) => {
    const order = { critical: 0, warning: 1, caution: 2, normal: 3 };
    return order[a.alertLevel] - order[b.alertLevel];
  });

  return (
    <GlassPanel style={{ padding: '16px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="section-header">부대별 감시 현황</div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
          <thead>
            <tr style={{ color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid var(--border-subtle)' }}>상태</th>
              <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid var(--border-subtle)' }}>부대명</th>
              <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid var(--border-subtle)' }}>유형</th>
              <th style={{ textAlign: 'right', padding: '6px 8px', borderBottom: '1px solid var(--border-subtle)' }}>인원</th>
              <th style={{ textAlign: 'center', padding: '6px 8px', borderBottom: '1px solid var(--border-subtle)' }}>구역</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((base) => (
              <tr
                key={base.id}
                onClick={() => selectBase(base.id)}
                style={{
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <PulsingDot level={base.alertLevel} size={8} />
                    <span style={{ color: alertColors[base.alertLevel], fontSize: '0.65rem' }}>
                      {alertLabels[base.alertLevel]}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                  {base.name}
                </td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  {baseTypeLabels[base.type]}
                </td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', textAlign: 'right' }}>
                  {base.personnelCount.toLocaleString()}
                </td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  {base.zoneCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassPanel>
  );
}
