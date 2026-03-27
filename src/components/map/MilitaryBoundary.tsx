import { Polygon, Tooltip } from 'react-leaflet';
import { useAppStore } from '../../stores/appStore';
import type { BaseWithAlert } from '../../hooks/useBaseData';

const baseTypeLabels: Record<string, string> = {
  infantry: '보병',
  armored: '기갑',
  artillery: '포병',
  logistics: '군수',
  airforce: '공군/공수',
  headquarters: '사령부',
};

interface MilitaryBoundaryProps {
  base: BaseWithAlert;
}

export default function MilitaryBoundary({ base }: MilitaryBoundaryProps) {
  const selectBase = useAppStore((s) => s.selectBase);

  if (!base.boundary || base.boundary.length < 3) return null;

  return (
    <Polygon
      positions={base.boundary}
      pathOptions={{
        color: '#cc3333',
        weight: 2,
        opacity: 0.7,
        fillColor: '#cc2222',
        fillOpacity: 0.18,
        dashArray: '6 4',
      }}
      eventHandlers={{
        click: () => selectBase(base.id),
        mouseover: (e) => {
          e.target.setStyle({
            fillOpacity: 0.35,
            weight: 3,
            opacity: 0.9,
          });
        },
        mouseout: (e) => {
          e.target.setStyle({
            fillOpacity: 0.18,
            weight: 2,
            opacity: 0.7,
          });
        },
      }}
    >
      <Tooltip direction="top" offset={[0, -10]} opacity={0.95} sticky>
        <div style={{
          background: '#0d0d15', color: '#e0e0e8', padding: '8px 12px',
          borderRadius: '4px', fontFamily: 'Share Tech Mono, monospace',
          border: '1px solid rgba(204, 51, 51, 0.4)',
        }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 2 }}>
            {base.name}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#8888a0' }}>
            {baseTypeLabels[base.type]} | {base.region} | {base.personnelCount.toLocaleString()}명
          </div>
        </div>
      </Tooltip>
    </Polygon>
  );
}
