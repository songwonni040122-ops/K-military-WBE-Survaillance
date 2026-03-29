import { useRef, useCallback, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useBaseData } from '../../hooks/useBaseData';
import { useAppStore } from '../../stores/appStore';
import { alertColors } from '../../utils/colorScale';
import { generateZonePolygons } from '../../utils/zonePolygons';
import MapControls from './MapControls';
import { bases as allBases, divisions } from '../../data/bases';
import { getBaseAlertLevel, getZoneAlertLevel } from '../../utils/alertLevel';
import { getLatestSample } from '../../data/samples';
import type { AlertLevel } from '../../types';

const SEOUL_CENTER: [number, number] = [126.98, 37.56];
const DEFAULT_ZOOM = 11;

function createHatchPattern(): { width: number; height: number; data: Uint8Array } {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = 'rgba(200, 40, 40, 0.6)';
  ctx.lineWidth = 2;
  for (let i = -size; i < size * 2; i += 8) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + size, size); ctx.stroke();
  }
  const imgData = ctx.getImageData(0, 0, size, size);
  return { width: size, height: size, data: new Uint8Array(imgData.data.buffer) };
}

function flyToBounds(map: maplibregl.Map, baseId: string) {
  const base = allBases.find((b) => b.id === baseId);
  if (!base) return;
  const lngs = base.boundary.map(([, lng]) => lng);
  const lats = base.boundary.map(([lat]) => lat);
  map.fitBounds(
    new maplibregl.LngLatBounds([Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]),
    { padding: 80, duration: 2000, pitch: 50, bearing: -20 },
  );
}

function getDivisionAlertLevel(divId: string): AlertLevel {
  const div = divisions.find((d) => d.id === divId);
  if (!div) return 'normal';
  const levels: AlertLevel[] = div.baseIds.map((bid) => {
    const base = allBases.find((b) => b.id === bid);
    if (!base) return 'normal' as AlertLevel;
    const zoneAlerts = base.zones.map((z) => {
      const latest = getLatestSample(z.id);
      return latest ? getZoneAlertLevel(latest.pathogens) : ('normal' as AlertLevel);
    });
    return getBaseAlertLevel(zoneAlerts);
  });
  return getBaseAlertLevel(levels);
}

