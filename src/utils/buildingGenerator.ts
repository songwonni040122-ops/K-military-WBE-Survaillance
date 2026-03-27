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

/**
 * Check if a point [lng, lat] is inside a polygon (array of [lat, lng] pairs).
 * Uses ray-casting algorithm.
 */
function pointInPolygon(lng: number, lat: number, boundary: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = boundary.length - 1; i < boundary.length; j = i++) {
    const [yi, xi] = boundary[i]; // [lat, lng]
    const [yj, xj] = boundary[j];
    if (((yi > lat) !== (yj > lat)) && (lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * Generate building footprint GeoJSON features for a base.
 * - 1 building per 100 personnel
 * - Buildings colored by zone
 * - Placed in a grid pattern within the boundary polygon
 */
export function generateBuildings(base: MilitaryBase): BuildingFeature[] {
  const buildingCount = Math.floor(base.personnelCount / 100);
  const zones = base.layout.zones;
  const boundary = base.boundary;

  // Bounding box of boundary
  const lats = boundary.map(([lat]) => lat);
  const lngs = boundary.map(([, lng]) => lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latSpan = maxLat - minLat;
  const lngSpan = maxLng - minLng;

  // Building size in degrees (approx 15m x 10m)
  const bldgW = lngSpan * 0.025;  // width in lng
  const bldgH = latSpan * 0.025;  // depth in lat
  const gap = 1.6; // gap multiplier between buildings

  // Generate grid of candidate positions inside boundary
  const candidates: Array<{ lng: number; lat: number }> = [];
  const stepLng = bldgW * gap;
  const stepLat = bldgH * gap;
  const marginLng = lngSpan * 0.08;
  const marginLat = latSpan * 0.08;

  for (let lng = minLng + marginLng; lng < maxLng - marginLng; lng += stepLng) {
    for (let lat = minLat + marginLat; lat < maxLat - marginLat; lat += stepLat) {
      if (pointInPolygon(lng, lat, boundary)) {
        candidates.push({ lng, lat });
      }
    }
  }

  // If not enough candidates, reduce margins and try again
  if (candidates.length < buildingCount) {
    candidates.length = 0;
    const smallStep = Math.min(stepLng, stepLat) * 0.7;
    for (let lng = minLng + bldgW; lng < maxLng - bldgW; lng += smallStep) {
      for (let lat = minLat + bldgH; lat < maxLat - bldgH; lat += smallStep) {
        if (pointInPolygon(lng, lat, boundary)) {
          candidates.push({ lng, lat });
        }
      }
    }
  }

  // Distribute buildings across zones proportionally
  const totalZones = zones.length;
  const buildingsPerZone = zones.map((_, i) => {
    if (i === totalZones - 1) {
      return buildingCount - Math.floor(buildingCount / totalZones) * (totalZones - 1);
    }
    return Math.floor(buildingCount / totalZones);
  });

  // Sort candidates by longitude to create zone strips (left to right)
  candidates.sort((a, b) => a.lng - b.lng);

  // Assign zones by splitting candidates into strips
  const features: BuildingFeature[] = [];
  let candidateIdx = 0;
  const totalNeeded = Math.min(buildingCount, candidates.length);

  // Proportional split of candidates
  let placed = 0;
  for (let zIdx = 0; zIdx < zones.length; zIdx++) {
    const zone = zones[zIdx];
    const count = Math.min(
      buildingsPerZone[zIdx],
      candidates.length - candidateIdx,
      totalNeeded - placed,
    );

    for (let i = 0; i < count && candidateIdx < candidates.length; i++) {
      const pos = candidates[candidateIdx++];
      const halfW = bldgW / 2;
      const halfH = bldgH / 2;

      // Vary building height slightly for visual interest
      const seed = (pos.lng * 10000 + pos.lat * 10000) % 1;
      const height = 8 + seed * 12; // 8-20 meters

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
          coordinates: [[
            [pos.lng - halfW, pos.lat - halfH],
            [pos.lng + halfW, pos.lat - halfH],
            [pos.lng + halfW, pos.lat + halfH],
            [pos.lng - halfW, pos.lat + halfH],
            [pos.lng - halfW, pos.lat - halfH],
          ]],
        },
      });
      placed++;
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
