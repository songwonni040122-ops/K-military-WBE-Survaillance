import type { MilitaryBase } from '../types';

interface BuildingFeature {
  type: 'Feature';
  properties: {
    baseId: string;
    zoneId: string;
    color: string;
    height: number;
    buildingType: string;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

// Seeded pseudo-random for deterministic layout
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Building type templates (width x depth in meters, height range)
 * Mimics real military base building variety
 */
const BUILDING_TYPES = {
  barracks:    { w: 40, d: 12, hMin: 8,  hMax: 12, label: '생활관' },
  barracks_s:  { w: 30, d: 10, hMin: 7,  hMax: 10, label: '생활관' },
  hq:          { w: 25, d: 20, hMin: 10, hMax: 15, label: '본부' },
  mess:        { w: 30, d: 15, hMin: 5,  hMax: 8,  label: '식당' },
  warehouse:   { w: 50, d: 20, hMin: 6,  hMax: 10, label: '창고' },
  garage:      { w: 45, d: 18, hMin: 5,  hMax: 8,  label: '차량고' },
  medical:     { w: 20, d: 15, hMin: 6,  hMax: 9,  label: '의무실' },
  gym:         { w: 35, d: 25, hMin: 8,  hMax: 12, label: '체육관' },
  guard:       { w: 8,  d: 8,  hMin: 4,  hMax: 6,  label: '초소' },
  utility:     { w: 15, d: 10, hMin: 4,  hMax: 6,  label: '지원시설' },
  small:       { w: 12, d: 8,  hMin: 3,  hMax: 5,  label: '부속건물' },
};

type BldgType = keyof typeof BUILDING_TYPES;

/**
 * Zone layout template: what types of buildings a zone gets
 */
function getZoneBuildingMix(zoneIndex: number, buildingCount: number): BldgType[] {
  const types: BldgType[] = [];

  if (zoneIndex === 0) {
    // Zone A: mostly barracks
    const barracksCount = Math.max(2, Math.floor(buildingCount * 0.5));
    for (let i = 0; i < barracksCount; i++) types.push(i % 2 === 0 ? 'barracks' : 'barracks_s');
    types.push('mess');
    types.push('medical');
    while (types.length < buildingCount) types.push('small');
  } else if (zoneIndex === 1) {
    // Zone B: vehicle/maintenance or support
    types.push('hq');
    types.push('warehouse');
    types.push('garage');
    types.push('utility');
    while (types.length < buildingCount) types.push(types.length % 2 === 0 ? 'small' : 'utility');
  } else {
    // Zone C: headquarters/support
    types.push('hq');
    types.push('gym');
    types.push('mess');
    types.push('guard');
    types.push('guard');
    while (types.length < buildingCount) types.push('small');
  }

  return types.slice(0, buildingCount);
}

const METERS_PER_DEG_LAT = 111320;

/**
 * Convert meters to degrees at a given latitude
 */
function metersToLng(meters: number, lat: number): number {
  return meters / (METERS_PER_DEG_LAT * Math.cos((lat * Math.PI) / 180));
}
function metersToLat(meters: number): number {
  return meters / METERS_PER_DEG_LAT;
}

/**
 * Check if a rectangle fits inside the boundary polygon
 */
function rectInPolygon(
  cx: number, cy: number, hw: number, hh: number,
  boundary: [number, number][],
): boolean {
  const corners = [
    [cx - hw, cy - hh],
    [cx + hw, cy - hh],
    [cx + hw, cy + hh],
    [cx - hw, cy + hh],
  ];
  return corners.every(([lng, lat]) => pointInPolygon(lng, lat, boundary));
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
 * Create a rectangular building polygon feature
 */
function createBuildingRect(
  cx: number, cy: number,
  wMeters: number, dMeters: number,
  lat: number,
  props: { baseId: string; zoneId: string; color: string; height: number; buildingType: string },
): BuildingFeature {
  const hw = metersToLng(wMeters / 2, lat);
  const hd = metersToLat(dMeters / 2);
  return {
    type: 'Feature',
    properties: props,
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [cx - hw, cy - hd],
        [cx + hw, cy - hd],
        [cx + hw, cy + hd],
        [cx - hw, cy + hd],
        [cx - hw, cy - hd],
      ]],
    },
  };
}

/**
 * Generate buildings for one base with grid-based military compound layout
 */
