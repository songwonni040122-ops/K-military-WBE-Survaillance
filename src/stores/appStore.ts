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

const PANEL_DELAY = 600; // ms delay for panel transition after map starts moving

export const useAppStore = create<AppState>((set, get) => ({
  viewMode: 'overview',
  selectedDivisionId: null,
  selectedBaseId: null,
  selectedZoneId: null,
  mapInstance: null,
  setViewMode: (mode) => set({ viewMode: mode }),
  setMapInstance: (map) => set({ mapInstance: map }),
  selectDivision: (divId) => {
    // Update selection immediately (triggers map flyTo)
    set({ selectedDivisionId: divId, selectedBaseId: null, selectedZoneId: null });
    // Delay panel transition so map zoom happens first
    setTimeout(() => set({ viewMode: 'division-detail' }), PANEL_DELAY);
  },
  selectBase: (baseId) => {
    set({ selectedBaseId: baseId, selectedZoneId: null });
    setTimeout(() => set({ viewMode: 'base-detail' }), PANEL_DELAY);
  },
  selectZone: (zoneId) => set({ selectedZoneId: zoneId }),
  clearZone: () => set({ selectedZoneId: null }),
  goBack: () => {
    const state = get();
    if (state.selectedZoneId) {
      set({ selectedZoneId: null });
    } else if (state.selectedBaseId) {
      // Clear base first → triggers map zoom out
      set({ selectedBaseId: null });
      setTimeout(() => {
        set({ viewMode: get().selectedDivisionId ? 'division-detail' : 'overview' });
      }, PANEL_DELAY);
    } else if (state.selectedDivisionId) {
      set({ selectedDivisionId: null });
      setTimeout(() => set({ viewMode: 'overview' }), PANEL_DELAY);
    } else {
      set({ viewMode: 'overview', selectedDivisionId: null, selectedBaseId: null, selectedZoneId: null });
    }
  },
}));
