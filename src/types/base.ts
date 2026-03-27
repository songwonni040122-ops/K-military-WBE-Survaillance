export type AlertLevel = 'normal' | 'caution' | 'warning' | 'critical';
export type BaseType = 'infantry' | 'armored' | 'artillery' | 'logistics' | 'airforce' | 'headquarters';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface MilitaryBase {
  id: string;
  name: string;
  type: BaseType;
  location: GeoLocation;
  region: string;
  personnelCount: number;
  zoneCount: number;
  zones: Zone[];
  characteristics: string[];
  layout: BaseLayout;
  /** OSM-traced boundary polygon (lat/lng pairs) for map overlay */
  boundary: [number, number][];
}

export interface Zone {
  id: string;
  baseId: string;
  name: string;
  confluencePoint: string;
  currentAlertLevel: AlertLevel;
}

export interface BaseLayout {
  grounds: { width: number; depth: number };
  buildings: BuildingBlock[];
  zones: ZoneDefinition[];
  confluencePoints: ConfluencePointDef[];
}

export interface BuildingBlock {
  position: [number, number, number];
  size: [number, number, number];
  label: string;
  zoneId: string;
}

export interface ZoneDefinition {
  id: string;
  color: string;
  area: { x: number; z: number; width: number; depth: number };
  /** Lat/lng polygon for satellite overlay */
  polygon: [number, number][];
}

export interface ConfluencePointDef {
  position: [number, number, number];
  zoneId: string;
  /** Lat/lng position for satellite overlay */
  geoPosition: { lat: number; lng: number };
}
