import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { useAlertSummary } from '../../hooks/useAlertSummary';
import { pathogenMap } from '../../data/pathogens';
import GlassPanel from '../ui/GlassPanel';

export default function PathogenDistribution() {
  const { pathogenCounts } = useAlertSummary();

  const data = Object.entries(pathogenCounts)
    .map(([id, count]) => ({
      name: pathogenMap[id]?.nameKo || id,
      count,
      color: pathogenMap[id]?.color || '#888',
    }))
    .sort((a, b) => b.count - a.count);

  if (data.length === 0) {
    return (
      <GlassPanel style={{ padding: '16px' }}>
        <div className="section-header">병원체 분포</div>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textAlign: 'center', padding: 20 }}>
          주의 수준 이상 검출 없음
        </div>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel style={{ padding: '16px' }}>
      <div className="section-header">병원체 분포 (주의 이상)</div>
      <ResponsiveContainer width="100%" height={data.length * 32 + 10}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={80}
            tick={{ fill: '#8888a0', fontSize: 11, fontFamily: 'var(--font-body)' }}
            axisLine={false}
            tickLine={false}
          />
          <Bar dataKey="count" radius={[0, 2, 2, 0]} barSize={16}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} fillOpacity={0.7} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </GlassPanel>
  );
}
