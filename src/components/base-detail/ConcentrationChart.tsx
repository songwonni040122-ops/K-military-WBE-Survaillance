import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  ReferenceLine, ReferenceArea, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import type { SampleResult } from '../../types';
import { pathogenList, pathogenMap } from '../../data/pathogens';

interface ConcentrationChartProps {
  samples: SampleResult[];
}

interface ChartDataPoint {
  date: string;
  [key: string]: number | string;
}

export default function ConcentrationChart({ samples }: ConcentrationChartProps) {
  if (samples.length === 0) return null;

  const detectedPathogenIds = new Set<string>();
  for (const sample of samples) {
    for (const p of sample.pathogens) {
      if (p.detected) detectedPathogenIds.add(p.pathogenId);
    }
  }

  const data: ChartDataPoint[] = samples.map((s) => {
    const point: ChartDataPoint = {
      date: s.date.substring(5), // MM-DD
    };
    for (const p of s.pathogens) {
      if (detectedPathogenIds.has(p.pathogenId)) {
        point[p.pathogenId] = p.concentration;
      }
    }
    return point;
  });

  // Get typical baseline for reference line (use the first detected pathogen)
  const firstDetected = [...detectedPathogenIds][0];
  const baseline = firstDetected ? pathogenMap[firstDetected]?.baselineConcentration || 3 : 3;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,0.07)" />
        <XAxis
          dataKey="date"
          stroke="#555"
          tick={{ fill: '#8888a0', fontSize: 9, fontFamily: 'var(--font-mono)' }}
          angle={-45}
          textAnchor="end"
          height={35}
        />
        <YAxis
          stroke="#555"
          tick={{ fill: '#8888a0', fontSize: 9, fontFamily: 'var(--font-mono)' }}
          label={{
            value: 'log copies/L',
            angle: -90,
            position: 'insideLeft',
            style: { fill: '#555566', fontSize: 8, fontFamily: 'var(--font-mono)' },
            offset: 15,
          }}
        />

        <ReferenceLine
          y={baseline}
          stroke="#00e5ff"
          strokeDasharray="5 5"
          strokeOpacity={0.5}
          label={{
            value: 'BASELINE',
            position: 'right',
            style: { fill: '#00e5ff', fontSize: 8, fontFamily: 'var(--font-mono)' },
          }}
        />

        <ReferenceArea
          y1={baseline * 1.5}
          y2={baseline * 2.0}
          fill="rgba(255,171,0,0.05)"
          strokeOpacity={0}
        />
        <ReferenceArea
          y1={baseline * 2.0}
          y2={baseline * 3.0}
          fill="rgba(255,110,64,0.07)"
          strokeOpacity={0}
        />
        <ReferenceArea
          y1={baseline * 3.0}
          y2={baseline * 4.0}
          fill="rgba(255,23,68,0.08)"
          strokeOpacity={0}
        />

        {pathogenList
          .filter(p => detectedPathogenIds.has(p.id))
          .map((p) => (
            <Line
              key={p.id}
              type="monotone"
              dataKey={p.id}
              stroke={p.color}
              strokeWidth={1.5}
              dot={{ r: 2, fill: p.color }}
              activeDot={{ r: 4 }}
              name={p.nameKo}
            />
          ))}

        <Tooltip
          contentStyle={{
            background: 'rgba(10,10,15,0.95)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 4,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: '#e0e0e8',
          }}
          labelStyle={{ color: '#8888a0', fontSize: '0.65rem' }}
        />
        <Legend
          wrapperStyle={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
