import { create } from 'zustand';
import type maplibregl from 'maplibre-gl';

type ViewMode = 'overview' | 'base-detail';

interface AppState {
  viewMode: ViewMode;
  selectedBaseId: string | null;
  selectedZoneId: string | null;
  mapInstance: maplibregl.Map | null;
  setViewMode: (mode: ViewMode) => void;
  setMapInstance: (map: maplibregl.Map | null) => void;
  selectBase: (baseId: string) => void;
  selectZone: (zoneId: string) => void;
  goBack: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  viewMode: 'overview',
  selectedBaseId: null,
  selectedZoneId: null,
  mapInstance: null,
  setViewMode: (mode) => set({ viewMode: mode }),
  setMapInstance: (map) => set({ mapInstance: map }),
  selectBase: (baseId) => set({
    viewMode: 'base-detail',
    selectedBaseId: baseId,
    selectedZoneId: null,
  }),
  selectZone: (zoneId) => set({ selectedZoneId: zoneId }),
  goBack: () => set({
    viewMode: 'overview',
    selectedBaseId: null,
    selectedZoneId: null,
  }),
}));
