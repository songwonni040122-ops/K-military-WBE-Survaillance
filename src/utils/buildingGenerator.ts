import type { MilitaryBase } from '../types';

interface BuildingFeature {
  type: 'Feature';
  properties: {
    baseId: string;
    zoneId: string;
    color: string;
    height: number;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

function seededRandom(seed: number): () => number {
  let s = Math.abs(seed) | 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const METERS_PER_DEG_LAT = 111320;

function mToLng(m: number, lat: number): number {
  return m / (METERS_PER_DEG_LAT * Math.cos((lat * Math.PI) / 180));
}
function mToLat(m: number): number {
  return m / METERS_PER_DEG_LAT;
}

function pointInPolygon(lng: number, lat: number, boundary: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = boundary.length - 1; i < boundary.length; j = i++) {
    const [yi, xi] = boundary[i];
    const [yj, xj] = boundary[j];
    if (((yi > lat) !== (yj > lat)) && (lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * Create a rotated rectangle polygon at (cx, cy) with given dimensions and angle
 */
function makeRotatedRect(
  cx: number, cy: number,
  wMeters: number, dMeters: number,
  angleDeg: number,
  cLat: number,
): number[][] {
  const hw = mToLng(wMeters / 2, cLat);
  const hd = mToLat(dMeters / 2);
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // Local corners (in degree-scaled coords)
  const corners = [
    [-hw, -hd],
    [hw, -hd],
    [hw, hd],
    [-hw, hd],
  ];

  const rotated = corners.map(([dx, dy]) => [
    cx + dx * cos - dy * sin,
    cy + dx * sin + dy * cos,
  ]);

  rotated.push(rotated[0]); // close
  return rotated;
}

function allCornersInPolygon(coords: number[][], boundary: [number, number][]): boolean {
  // Skip the closing point (last = first)
  for (let i = 0; i < coords.length - 1; i++) {
    if (!pointInPolygon(coords[i][0], coords[i][1], boundary)) return false;
  }
  return true;
}

export function generateBuildings(base: MilitaryBase): BuildingFeature[] {
  const totalBuildings = Math.floor(base.personnelCount / 100);
  const zones = base.layout.zones;
  const boundary = base.boundary;
  const features: BuildingFeature[] = [];

  const lats = boundary.map(([lat]) => lat);
  const lngs = boundary.map(([, lng]) => lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const cLat = (minLat + maxLat) / 2;

  const rand = seededRandom((base.location.lat * 1e5 + base.location.lng * 1e5) | 0);

  // Grid step — use a uniform cell size to generate candidate spots
  const cellM = 55; // meters between building centers
  const stepLng = mToLng(cellM, cLat);
  const stepLat = mToLat(cellM);

  // Margin inset
  const mrgLng = (maxLng - minLng) * 0.08;
  const mrgLat = (maxLat - minLat) * 0.08;

  // Generate candidate grid positions inside boundary
  const candidates: Array<{ lng: number; lat: number }> = [];
  for (let lat = maxLat - mrgLat; lat > minLat + mrgLat; lat -= stepLat) {
    for (let lng = minLng + mrgLng; lng < maxLng - mrgLng; lng += stepLng) {
      // Slight jitter to break perfect grid (±20% of step)
      const jLng = lng + (rand() - 0.5) * stepLng * 0.4;
      const jLat = lat + (rand() - 0.5) * stepLat * 0.4;
      if (pointInPolygon(jLng, jLat, boundary)) {
        candidates.push({ lng: jLng, lat: jLat });
      }
    }
  }

  // Distribute across zones
  const perZone: number[] = [];
  let rem = Math.min(totalBuildings, candidates.length);
  for (let i = 0; i < zones.length; i++) {
    if (i === zones.length - 1) {
      perZone.push(rem);
    } else {
      const n = Math.min(Math.floor(totalBuildings / zones.length), rem);
      perZone.push(n);
      rem -= n;
    }
  }

  // Sort candidates by longitude for zone strip assignment
  candidates.sort((a, b) => a.lng - b.lng);

  let ci = 0;
  for (let zIdx = 0; zIdx < zones.length; zIdx++) {
    const zone = zones[zIdx];
    const count = perZone[zIdx];

    // Each zone gets a base angle (some zones angled differently)
    const zoneBaseAngle = -15 + zIdx * 20 + (rand() - 0.5) * 30; // e.g. -15°, 5°, 25° with variation

    for (let p = 0; p < count && ci < candidates.length; p++) {
      const pos = candidates[ci++];

      // Building dimensions: always long rectangles, varied sizes
      const w = 35 + rand() * 35;   // 35-70m long side
      const d = 10 + rand() * 10;   // 10-20m short side

      // Angle: zone base angle ± random variation
      const angle = zoneBaseAngle + (rand() - 0.5) * 40;

      const height = 5 + rand() * 12; // 5-17m

      const coords = makeRotatedRect(pos.lng, pos.lat, w, d, angle, cLat);

      // Verify all corners inside boundary
      if (!allCornersInPolygon(coords, boundary)) continue;

      features.push({
        type: 'Feature',
        properties: {
          baseId: base.id,
          zoneId: zone.id,
          color: zone.color,
          height,
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

export function generateAllBuildings(bases: MilitaryBase[]): GeoJSON.FeatureCollection {
  const features: BuildingFeature[] = [];
  for (const base of bases) {
    features.push(...generateBuildings(base));
  }
  return { type: 'FeatureCollection', features };
}
