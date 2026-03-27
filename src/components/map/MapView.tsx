import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import BaseMarker from './BaseMarker';
import MapControls from './MapControls';
import { useBaseData } from '../../hooks/useBaseData';
import 'leaflet/dist/leaflet.css';

const SOUTH_KOREA_CENTER: [number, number] = [36.5, 127.5];
const DEFAULT_ZOOM = 7;

export default function MapView() {
  const { bases } = useBaseData();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapContainer
        center={SOUTH_KOREA_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        style={{ width: '100%', height: '100%', background: '#0a0a0f' }}
        minZoom={6}
        maxZoom={12}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <ZoomControl position="bottomleft" />
        {bases.map((base) => (
          <BaseMarker key={base.id} base={base} />
        ))}
      </MapContainer>
      <MapControls />
    </div>
  );
}
