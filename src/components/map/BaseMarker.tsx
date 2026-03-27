import { CircleMarker, Popup } from 'react-leaflet';
import { useAppStore } from '../../stores/appStore';
import { alertColors } from '../../utils/colorScale';
import Badge from '../ui/Badge';
import type { BaseWithAlert } from '../../hooks/useBaseData';

const baseTypeLabels: Record<string, string> = {
  infantry: '보병',
  armored: '기갑',
  artillery: '포병',
  logistics: '군수',
  airforce: '공군/공수',
  headquarters: '사령부',
};

interface BaseMarkerProps {
  base: BaseWithAlert;
}

export default function BaseMarker({ base }: BaseMarkerProps) {
  const selectBase = useAppStore((s) => s.selectBase);
  const color = alertColors[base.alertLevel];

  return (
    <CircleMarker
      center={[base.location.lat, base.location.lng]}
      radius={base.alertLevel === 'critical' ? 12 : base.alertLevel === 'warning' ? 10 : 8}
      pathOptions={{
        color: color,
        fillColor: color,
        fillOpacity: 0.3,
        weight: 2,
      }}
      eventHandlers={{
        click: () => selectBase(base.id),
      }}
    >
      <Popup>
        <div
          style={{
            background: '#0d0d15',
            color: '#e0e0e8',
            padding: '12px',
            borderRadius: '4px',
            fontFamily: 'var(--font-body)',
            minWidth: '180px',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>
            {base.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8888a0', marginBottom: 8 }}>
            {baseTypeLabels[base.type]} | {base.region}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Badge level={base.alertLevel} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#8888a0' }}>
              {base.personnelCount.toLocaleString()}명
            </span>
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: '0.65rem',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              textAlign: 'center',
              padding: '4px',
              border: '1px solid rgba(0,229,255,0.2)',
              borderRadius: 2,
            }}
          >
            상세 보기 &rarr;
          </div>
        </div>
      </Popup>
    </CircleMarker>
  );
}
