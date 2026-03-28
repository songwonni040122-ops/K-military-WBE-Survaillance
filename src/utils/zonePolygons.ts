import type { MilitaryBase } from '../types';

/**
 * Clip polygon to vertical strip [leftLng, rightLng] using Sutherland-Hodgman.
 */
function clipToStrip(polygon: number[][], leftLng: number, rightLng: number): number[][] {
  let out = clipLeft(polygon, leftLng);
  out = clipRight(out, rightLng);
  return out;
}

function clipLeft(poly: number[][], xMin: number): number[][] {
  if (poly.length === 0) return [];
  const out: number[][] = [];
  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i];
    const prev = poly[(i + poly.length - 1) % poly.length];
    if (cur[0] >= xMin) {
      if (prev[0] < xMin) out.push(xIntersect(prev, cur, xMin));
      out.push(cur);
    } else if (prev[0] >= xMin) {
      out.push(xIntersect(prev, cur, xMin));
    }
  }
  return out;
}

function clipRight(poly: number[][], xMax: number): number[][] {
  if (poly.length === 0) return [];
  const out: number[][] = [];
  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i];
    const prev = poly[(i + poly.length - 1) % poly.length];
    if (cur[0] <= xMax) {
      if (prev[0] > xMax) out.push(xIntersect(prev, cur, xMax));
      out.push(cur);
    } else if (prev[0] <= xMax) {
      out.push(xIntersect(prev, cur, xMax));
    }
  }
  return out;
}

function xIntersect(a: number[], b: number[], x: number): number[] {
  const t = (x - a[0]) / (b[0] - a[0]);
  return [x, a[1] + t * (b[1] - a[1])];
}

/**
 * Generate staircase (right-angle zigzag) polyline for a zone border.
 */
function makeStaircaseBorder(
  cutLng: number,
  boundary: number[][],
  jitter: number,
  seed: number,
): number[][] {
  const intersections: number[] = [];
  for (let i = 0; i < boundary.length; i++) {
    const a = boundary[i];
    const b = boundary[(i + 1) % boundary.length];
    if ((a[0] <= cutLng && b[0] >= cutLng) || (a[0] >= cutLng && b[0] <= cutLng)) {
      if (Math.abs(b[0] - a[0]) > 1e-12) {
        const t = (cutLng - a[0]) / (b[0] - a[0]);
        intersections.push(a[1] + t * (b[1] - a[1]));
      }
    }
  }
  if (intersections.length < 2) return [];

  intersections.sort((a, b) => a - b);
  const minLat = intersections[0];
  const maxLat = intersections[intersections.length - 1];

  const steps = 8;
  const stepH = (maxLat - minLat) / steps;
  const points: number[][] = [];
  let s = Math.abs(seed * 12345) | 1;
  const rand = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };

  for (let i = 0; i <= steps; i++) {
    const lat = minLat + i * stepH;
    const offset = (i % 2 === 0 ? -1 : 1) * jitter * (0.4 + rand() * 0.6);
    if (i > 0) {
      points.push([cutLng + offset, minLat + (i - 1) * stepH]);
    }
    points.push([cutLng + offset, lat]);
  }
  return points;
}

function splitBoundaryIntoZones(base: MilitaryBase): GeoJSON.Feature[] {
  const boundary = base.boundary;
  const zones = base.layout.zones;
  const zoneData = base.zones;
  const n = zones.length;

  if (n <= 0 || boundary.length < 3) return [];

  const poly = boundary.map(([lat, lng]) => [lng, lat]);

  if (n === 1) {
    const coords = [...poly, poly[0]];
    return [{
      type: 'Feature',
      properties: { baseId: base.id, zoneId: zones[0].id, color: zones[0].color, zoneName: zoneData[0]?.name || zones[0].id },
      geometry: { type: 'Polygon', coordinates: [coords] },
    }];
  }

  const lngs = poly.map((c) => c[0]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const lngSpan = maxLng - minLng;

  const cutLngs: number[] = [];
  for (let i = 1; i < n; i++) {
    cutLngs.push(minLng + (lngSpan * i) / n);
  }

  const results: GeoJSON.Feature[] = [];

  for (let i = 0; i < n; i++) {
    const zone = zones[i];
    const zInfo = zoneData[i];
    const left = i === 0 ? minLng - 0.01 : cutLngs[i - 1];
    const right = i === n - 1 ? maxLng + 0.01 : cutLngs[i];

    const clipped = clipToStrip(poly, left, right);
    if (clipped.length < 3) continue;

    results.push({
      type: 'Feature',
      properties: { baseId: base.id, zoneId: zone.id, color: zone.color, zoneName: zInfo?.name || zone.id },
      geometry: { type: 'Polygon', coordinates: [[...clipped, clipped[0]]] },
    });
  }

  // Staircase border lines
  const jitter = lngSpan * 0.012;
  for (let i = 0; i < cutLngs.length; i++) {
    const lineCoords = makeStaircaseBorder(cutLngs[i], poly, jitter, i + base.location.lat * 1000);
    if (lineCoords.length >= 2) {
      results.push({
        type: 'Feature',
        properties: { baseId: base.id, zoneId: `${base.id}-border-${i}`, color: '#aaaaaa', zoneName: '' },
        geometry: { type: 'LineString', coordinates: lineCoords },
      });
    }
  }

  return results;
}

export function generateZonePolygons(bases: MilitaryBase[]): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];
  for (const base of bases) {
    features.push(...splitBoundaryIntoZones(base));
  }
  return { type: 'FeatureCollection', features };
}
