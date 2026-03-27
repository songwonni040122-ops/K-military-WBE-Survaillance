import { useRef, useCallback, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useBaseData } from '../../hooks/useBaseData';
import { useAppStore } from '../../stores/appStore';
import { alertColors } from '../../utils/colorScale';
import MapControls from './MapControls';

const SOUTH_KOREA_CENTER: [number, number] = [127.5, 36.5];
const DEFAULT_ZOOM = 7;

const baseTypeLabels: Record<string, string> = {
  infantry: '보병',
  armored: '기갑',
  artillery: '포병',
  logistics: '군수',
  airforce: '공군/공수',
  headquarters: '사령부',
};

export default function MapView() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const { bases } = useBaseData();
  const selectBase = useAppStore((s) => s.selectBase);
  const selectedBaseId = useAppStore((s) => s.selectedBaseId);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'carto-dark': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
          },
        },
        layers: [
          {
            id: 'carto-dark-layer',
            type: 'raster',
            source: 'carto-dark',
            minzoom: 0,
            maxzoom: 20,
          },
        ],
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      },
      center: SOUTH_KOREA_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: 6,
      maxZoom: 18,
      pitch: 0,
      bearing: 0,
    });

    map.addControl(new maplibregl.NavigationControl(), 'bottom-left');

    map.on('load', () => {
      mapRef.current = map;
      setMapReady(true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Add all layers when map is ready
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || bases.length === 0) return;

    // -- Boundary polygons for each base --
    bases.forEach((base) => {
      const sourceId = `boundary-${base.id}`;
      if (map.getSource(sourceId)) return;

      const coords = base.boundary.map(([lat, lng]) => [lng, lat]);
      if (coords.length > 0) coords.push(coords[0]);

      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: { baseId: base.id },
          geometry: { type: 'Polygon', coordinates: [coords] },
        },
      });

      map.addLayer({
        id: `boundary-fill-${base.id}`,
        type: 'fill',
        source: sourceId,
        paint: { 'fill-color': '#cc2222', 'fill-opacity': 0.18 },
      });

      map.addLayer({
        id: `boundary-line-${base.id}`,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#cc3333',
          'line-width': 2,
          'line-opacity': 0.7,
          'line-dasharray': [6, 4],
        },
      });

      // Boundary hover
      map.on('mouseenter', `boundary-fill-${base.id}`, () => {
        map.getCanvas().style.cursor = 'pointer';
        map.setPaintProperty(`boundary-fill-${base.id}`, 'fill-opacity', 0.35);
      });
      map.on('mouseleave', `boundary-fill-${base.id}`, () => {
        map.getCanvas().style.cursor = '';
        map.setPaintProperty(`boundary-fill-${base.id}`, 'fill-opacity', 0.18);
      });
      // Boundary click
      map.on('click', `boundary-fill-${base.id}`, () => {
        flyToBase(map, base.id);
      });
    });

    // -- Native circle markers (GeoJSON source + circle layer) --
    const markersGeoJSON: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: bases.map((base) => ({
        type: 'Feature' as const,
        properties: {
          baseId: base.id,
          name: base.name,
          type: base.type,
          region: base.region,
          alertLevel: base.alertLevel,
          personnelCount: base.personnelCount,
          color: alertColors[base.alertLevel],
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [base.location.lng, base.location.lat],
        },
      })),
    };

    if (!map.getSource('base-markers')) {
      map.addSource('base-markers', { type: 'geojson', data: markersGeoJSON });

      // Glow layer (larger, more transparent)
      map.addLayer({
        id: 'base-markers-glow',
        type: 'circle',
        source: 'base-markers',
        paint: {
          'circle-radius': [
            'match', ['get', 'alertLevel'],
            'critical', 18, 'warning', 15, 12,
          ],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.15,
          'circle-blur': 1,
        },
      });

      // Main circle layer
      map.addLayer({
        id: 'base-markers-circle',
        type: 'circle',
        source: 'base-markers',
        paint: {
          'circle-radius': [
            'match', ['get', 'alertLevel'],
            'critical', 10, 'warning', 8, 6,
          ],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.8,
          'circle-stroke-width': 2,
          'circle-stroke-color': ['get', 'color'],
          'circle-stroke-opacity': 0.6,
        },
      });

      // Hover: change cursor + enlarge
      map.on('mouseenter', 'base-markers-circle', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        // Show popup on hover
        if (e.features && e.features[0]) {
          const feat = e.features[0];
          const props = feat.properties!;
          const coords = (feat.geometry as GeoJSON.Point).coordinates as [number, number];
          const color = props.color;
          const typeLabel = baseTypeLabels[props.type] || props.type;

          if (popupRef.current) popupRef.current.remove();

          popupRef.current = new maplibregl.Popup({
            offset: 15,
            closeButton: false,
            closeOnClick: false,
          })
            .setLngLat(coords)
            .setHTML(`
              <div style="
                background: #0d0d15; color: #e0e0e8; padding: 12px;
                border-radius: 4px; font-family: 'Share Tech Mono', monospace;
                min-width: 180px; border: 1px solid rgba(255,255,255,0.1);
              ">
                <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 4px;">
                  ${props.name}
                </div>
                <div style="font-size: 0.75rem; color: #8888a0; margin-bottom: 8px;">
                  ${typeLabel} | ${props.region}
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="
                    font-size: 0.7rem; padding: 2px 8px; border-radius: 2px;
                    background: ${color}20; color: ${color}; border: 1px solid ${color}40;
                    text-transform: uppercase;
                  ">${props.alertLevel}</span>
                  <span style="font-size: 0.7rem; color: #8888a0;">
                    ${Number(props.personnelCount).toLocaleString()}명
                  </span>
                </div>
                <div style="
                  margin-top: 8px; font-size: 0.65rem; color: #00e5ff;
                  text-align: center; padding: 4px;
                  border: 1px solid rgba(0,229,255,0.2); border-radius: 2px;
                ">
                  클릭하여 상세 보기 &rarr;
                </div>
              </div>
            `)
            .addTo(map);
        }
      });

      map.on('mouseleave', 'base-markers-circle', () => {
        map.getCanvas().style.cursor = '';
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      });

      // Click: fly to boundary
      map.on('click', 'base-markers-circle', (e) => {
        if (e.features && e.features[0]) {
          const baseId = e.features[0].properties!.baseId;
          if (popupRef.current) {
            popupRef.current.remove();
            popupRef.current = null;
          }
          flyToBase(map, baseId);
        }
      });
    }
  }, [mapReady, bases]);

  const flyToBase = useCallback((map: maplibregl.Map, baseId: string) => {
    const base = bases.find((b) => b.id === baseId);
    if (!base) return;

    selectBase(base.id);

    const lngs = base.boundary.map(([, lng]) => lng);
    const lats = base.boundary.map(([lat]) => lat);
    const bounds = new maplibregl.LngLatBounds(
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)],
    );

    map.fitBounds(bounds, {
      padding: 80,
      duration: 2000,
      pitch: 0,
      bearing: 0,
    });
  }, [selectBase, bases]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '100%', background: '#0a0a0f' }}
      />
      <MapControls />
      {selectedBaseId && <BackButton />}
      <style>{`
        .maplibregl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .maplibregl-popup-tip {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

function BackButton() {
  const goBack = useAppStore((s) => s.goBack);

  const handleBack = useCallback(() => {
    goBack();
    const container = document.querySelector('.maplibregl-map') as HTMLElement;
    if (container) {
      const map = (container as unknown as { _map?: maplibregl.Map })._map;
      if (map) {
        map.flyTo({
          center: SOUTH_KOREA_CENTER,
          zoom: DEFAULT_ZOOM,
          pitch: 0,
          bearing: 0,
          duration: 1500,
        });
      }
    }
  }, [goBack]);

  return (
    <button
      onClick={handleBack}
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 1000,
        background: 'rgba(10,10,15,0.9)',
        border: '1px solid rgba(0,229,255,0.3)',
        color: '#00e5ff',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        padding: '6px 14px',
        cursor: 'pointer',
        borderRadius: 2,
        backdropFilter: 'blur(8px)',
      }}
    >
      &larr; 전체 지도
    </button>
  );
}
