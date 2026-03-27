import { useRef, useCallback, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useBaseData } from '../../hooks/useBaseData';
import { useAppStore } from '../../stores/appStore';
import { alertColors } from '../../utils/colorScale';
import { createThreeLayer } from './ThreeOverlay';
import MapControls from './MapControls';
import type { MilitaryBase } from '../../types';
import type { BaseWithAlert } from '../../hooks/useBaseData';

const SOUTH_KOREA_CENTER: [number, number] = [127.5, 36.5]; // [lng, lat] for MapLibre
const DEFAULT_ZOOM = 7;
const DETAIL_ZOOM = 16;
const THREE_LAYER_MIN_ZOOM = 14;

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
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const threeLayerRef = useRef<ReturnType<typeof createThreeLayer> | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const { bases } = useBaseData();
  const selectBase = useAppStore((s) => s.selectBase);
  const selectedBaseId = useAppStore((s) => s.selectedBaseId);
  const selectedZoneId = useAppStore((s) => s.selectedZoneId);

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

  // Add boundary sources/layers and markers when map is ready
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || bases.length === 0) return;

    // Add boundary polygons as GeoJSON sources
    bases.forEach((base) => {
      const sourceId = `boundary-${base.id}`;
      if (map.getSource(sourceId)) return;

      const coords = base.boundary.map(([lat, lng]) => [lng, lat]);
      if (coords.length > 0) coords.push(coords[0]); // close polygon

      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: { baseId: base.id },
          geometry: {
            type: 'Polygon',
            coordinates: [coords],
          },
        },
      });

      map.addLayer({
        id: `boundary-fill-${base.id}`,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': '#cc2222',
          'fill-opacity': 0.18,
        },
        maxzoom: THREE_LAYER_MIN_ZOOM,
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
        maxzoom: THREE_LAYER_MIN_ZOOM,
      });

      // Click handler for boundary
      map.on('click', `boundary-fill-${base.id}`, () => {
        flyToBase(map, base);
      });

      map.on('mouseenter', `boundary-fill-${base.id}`, () => {
        map.getCanvas().style.cursor = 'pointer';
        map.setPaintProperty(`boundary-fill-${base.id}`, 'fill-opacity', 0.35);
      });

      map.on('mouseleave', `boundary-fill-${base.id}`, () => {
        map.getCanvas().style.cursor = '';
        map.setPaintProperty(`boundary-fill-${base.id}`, 'fill-opacity', 0.18);
      });
    });

    // Add markers
    addMarkers(map, bases);

    // Add Three.js layer for 3D buildings
    const threeLayer = createThreeLayer(map, bases);
    threeLayerRef.current = threeLayer;
    map.addLayer(threeLayer.layer);

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [mapReady, bases]);

  // Update Three.js layer when selection changes
  useEffect(() => {
    if (threeLayerRef.current) {
      threeLayerRef.current.setSelection(selectedBaseId, selectedZoneId);
    }
  }, [selectedBaseId, selectedZoneId]);

  const flyToBase = useCallback((map: maplibregl.Map, base: MilitaryBase | BaseWithAlert) => {
    selectBase(base.id);
    map.flyTo({
      center: [base.location.lng, base.location.lat],
      zoom: DETAIL_ZOOM,
      pitch: 55,
      bearing: -20,
      duration: 2000,
    });
  }, [selectBase]);

  const addMarkers = useCallback((map: maplibregl.Map, bases: BaseWithAlert[]) => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    bases.forEach((base) => {
      const color = alertColors[base.alertLevel];
      const size = base.alertLevel === 'critical' ? 24 : base.alertLevel === 'warning' ? 20 : 16;

      const el = document.createElement('div');
      el.className = 'base-marker';
      el.style.cssText = `
        width: ${size}px; height: ${size}px;
        border-radius: 50%;
        background: ${color};
        opacity: 0.8;
        border: 2px solid ${color};
        box-shadow: 0 0 12px ${color}80;
        cursor: pointer;
        transition: transform 0.2s, opacity 0.2s;
      `;
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.3)';
        el.style.opacity = '1';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.opacity = '0.8';
      });

      const popup = new maplibregl.Popup({
        offset: 15,
        closeButton: false,
        className: 'dark-popup',
      }).setHTML(`
        <div style="
          background: #0d0d15; color: #e0e0e8; padding: 12px;
          border-radius: 4px; font-family: 'Share Tech Mono', monospace;
          min-width: 180px; border: 1px solid rgba(255,255,255,0.1);
        ">
          <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 4px;">
            ${base.name}
          </div>
          <div style="font-size: 0.75rem; color: #8888a0; margin-bottom: 8px;">
            ${baseTypeLabels[base.type] || base.type} | ${base.region}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="
              font-size: 0.7rem; padding: 2px 8px; border-radius: 2px;
              background: ${color}20; color: ${color}; border: 1px solid ${color}40;
              text-transform: uppercase;
            ">${base.alertLevel}</span>
            <span style="font-size: 0.7rem; color: #8888a0;">
              ${base.personnelCount.toLocaleString()}명
            </span>
          </div>
          <div style="
            margin-top: 8px; font-size: 0.65rem; color: #00e5ff;
            text-align: center; padding: 4px;
            border: 1px solid rgba(0,229,255,0.2); border-radius: 2px;
          ">
            클릭하여 3D 뷰 &rarr;
          </div>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([base.location.lng, base.location.lat])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        popup.remove();
        flyToBase(map, base);
      });

      markersRef.current.push(marker);
    });
  }, [flyToBase]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '100%', background: '#0a0a0f' }}
      />
      <MapControls />
      {selectedBaseId && (
        <BackButton />
      )}
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
