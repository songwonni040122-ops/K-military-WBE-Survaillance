import { useRef, useCallback, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useBaseData } from '../../hooks/useBaseData';
import { useAppStore } from '../../stores/appStore';
import { alertColors } from '../../utils/colorScale';
import { generateZonePolygons } from '../../utils/zonePolygons';
import MapControls from './MapControls';
import { bases as allBases } from '../../data/bases';

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

/** Create a 32x32 hatch pattern as ImageData for MapLibre */
function createHatchPattern(): { width: number; height: number; data: Uint8Array } {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = 'rgba(200, 40, 40, 0.6)';
  ctx.lineWidth = 2;
  for (let i = -size; i < size * 2; i += 8) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + size, size);
    ctx.stroke();
  }
  const imgData = ctx.getImageData(0, 0, size, size);
  return { width: size, height: size, data: new Uint8Array(imgData.data.buffer) };
}

function flyToBounds(map: maplibregl.Map, baseId: string) {
  const base = allBases.find((b) => b.id === baseId);
  if (!base) return;
  const lngs = base.boundary.map(([, lng]) => lng);
  const lats = base.boundary.map(([lat]) => lat);
  const bounds = new maplibregl.LngLatBounds(
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  );
  map.fitBounds(bounds, { padding: 80, duration: 2000, pitch: 50, bearing: -20 });
}