export default function MapView() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const { bases } = useBaseData();
  const selectBase = useAppStore((s) => s.selectBase);
  const selectDivision = useAppStore((s) => s.selectDivision);
  const selectZone = useAppStore((s) => s.selectZone);
  const selectedBaseId = useAppStore((s) => s.selectedBaseId);
  const selectedDivisionId = useAppStore((s) => s.selectedDivisionId);
  const setMapInstance = useAppStore((s) => s.setMapInstance);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: { 'carto-dark': { type: 'raster', tiles: [
          'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
          'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
          'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        ], tileSize: 256, attribution: '&copy; CARTO' }},
        layers: [{ id: 'carto-dark-layer', type: 'raster', source: 'carto-dark', minzoom: 0, maxzoom: 20 }],
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      },
      center: SEOUL_CENTER, zoom: DEFAULT_ZOOM, minZoom: 6, maxZoom: 18, pitch: 0, bearing: 0,
    });
    map.addControl(new maplibregl.NavigationControl(), 'bottom-left');
    map.on('load', () => {
      map.addImage('hatch-pattern', createHatchPattern(), { pixelRatio: 2 });
      mapRef.current = map;
      setMapInstance(map);
      setMapReady(true);
    });
    return () => { setMapInstance(null); map.remove(); mapRef.current = null; };
  }, [setMapInstance]);

  // Fly to division area + show only division's bases
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    // Find which baseIds belong to selected division
    const div = selectedDivisionId ? divisions.find((d) => d.id === selectedDivisionId) : null;
    const divBaseIds = div ? new Set(div.baseIds) : null;

    // Toggle visibility of each base's boundary layers
    bases.forEach((base) => {
      const show = divBaseIds ? divBaseIds.has(base.id) : false;
      if (map.getLayer(`boundary-fill-${base.id}`)) {
        map.setLayoutProperty(`boundary-fill-${base.id}`, 'visibility', show ? 'visible' : 'none');
        map.setLayoutProperty(`boundary-line-${base.id}`, 'visibility', show ? 'visible' : 'none');
      }
    });

    // Toggle base markers filter
    if (map.getLayer('base-markers-circle')) {
      if (divBaseIds) {
        map.setFilter('base-markers-circle', ['in', ['get', 'baseId'], ['literal', [...divBaseIds]]]);
      } else {
        map.setFilter('base-markers-circle', ['==', ['get', 'baseId'], '']); // hide all
      }
    }

    // Fly to division bounds
    if (div && !selectedBaseId) {
      const divBases = div.baseIds.map((bid) => allBases.find((b) => b.id === bid)).filter(Boolean);
      const allLngs = divBases.flatMap((b) => b!.boundary.map(([, lng]) => lng));
      const allLats = divBases.flatMap((b) => b!.boundary.map(([lat]) => lat));
      if (allLngs.length > 0) {
        map.fitBounds(
          new maplibregl.LngLatBounds([Math.min(...allLngs), Math.min(...allLats)], [Math.max(...allLngs), Math.max(...allLats)]),
          { padding: 60, duration: 1500, pitch: 0, bearing: 0 },
        );
      }
    }

    // When no division selected, reset to Seoul view
    if (!selectedDivisionId && !selectedBaseId) {
      map.flyTo({ center: SEOUL_CENTER, zoom: DEFAULT_ZOOM, pitch: 0, bearing: 0, duration: 1500 });
    }
  }, [selectedDivisionId, selectedBaseId, mapReady, bases]);

  // Fly to selected base
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !selectedBaseId) return;
    flyToBounds(map, selectedBaseId);
    bases.forEach((base) => {
      if (!map.getLayer(`boundary-fill-${base.id}`)) return;
      if (base.id === selectedBaseId) {
        map.setPaintProperty(`boundary-fill-${base.id}`, 'fill-pattern', 'hatch-pattern');
        map.setPaintProperty(`boundary-line-${base.id}`, 'line-color', '#ff3333');
        map.setPaintProperty(`boundary-line-${base.id}`, 'line-width', 3);
        map.setPaintProperty(`boundary-line-${base.id}`, 'line-opacity', 0.9);
      } else {
        map.setPaintProperty(`boundary-fill-${base.id}`, 'fill-pattern', '');
        map.setPaintProperty(`boundary-fill-${base.id}`, 'fill-color', '#cc2222');
        map.setPaintProperty(`boundary-line-${base.id}`, 'line-color', '#cc3333');
        map.setPaintProperty(`boundary-line-${base.id}`, 'line-width', 2);
        map.setPaintProperty(`boundary-line-${base.id}`, 'line-opacity', 0.7);
      }
    });
  }, [selectedBaseId, mapReady, bases]);

  // Add all layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || bases.length === 0) return;

    // -- Division markers --
    if (!map.getSource('div-markers')) {
      const divGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: divisions.map((div) => {
          const level = getDivisionAlertLevel(div.id);
          return {
            type: 'Feature' as const,
            properties: {
              divId: div.id, name: div.name, type: div.type,
              alertLevel: level, color: alertColors[level],
              baseCount: div.baseIds.length,
            },
            geometry: { type: 'Point' as const, coordinates: [div.center.lng, div.center.lat] },
          };
        }),
      };
      map.addSource('div-markers', { type: 'geojson', data: divGeoJSON });
      map.addLayer({
        id: 'div-markers-glow', type: 'circle', source: 'div-markers',
        layout: { 'circle-sort-key': ['match', ['get', 'alertLevel'], 'critical', 3, 'warning', 2, 'caution', 1, 0] },
        paint: { 'circle-radius': 22, 'circle-color': ['get', 'color'], 'circle-opacity': 0.12, 'circle-blur': 1 },
        maxzoom: 13,
      });
      map.addLayer({
        id: 'div-markers-circle', type: 'circle', source: 'div-markers',
        layout: { 'circle-sort-key': ['match', ['get', 'alertLevel'], 'critical', 3, 'warning', 2, 'caution', 1, 0] },
        paint: {
          'circle-radius': ['match', ['get', 'type'], 'brigade', 10, 14],
          'circle-color': ['get', 'color'], 'circle-opacity': 0.9,
          'circle-stroke-width': 2, 'circle-stroke-color': ['get', 'color'], 'circle-stroke-opacity': 0.5,
        },
        maxzoom: 13,
      });
      map.on('mouseenter', 'div-markers-circle', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        if (e.features?.[0]) {
          const p = e.features[0].properties!;
          const coords = (e.features[0].geometry as GeoJSON.Point).coordinates as [number, number];
          if (popupRef.current) popupRef.current.remove();
          popupRef.current = new maplibregl.Popup({ offset: 15, closeButton: false, closeOnClick: false })
            .setLngLat(coords)
            .setHTML(`<div style="background:#0d0d15;color:#e0e0e8;padding:10px;border-radius:4px;font-family:'Share Tech Mono',monospace;min-width:140px;border:1px solid rgba(255,255,255,0.1);">
              <div style="font-weight:700;font-size:0.85rem;margin-bottom:4px;">${p.name}</div>
              <div style="font-size:0.7rem;color:#8888a0;margin-bottom:6px;">${p.type === 'brigade' ? '독립여단' : '사단'} | ${p.baseCount}개 부대</div>
              <div style="font-size:0.65rem;color:#00e5ff;text-align:center;padding:3px;border:1px solid rgba(0,229,255,0.2);border-radius:2px;">클릭하여 상세 보기 &rarr;</div>
            </div>`)
            .addTo(map);
        }
      });
      map.on('mouseleave', 'div-markers-circle', () => {
        map.getCanvas().style.cursor = '';
        if (popupRef.current) { popupRef.current.remove(); popupRef.current = null; }
      });
      map.on('click', 'div-markers-circle', (e) => {
        if (e.features?.[0]) {
          if (popupRef.current) { popupRef.current.remove(); popupRef.current = null; }
          selectDivision(e.features[0].properties!.divId);
        }
      });
    }

    // -- Boundary polygons --
    bases.forEach((base) => {
      const sourceId = `boundary-${base.id}`;
      if (map.getSource(sourceId)) return;
      const coords = base.boundary.map(([lat, lng]) => [lng, lat]);
      if (coords.length > 0) coords.push(coords[0]);
      map.addSource(sourceId, {
        type: 'geojson',
        data: { type: 'Feature', properties: { baseId: base.id }, geometry: { type: 'Polygon', coordinates: [coords] } },
      });
      map.addLayer({ id: `boundary-fill-${base.id}`, type: 'fill', source: sourceId, layout: { visibility: 'none' }, paint: { 'fill-color': '#cc2222', 'fill-opacity': 0.18 } });
      map.addLayer({ id: `boundary-line-${base.id}`, type: 'line', source: sourceId, layout: { visibility: 'none' }, paint: { 'line-color': '#cc3333', 'line-width': 2, 'line-opacity': 0.7, 'line-dasharray': [6, 4] } });

      map.on('mouseenter', `boundary-fill-${base.id}`, () => {
        map.getCanvas().style.cursor = 'pointer';
        map.setPaintProperty(`boundary-fill-${base.id}`, 'fill-opacity', 0.35);
        map.setFilter('zone-fills', ['all', ['==', ['geometry-type'], 'Polygon'], ['==', ['get', 'baseId'], base.id]]);
        map.setFilter('zone-outlines', ['all', ['==', ['geometry-type'], 'Polygon'], ['==', ['get', 'baseId'], base.id]]);
        map.setFilter('zone-borders', ['all', ['==', ['geometry-type'], 'LineString'], ['==', ['get', 'baseId'], base.id]]);
      });
      map.on('mouseleave', `boundary-fill-${base.id}`, () => {
        map.getCanvas().style.cursor = '';
        map.setPaintProperty(`boundary-fill-${base.id}`, 'fill-opacity', 0.18);
        map.setFilter('zone-fills', ['all', ['==', ['geometry-type'], 'Polygon'], ['==', ['get', 'baseId'], '']]);
        map.setFilter('zone-outlines', ['all', ['==', ['geometry-type'], 'Polygon'], ['==', ['get', 'baseId'], '']]);
        map.setFilter('zone-borders', ['all', ['==', ['geometry-type'], 'LineString'], ['==', ['get', 'baseId'], '']]);
      });
      map.on('click', `boundary-fill-${base.id}`, () => selectBase(base.id));
    });

    // -- Base markers (shown at higher zoom) --
    if (!map.getSource('base-markers')) {
      const markersGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: bases.map((base) => ({
          type: 'Feature' as const,
          properties: { baseId: base.id, name: base.name, alertLevel: base.alertLevel, color: alertColors[base.alertLevel], personnelCount: base.personnelCount },
          geometry: { type: 'Point' as const, coordinates: [base.location.lng, base.location.lat] },
        })),
      };
      map.addSource('base-markers', { type: 'geojson', data: markersGeoJSON });
      map.addLayer({
        id: 'base-markers-circle', type: 'circle', source: 'base-markers',
        filter: ['==', ['get', 'baseId'], ''], // hidden by default
        layout: { 'circle-sort-key': ['match', ['get', 'alertLevel'], 'critical', 3, 'warning', 2, 'caution', 1, 0] },
        paint: { 'circle-radius': 6, 'circle-color': ['get', 'color'], 'circle-opacity': 0.8, 'circle-stroke-width': 1.5, 'circle-stroke-color': ['get', 'color'], 'circle-stroke-opacity': 0.5 },
      });
      map.on('click', 'base-markers-circle', (e) => {
        if (e.features?.[0]) selectBase(e.features[0].properties!.baseId);
      });
    }

    // -- Zone polygons --
    if (!map.getSource('zone-polygons')) {
      const zonesGeoJSON = generateZonePolygons(allBases);
      map.addSource('zone-polygons', { type: 'geojson', data: zonesGeoJSON });
      map.addLayer({ id: 'zone-fills', type: 'fill', source: 'zone-polygons', filter: ['all', ['==', ['geometry-type'], 'Polygon'], ['==', ['get', 'baseId'], '']], paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.3 } });
      map.addLayer({ id: 'zone-outlines', type: 'line', source: 'zone-polygons', filter: ['all', ['==', ['geometry-type'], 'Polygon'], ['==', ['get', 'baseId'], '']], paint: { 'line-color': ['get', 'color'], 'line-width': 1.5, 'line-opacity': 0.5 } });
      map.on('click', 'zone-fills', (e) => {
        if (e.features?.[0]) {
          const p = e.features[0].properties!;
          if (p.baseId !== useAppStore.getState().selectedBaseId) selectBase(p.baseId);
          selectZone(p.zoneId);
          e.originalEvent.stopPropagation();
        }
      });
      map.addLayer({ id: 'zone-borders', type: 'line', source: 'zone-polygons', filter: ['all', ['==', ['geometry-type'], 'LineString'], ['==', ['get', 'baseId'], '']], paint: { 'line-color': '#ffffff', 'line-width': 1.5, 'line-opacity': 0.4, 'line-dasharray': [3, 2] } });
    }
  }, [mapReady, bases, selectBase, selectDivision, selectZone]);

  const viewMode = useAppStore((s) => s.viewMode);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', background: '#0a0a0f' }} />
      <MapControls />
      {viewMode !== 'overview' && <BackButton />}
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
    if (mapInstance && !useAppStore.getState().selectedBaseId && !useAppStore.getState().selectedDivisionId) {
      mapInstance.flyTo({ center: SEOUL_CENTER, zoom: DEFAULT_ZOOM, pitch: 0, bearing: 0, duration: 1500 });
    }
  }, [goBack, mapInstance]);
  return (
    <button onClick={handleBack} style={{
      position: 'absolute', top: 12, left: 12, zIndex: 1000,
      background: 'rgba(10,10,15,0.9)', border: '1px solid rgba(0,229,255,0.3)',
      color: '#00e5ff', fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
      padding: '6px 14px', cursor: 'pointer', borderRadius: 2, backdropFilter: 'blur(8px)',
    }}>
      &larr; 뒤로
    </button>
  );
}
