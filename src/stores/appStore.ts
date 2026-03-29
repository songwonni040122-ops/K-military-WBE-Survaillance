import { create } from 'zustand';
import type maplibregl from 'maplibre-gl';

type ViewMode = 'overview' | 'division-detail' | 'base-detail';

interface AppState {
  viewMode: ViewMode;
  selectedDivisionId: string | null;
  selectedBaseId: string | null;
  selectedZoneId: string | null;
  mapInstance: maplibregl.Map | null;
  setViewMode: (mode: ViewMode) => void;
  setMapInstance: (map: maplibregl.Map | null) => void;
  selectDivision: (divId: string) => void;
  selectBase: (baseId: string) => void;
  selectZone: (zoneId: string) => void;
  clearZone: () => void;
  goBack: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  viewMode: 'overview',
  selectedDivisionId: null,
  selectedBaseId: null,
  selectedZoneId: null,
  mapInstance: null,
  setViewMode: (mode) => set({ viewMode: mode }),
  setMapInstance: (map) => set({ mapInstance: map }),
  selectDivision: (divId) => set({
    viewMode: 'division-detail',
    selectedDivisionId: divId,
    selectedBaseId: null,
    selectedZoneId: null,
  }),
  selectBase: (baseId) => set({
    viewMode: 'base-detail',
    selectedBaseId: baseId,
    selectedZoneId: null,
  }),
  selectZone: (zoneId) => set({ selectedZoneId: zoneId }),
  clearZone: () => set({ selectedZoneId: null }),
  goBack: () => {
    const state = get();
    if (state.selectedZoneId) {
      set({ selectedZoneId: null });
    } else if (state.selectedBaseId) {
      set({ selectedBaseId: null, viewMode: state.selectedDivisionId ? 'division-detail' : 'overview' });
    } else if (state.selectedDivisionId) {
      set({ selectedDivisionId: null, viewMode: 'overview' });
    } else {
      set({ viewMode: 'overview', selectedDivisionId: null, selectedBaseId: null, selectedZoneId: null });
    }
  },
}));
