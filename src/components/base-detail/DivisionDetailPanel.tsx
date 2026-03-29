import { useAppStore } from '../../stores/appStore';
import { useBaseData } from '../../hooks/useBaseData';
import { divisions } from '../../data/bases';
import { getBaseAlertLevel, getZoneAlertLevel } from '../../utils/alertLevel';
import { getLatestSample } from '../../data/samples';
import { alertColors } from '../../utils/colorScale';
import Badge from '../ui/Badge';
import PulsingDot from '../ui/PulsingDot';
import GlassPanel from '../ui/GlassPanel';
import type { AlertLevel } from '../../types';

export default function DivisionDetailPanel() {
  const selectedDivisionId = useAppStore((s) => s.selectedDivisionId);
  const selectBase = useAppStore((s) => s.selectBase);
  const goBack = useAppStore((s) => s.goBack);
  const { getBase } = useBaseData();

  if (!selectedDivisionId) return null;
  const div = divisions.find((d) => d.id === selectedDivisionId);
  if (!div) return null;

  const divBases = div.baseIds.map((bid) => getBase(bid)).filter(Boolean);
  const divAlerts: AlertLevel[] = divBases.map((base) => {
    if (!base) return 'normal' as AlertLevel;
    const zoneAlerts = base.zones.map((z) => {
      const latest = getLatestSample(z.id);
      return latest ? getZoneAlertLevel(latest.pathogens) : ('normal' as AlertLevel);
    });
    return getBaseAlertLevel(zoneAlerts);
  });
  const divAlert = getBaseAlertLevel(divAlerts);

  // Sort by alert level (critical first)
  const order: Record<string, number> = { critical: 0, warning: 1, caution: 2, normal: 3 };
  const sorted = divBases.map((b, i) => ({ base: b!, alert: divAlerts[i] }))
    .sort((a, b) => (order[a.alert] || 3) - (order[b.alert] || 3));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0,
      }}>
        <button onClick={goBack} style={{
          background: 'none', border: '1px solid var(--border-accent)',
          color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem', padding: '3px 8px', cursor: 'pointer', borderRadius: 2,
        }}>
          &larr;
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>
              {div.name}
            </h2>
            <Badge level={divAlert} />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)', marginTop: 2 }}>
            {div.type === 'brigade' ? '독립여단' : '사단'} | {div.baseIds.length}개 부대
          </div>
        </div>
      </div>

      {/* Base list */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sorted.map(({ base, alert }) => (
          <GlassPanel key={base.id} style={{ padding: '10px 12px', cursor: 'pointer' }}>
            <div
              onClick={() => selectBase(base.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <PulsingDot level={alert} size={8} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 600 }}>
                  {base.name}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text-dim)', marginTop: 2 }}>
                  {base.personnelCount.toLocaleString()}명 | {base.zoneCount}구역
                </div>
              </div>
              <span style={{
                fontSize: '0.6rem', padding: '2px 6px', borderRadius: 2,
                background: `${alertColors[alert]}20`, color: alertColors[alert],
                border: `1px solid ${alertColors[alert]}40`,
                fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
              }}>
                {alert}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)' }}>
                &rarr;
              </span>
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}
