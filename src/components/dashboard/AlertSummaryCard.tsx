import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAlertSummary } from '../../hooks/useAlertSummary';
import { alertColors, alertLabels } from '../../utils/colorScale';
import type { AlertLevel } from '../../types';
import GlassPanel from '../ui/GlassPanel';

const levels: AlertLevel[] = ['normal', 'caution', 'warning', 'critical'];

export default function AlertSummaryCard() {
  const { total, byLevel } = useAlertSummary();

  const data = levels.map((level) => ({
    name: alertLabels[level],
    value: byLevel[level],
    color: alertColors[level],
  })).filter(d => d.value > 0);

  return (
    <GlassPanel style={{ padding: '16px' }}>
      <div className="section-header">경보 현황</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 100, height: 100 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={44}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', color: 'var(--accent-cyan)', lineHeight: 1 }}>
            {total}
          </div>
          <div className="data-label" style={{ marginBottom: 8 }}>감시 부대</div>
          {levels.map((level) => (
            byLevel[level] > 0 && (
              <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: alertColors[level] }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: alertColors[level] }}>
                  {byLevel[level]}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  {alertLabels[level]}
                </span>
              </div>
            )
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}