export default function MapView() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const hoveredBaseRef = useRef<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const { bases } = useBaseData();
  const selectBase = useAppStore((s) => s.selectBase);
  const selectZone = useAppStore((s) => s.selectZone);
  const selectedBaseId = useAppStore((s) => s.selectedBaseId);
  const setMapInstance = useAppStore((s) => s.setMapInstance);

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
          { id: 'carto-dark-layer', type: 'raster', source: 'carto-dark', minzoom: 0, maxzoom: 20 },
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
      // Register hatch pattern image
      map.addImage('hatch-pattern', createHatchPattern(), { pixelRatio: 2 });
      mapRef.current = map;
      setMapInstance(map);
      setMapReady(true);
    });

    return () => {
      setMapInstance(null);
      map.remove();
      mapRef.current = null;
    };
  }, [setMapInstance]);

  // Fly to selected base
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    if (selectedBaseId) {
      flyToBounds(map, selectedBaseId);
      // Apply hatch pattern to selected base
      bases.forEach((base) => {
        if (base.id === selectedBaseId) {
          map.setPaintProperty(`boundary-fill-${base.id}`, 'fill-pattern', 'hatch-pattern');
          map.setPaintProperty(`boundary-line-${base.id}`, 'line-color', '#ff3333');
          map.setPaintProperty(`boundary-line-${base.id}`, 'line-width', 3);
          map.setPaintProperty(`boundary-line-${base.id}`, 'line-opacity', 0.9);
          map.setPaintProperty(`boundary-line-${base.id}`, 'line-dasharray', [1]);
        } else {
          map.setPaintProperty(`boundary-fill-${base.id}`, 'fill-pattern', '');
          map.setPaintProperty(`boundary-fill-${base.id}`, 'fill-color', '#cc2222');
          map.setPaintProperty(`boundary-line-${base.id}`, 'line-color', '#cc3333');
          map.setPaintProperty(`boundary-line-${base.id}`, 'line-width', 2);
          map.setPaintProperty(`boundary-line-${base.id}`, 'line-opacity', 0.7);
          map.setPaintProperty(`boundary-line-${base.id}`, 'line-dasharray', [6, 4]);
        }
      });
    } else {
      // Reset all to default
      bases.forEach((base) => {
        if (map.getLayer(`boundary-fill-${base.id}`)) {
          map.setPaintProperty(`boundary-fill-${base.id}`, 'fill-pattern', '');
          map.setPaintProperty(`boundary-fill-${base.id}`, 'fill-color', '#cc2222');
          map.setPaintProperty(`boundary-line-${base.id}`, 'line-color', '#cc3333');
          map.setPaintProperty(`boundary-line-${base.id}`, 'line-width', 2);
          map.setPaintProperty(`boundary-line-${base.id}`, 'line-opacity', 0.7);
          map.setPaintProperty(`boundary-line-${base.id}`, 'line-dasharray', [6, 4]);
        }
      });
    }
  }, [selectedBaseId, mapReady, bases]);

  // Add all layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || bases.length === 0) return;

    // -- Boundary polygons --
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

      // Hover on boundary → show zones for this base
      map.on('mouseenter', `boundary-fill-${base.id}`, () => {
        map.getCanvas().style.cursor = 'pointer';
        map.setPaintProperty(`boundary-fill-${base.id}`, 'fill-opacity', 0.35);
        // Show zones for this base
        hoveredBaseRef.current = base.id;
        map.setFilter('zone-fills', ['all', ['==', ['geometry-type'], 'Polygon'], ['==', ['get', 'baseId'], base.id]]);
        map.setFilter('zone-outlines', ['all', ['==', ['geometry-type'], 'Polygon'], ['==', ['get', 'baseId'], base.id]]);
        map.setFilter('zone-borders', ['all', ['==', ['geometry-type'], 'LineString'], ['==', ['get', 'baseId'], base.id]]);
      });

      map.on('mouseleave', `boundary-fill-${base.id}`, () => {
        map.getCanvas().style.cursor = '';
        map.setPaintProperty(`boundary-fill-${base.id}`, 'fill-opacity', 0.18);
        // Hide zones
        hoveredBaseRef.current = null;
        map.setFilter('zone-fills', ['all', ['==', ['geometry-type'], 'Polygon'], ['==', ['get', 'baseId'], '']]);
        map.setFilter('zone-outlines', ['all', ['==', ['geometry-type'], 'Polygon'], ['==', ['get', 'baseId'], '']]);
        map.setFilter('zone-borders', ['all', ['==', ['geometry-type'], 'LineString'], ['==', ['get', 'baseId'], '']]);
      });

      map.on('click', `boundary-fill-${base.id}`, () => {
        selectBase(base.id);
      });
    });

    // -- Circle markers --
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

      map.addLayer({
        id: 'base-markers-glow',
        type: 'circle',
        source: 'base-markers',
        paint: {
          'circle-radius': ['match', ['get', 'alertLevel'], 'critical', 18, 'warning', 15, 12],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.15,
          'circle-blur': 1,
        },
      });

      map.addLayer({
        id: 'base-markers-circle',
        type: 'circle',
        source: 'base-markers',
        paint: {
          'circle-radius': ['match', ['get', 'alertLevel'], 'critical', 10, 'warning', 8, 6],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.8,
          'circle-stroke-width': 2,
          'circle-stroke-color': ['get', 'color'],
          'circle-stroke-opacity': 0.6,
        },
      });

      map.on('mouseenter', 'base-markers-circle', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        if (e.features && e.features[0]) {
          const feat = e.features[0];
          const props = feat.properties!;
          const coords = (feat.geometry as GeoJSON.Point).coordinates as [number, number];
          const color = props.color;
          const typeLabel = baseTypeLabels[props.type] || props.type;
          if (popupRef.current) popupRef.current.remove();
          popupRef.current = new maplibregl.Popup({ offset: 15, closeButton: false, closeOnClick: false })
            .setLngLat(coords)
            .setHTML(`
              <div style="background:#0d0d15;color:#e0e0e8;padding:12px;border-radius:4px;font-family:'Share Tech Mono',monospace;min-width:180px;border:1px solid rgba(255,255,255,0.1);">
                <div style="font-weight:700;font-size:0.9rem;margin-bottom:4px;">${props.name}</div>
                <div style="font-size:0.75rem;color:#8888a0;margin-bottom:8px;">${typeLabel} | ${props.region}</div>
                <div style="display:flex;align-items:center;justify-content:space-between;">
                  <span style="font-size:0.7rem;padding:2px 8px;border-radius:2px;background:${color}20;color:${color};border:1px solid ${color}40;text-transform:uppercase;">${props.alertLevel}</span>
                  <span style="font-size:0.7rem;color:#8888a0;">${Number(props.personnelCount).toLocaleString()}명</span>
                </div>
                <div style="margin-top:8px;font-size:0.65rem;color:#00e5ff;text-align:center;padding:4px;border:1px solid rgba(0,229,255,0.2);border-radius:2px;">클릭하여 상세 보기 &rarr;</div>
              </div>`)
            .addTo(map);
        }
      });

      map.on('mouseleave', 'base-markers-circle', () => {
        map.getCanvas().style.cursor = '';
        if (popupRef.current) { popupRef.current.remove(); popupRef.current = null; }
      });

      map.on('click', 'base-markers-circle', (e) => {
        if (e.features && e.features[0]) {
          if (popupRef.current) { popupRef.current.remove(); popupRef.current = null; }
          selectBase(e.features[0].properties!.baseId);
        }
      });
    }

    // -- Zone polygons (hidden by default, shown on hover) --
    if (!map.getSource('zone-polygons')) {
      const zonesGeoJSON = generateZonePolygons(allBases);
      map.addSource('zone-polygons', { type: 'geojson', data: zonesGeoJSON });

      // Zone fill areas (Polygon features only)
      map.addLayer({
        id: 'zone-fills',
        type: 'fill',
        source: 'zone-polygons',
        filter: ['all', ['==', ['geometry-type'], 'Polygon'], ['==', ['get', 'baseId'], '']],
        paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.3 },
      });

      // Zone polygon outlines
      map.addLayer({
        id: 'zone-outlines',
        type: 'line',
        source: 'zone-polygons',
        filter: ['all', ['==', ['geometry-type'], 'Polygon'], ['==', ['get', 'baseId'], '']],
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 1.5,
          'line-opacity': 0.5,
        },
      });

      // Zone click → select zone
      map.on('click', 'zone-fills', (e) => {
        if (e.features && e.features[0]) {
          const props = e.features[0].properties!;
          const baseId = props.baseId;
          const zoneId = props.zoneId;
          // First select the base if not already selected
          if (baseId !== useAppStore.getState().selectedBaseId) {
            selectBase(baseId);
          }
          selectZone(zoneId);
          e.originalEvent.stopPropagation();
        }
      });

      // Staircase border lines (LineString features)
      map.addLayer({
        id: 'zone-borders',
        type: 'line',
        source: 'zone-polygons',
        filter: ['all', ['==', ['geometry-type'], 'LineString'], ['==', ['get', 'baseId'], '']],
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.5,
          'line-opacity': 0.4,
          'line-dasharray': [3, 2],
        },
      });
    }
  }, [mapReady, bases, selectBase]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', background: '#0a0a0f' }} />
      <MapControls />
      {selectedBaseId && <BackButton />}
      <style>{`
        .maplibregl-popup-content { background: transparent !important; padding: 0 !important; box-shadow: none !important; }
        .maplibregl-popup-tip { display: none !important; }
      `}</style>
    </div>
  );
}

function BackButton() {
  const goBack = useAppStore((s) => s.goBack);
  const mapInstance = useAppStore((s) => s.mapInstance);

  const handleBack = useCallback(() => {
    goBack();
    if (mapInstance) {
      mapInstance.flyTo({ center: SOUTH_KOREA_CENTER, zoom: DEFAULT_ZOOM, pitch: 0, bearing: 0, duration: 1500 });
    }
  }, [goBack, mapInstance]);

  return (
    <button onClick={handleBack} style={{
      position: 'absolute', top: 12, left: 12, zIndex: 1000,
      background: 'rgba(10,10,15,0.9)', border: '1px solid rgba(0,229,255,0.3)',
      color: '#00e5ff', fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
      padding: '6px 14px', cursor: 'pointer', borderRadius: 2, backdropFilter: 'blur(8px)',
    }}>
      &larr; 전체 지도
    </button>
  );
}