export function generateBuildings(base: MilitaryBase): BuildingFeature[] {
  const totalBuildings = Math.floor(base.personnelCount / 100);
  const zones = base.layout.zones;
  const boundary = base.boundary;
  const features: BuildingFeature[] = [];

  // Bounding box of boundary
  const lats = boundary.map(([lat]) => lat);
  const lngs = boundary.map(([, lng]) => lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const centerLat = (minLat + maxLat) / 2;

  // Polygon span in meters (approx)
  const spanLatM = (maxLat - minLat) * METERS_PER_DEG_LAT;
  const spanLngM = (maxLng - minLng) * METERS_PER_DEG_LAT * Math.cos((centerLat * Math.PI) / 180);

  // Distribute buildings per zone
  const buildingsPerZone: number[] = [];
  let remaining = totalBuildings;
  for (let i = 0; i < zones.length; i++) {
    if (i === zones.length - 1) {
      buildingsPerZone.push(remaining);
    } else {
      const count = Math.floor(totalBuildings / zones.length);
      buildingsPerZone.push(count);
      remaining -= count;
    }
  }

  const rand = seededRandom(Math.abs(base.location.lat * 100000 + base.location.lng * 100000) | 0);

  // Divide polygon into zone strips (left to right for <=3 zones, or top to bottom)
  const useHorizontal = spanLngM > spanLatM;

  for (let zIdx = 0; zIdx < zones.length; zIdx++) {
    const zone = zones[zIdx];
    const count = buildingsPerZone[zIdx];
    const mix = getZoneBuildingMix(zIdx, count);

    // Zone strip boundaries (fraction of polygon extent)
    const zFracStart = zIdx / zones.length;
    const zFracEnd = (zIdx + 1) / zones.length;

    let zoneMinLng: number, zoneMaxLng: number, zoneMinLat: number, zoneMaxLat: number;
    if (useHorizontal) {
      zoneMinLng = minLng + (maxLng - minLng) * zFracStart;
      zoneMaxLng = minLng + (maxLng - minLng) * zFracEnd;
      zoneMinLat = minLat;
      zoneMaxLat = maxLat;
    } else {
      zoneMinLng = minLng;
      zoneMaxLng = maxLng;
      zoneMinLat = minLat + (maxLat - minLat) * zFracStart;
      zoneMaxLat = minLat + (maxLat - minLat) * zFracEnd;
    }

    // Inset margins (10% of zone strip)
    const marginLng = (zoneMaxLng - zoneMinLng) * 0.1;
    const marginLat = (zoneMaxLat - zoneMinLat) * 0.1;
    const areaMinLng = zoneMinLng + marginLng;
    const areaMaxLng = zoneMaxLng - marginLng;
    const areaMinLat = zoneMinLat + marginLat;
    const areaMaxLat = zoneMaxLat - marginLat;

    // Road spacing in degrees
    const roadGapLng = metersToLng(8, centerLat);
    const roadGapLat = metersToLat(8);

    // Place buildings in rows within the zone strip
    let placed = 0;
    let cursorLat = areaMaxLat; // start from top

    while (placed < mix.length && cursorLat > areaMinLat) {
      // Determine row height based on next building
      const bType = BUILDING_TYPES[mix[placed]];
      const rowDepthM = bType.d;
      const rowDepthDeg = metersToLat(rowDepthM);

      let cursorLng = areaMinLng;

      while (placed < mix.length && cursorLng < areaMaxLng) {
        const bt = BUILDING_TYPES[mix[placed]];
        const wDeg = metersToLng(bt.w, centerLat);
        const dDeg = metersToLat(bt.d);

        const cx = cursorLng + wDeg / 2;
        const cy = cursorLat - rowDepthDeg / 2;

        // Check if building fits within boundary
        if (cx + wDeg / 2 < areaMaxLng &&
            rectInPolygon(cx, cy, wDeg / 2, dDeg / 2, boundary)) {
          const height = bt.hMin + rand() * (bt.hMax - bt.hMin);

          features.push(createBuildingRect(cx, cy, bt.w, bt.d, centerLat, {
            baseId: base.id,
            zoneId: zone.id,
            color: zone.color,
            height,
            buildingType: bt.label,
          }));
          placed++;
        }

        cursorLng += wDeg + roadGapLng;
      }

      cursorLat -= rowDepthDeg + roadGapLat;
    }

    // If still buildings left, try filling remaining space with smaller gaps
    if (placed < mix.length) {
      const smallGapLng = metersToLng(5, centerLat);
      const smallGapLat = metersToLat(5);
      let cy2 = cursorLat;

      while (placed < mix.length && cy2 > areaMinLat) {
        let cx2 = areaMinLng;
        const bt = BUILDING_TYPES[mix[placed]];
        const dDeg = metersToLat(bt.d);

        while (placed < mix.length && cx2 < areaMaxLng) {
          const bt2 = BUILDING_TYPES[mix[placed]];
          const wDeg = metersToLng(bt2.w, centerLat);
          const dDeg2 = metersToLat(bt2.d);
          const px = cx2 + wDeg / 2;
          const py = cy2 - dDeg2 / 2;

          if (px + wDeg / 2 < areaMaxLng &&
              rectInPolygon(px, py, wDeg / 2, dDeg2 / 2, boundary)) {
            const height = bt2.hMin + rand() * (bt2.hMax - bt2.hMin);
            features.push(createBuildingRect(px, py, bt2.w, bt2.d, centerLat, {
              baseId: base.id,
              zoneId: zone.id,
              color: zone.color,
              height,
              buildingType: bt2.label,
            }));
            placed++;
          }
          cx2 += wDeg + smallGapLng;
        }
        cy2 -= dDeg + smallGapLat;
      }
    }
  }

  return features;
}

/**
 * Generate GeoJSON FeatureCollection of all buildings for all bases.
 */
export function generateAllBuildings(bases: MilitaryBase[]): GeoJSON.FeatureCollection {
  const features: BuildingFeature[] = [];
  for (const base of bases) {
    features.push(...generateBuildings(base));
  }
  return {
    type: 'FeatureCollection',
    features,
  };
}
