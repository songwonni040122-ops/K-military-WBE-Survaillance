import { MapContainer, TileLayer, Polygon, Marker, Tooltip, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '../../stores/appStore';
import { getZoneAlertLevel } from '../../utils/alertLevel';
import { getLatestSample } from '../../data/samples';
import { getAlertColor } from '../../utils/colorScale';
import type { MilitaryBase, AlertLevel } from '../../types';
import 'leaflet/dist/leaflet.css';

interface SatelliteBaseViewProps {
  base: MilitaryBase;
}

function createConfluenceIcon(alertLevel: AlertLevel) {
  const color = getAlertColor(alertLevel);
  return L.divIcon({
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    html: `
      <div style="
        width: 40px; height: 40px;
        display: flex; align-items: center; justify-content: center;
        position: relative;
      ">
        <div style="
          position: absolute; width: 40px; height: 40px;
          border-radius: 50%;
          background: ${color};
          opacity: 0.15;
          animation: confluence-pulse 2s ease-in-out infinite;
        "></div>
        <div style="
          position: absolute; width: 24px; height: 24px;
          border-radius: 50%;
          background: ${color};
          opacity: 0.3;
          animation: confluence-pulse 2s ease-in-out infinite 0.3s;
        "></div>
        <div style="
          width: 12px; height: 12px;
          border-radius: 50%;
          background: ${color};
          border: 2px solid rgba(255,255,255,0.8);
          box-shadow: 0 0 12px ${color}, 0 0 24px ${color}50;
          position: relative; z-index: 2;
        "></div>
      </div>
    `,
  });
}

export default function SatelliteBaseView({ base }: SatelliteBaseViewProps) {
  const selectedZoneId = useAppStore((s) => s.selectedZoneId);
  const selectZone = useAppStore((s) => s.selectZone);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <style>{`
        @keyframes confluence-pulse {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.5); opacity: 0; }
        }
        .satellite-map .leaflet-tile-pane {
          filter: brightness(0.75) contrast(1.15) saturate(0.9);
        }
        .satellite-map .leaflet-control-zoom a {
          background: rgba(10,10,15,0.85) !important;
          color: var(--text-primary, #e0e0e8) !important;
          border-color: rgba(255,255,255,0.1) !important;
        }
        .confluence-tooltip {
          background: rgba(10,10,20,0.92) !important;
          border: 1px solid rgba(255,255,255,0.15) !important;
          color: #e0e0e8 !important;
          font-family: 'Share Tech Mono', monospace !important;
          font-size: 11px !important;
          letter-spacing: 0.05em !important;
          padding: 6px 10px !important;
          border-radius: 2px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
        }
        .confluence-tooltip::before {
          border-top-color: rgba(10,10,20,0.92) !important;
        }
      `}</style>
      <MapContainer
        center={[base.location.lat, base.location.lng]}
        zoom={17}
        zoomControl={false}
        className="satellite-map"
        style={{ width: '100%', height: '100%', background: '#070710' }}
        minZoom={15}
        maxZoom={19}
      >
        <TileLayer
          attribution='&copy; Esri'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
        <ZoomControl position="bottomleft" />

        {/* Zone polygon overlays */}
        {base.layout.zones.map((zoneDef) => {
          const zone = base.zones.find(z => z.id === zoneDef.id);
          const isSelected = selectedZoneId === zoneDef.id;
          return (
            <Polygon
              key={zoneDef.id}
              positions={zoneDef.polygon.map(([lat, lng]) => [lat, lng] as [number, number])}
              pathOptions={{
                color: zoneDef.color,
                weight: isSelected ? 3 : 2,
                opacity: isSelected ? 0.9 : 0.6,
                fillColor: zoneDef.color,
                fillOpacity: isSelected ? 0.35 : 0.18,
                dashArray: isSelected ? undefined : '10 5',
              }}
              eventHandlers={{
                click: () => selectZone(zoneDef.id),
              }}
            >
              <Tooltip
                permanent
                direction="center"
                className="confluence-tooltip"
              >
                <span style={{ color: zoneDef.color, fontWeight: 'bold' }}>
                  {zone?.name.split(' - ')[0] || zoneDef.id}
                </span>
              </Tooltip>
            </Polygon>
          );
        })}

        {/* Confluence point markers */}
        {base.layout.confluencePoints.map((cp) => {
          const zone = base.zones.find(z => z.id === cp.zoneId);
          const latest = getLatestSample(cp.zoneId);
          const alertLevel: AlertLevel = latest ? getZoneAlertLevel(latest.pathogens) : 'normal';

          return (
            <Marker
              key={cp.zoneId + '-confluence'}
              position={[cp.geoPosition.lat, cp.geoPosition.lng]}
              icon={createConfluenceIcon(alertLevel)}
            >
              <Tooltip
                direction="top"
                offset={[0, -20]}
                className="confluence-tooltip"
              >
                <div>
                  <div style={{ color: getAlertColor(alertLevel), fontWeight: 'bold', textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.1em' }}>
                    ▼ CONFLUENCE POINT
                  </div>
                  <div style={{ marginTop: 3 }}>{zone?.confluencePoint}</div>
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend overlay */}
      <div style={{
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 1000,
        background: 'rgba(10,10,20,0.88)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 3,
        padding: '10px 14px',
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 11,
        color: '#8a8a9a',
        letterSpacing: '0.04em',
      }}>
        <div style={{ color: '#e0e0e8', fontWeight: 'bold', marginBottom: 6, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          ZONE OVERLAY
        </div>
        {base.layout.zones.map(z => {
          const zone = base.zones.find(bz => bz.id === z.id);
          return (
            <div
              key={z.id}
              onClick={() => selectZone(z.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '3px 0', cursor: 'pointer',
                opacity: selectedZoneId === z.id ? 1 : 0.7,
              }}
            >
              <div style={{
                width: 12, height: 12, borderRadius: 2,
                background: z.color,
                opacity: selectedZoneId === z.id ? 0.8 : 0.4,
                border: selectedZoneId === z.id ? `1px solid ${z.color}` : '1px solid transparent',
              }} />
              <span>{zone?.name || z.id}</span>
            </div>
          );
        })}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{
            width: 12, height: 12, borderRadius: '50%',
            background: 'radial-gradient(circle, #fff 30%, transparent 70%)',
            boxShadow: '0 0 6px rgba(255,255,255,0.5)',
          }} />
          <span>합류지점</span>
        </div>
      </div>
    </div>
  );
}
