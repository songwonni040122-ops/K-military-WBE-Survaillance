import type { MilitaryBase } from '../types';

interface ZoneFeature {
  type: 'Feature';
  properties: {
    baseId: string;
    zoneId: string;
    color: string;
    zoneName: string;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

/**
 * Split a base's boundary polygon into zone sub-polygons radiating from center.
 * Each zone gets an angular slice of the polygon.
 */
function splitBoundaryIntoZones(base: MilitaryBase): ZoneFeature[] {
  const boundary = base.boundary; // [lat, lng][]
  const zones = base.layout.zones;
  const zoneData = base.zones;
  const n = zones.length;
  if (n === 0 || boundary.length < 3) return [];

  // Centroid
  let cLat = 0, cLng = 0;
  for (const [lat, lng] of boundary) {
    cLat += lat;
    cLng += lng;
  }
  cLat /= boundary.length;
  cLng /= boundary.length;

  // Compute angle of each boundary vertex from centroid
  const verticesWithAngle = boundary.map(([lat, lng]) => ({
    lat,
    lng,
    angle: Math.atan2(lat - cLat, lng - cLng),
  }));

  // Sort by angle
  verticesWithAngle.sort((a, b) => a.angle - b.angle);

  // Divide the full 2π into n equal slices
  const sliceAngle = (2 * Math.PI) / n;

  // For each zone, find the boundary vertices that fall within its angular range,
  // then create a polygon: center -> vertices in range -> center
  const features: ZoneFeature[] = [];

  for (let i = 0; i < n; i++) {
    const zone = zones[i];
    const zInfo = zoneData[i];
    const angleStart = -Math.PI + i * sliceAngle;
    const angleEnd = angleStart + sliceAngle;

    // Get vertices in this angular slice
    const sliceVertices: Array<{ lat: number; lng: number }> = [];
    for (const v of verticesWithAngle) {
      if (v.angle >= angleStart && v.angle < angleEnd) {
        sliceVertices.push(v);
      }
    }

    // Also compute intersection points on the boundary at slice edges
    const edgeStart = computeBoundaryIntersection(cLat, cLng, angleStart, boundary);
    const edgeEnd = computeBoundaryIntersection(cLat, cLng, angleEnd, boundary);

    // Build polygon: center -> edgeStart -> boundary vertices -> edgeEnd -> center
    const coords: number[][] = [];
    coords.push([cLng, cLat]); // center
    if (edgeStart) coords.push([edgeStart.lng, edgeStart.lat]);
    for (const v of sliceVertices) {
      coords.push([v.lng, v.lat]);
    }
    if (edgeEnd) coords.push([edgeEnd.lng, edgeEnd.lat]);
    coords.push([cLng, cLat]); // close

    if (coords.length >= 4) { // need at least a triangle + closing
      features.push({
        type: 'Feature',
        properties: {
          baseId: base.id,
          zoneId: zone.id,
          color: zone.color,
          zoneName: zInfo?.name || zone.id,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [coords],
        },
      });
    }
  }

  return features;
}

/**
 * Find where a ray from (cLat, cLng) at given angle intersects the boundary polygon.
 */
function computeBoundaryIntersection(
  cLat: number, cLng: number, angle: number,
  boundary: [number, number][],
): { lat: number; lng: number } | null {
  // Ray direction
  const dLng = Math.cos(angle);
  const dLat = Math.sin(angle);

  let closest: { lat: number; lng: number; t: number } | null = null;

  for (let i = 0; i < boundary.length; i++) {
    const [lat1, lng1] = boundary[i];
    const [lat2, lng2] = boundary[(i + 1) % boundary.length];

    // Line segment: P = (lng1, lat1) + s * (lng2-lng1, lat2-lat1), s in [0,1]
    // Ray: Q = (cLng, cLat) + t * (dLng, dLat), t > 0
    const dx = lng2 - lng1;
    const dy = lat2 - lat1;

    const denom = dLng * dy - dLat * dx;
    if (Math.abs(denom) < 1e-12) continue;

    const t = ((lng1 - cLng) * dy - (lat1 - cLat) * dx) / denom;
    const s = ((lng1 - cLng) * dLat - (lat1 - cLat) * dLng) / denom;

    if (t > 0.001 && s >= 0 && s <= 1) {
      if (!closest || t < closest.t) {
        closest = {
          lng: cLng + t * dLng,
          lat: cLat + t * dLat,
          t,
        };
      }
    }
  }

  return closest;
}

export function generateZonePolygons(bases: MilitaryBase[]): GeoJSON.FeatureCollection {
  const features: ZoneFeature[] = [];
  for (const base of bases) {
    features.push(...splitBoundaryIntoZones(base));
  }
  return { type: 'FeatureCollection', features };
}
