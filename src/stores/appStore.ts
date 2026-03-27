import { create } from 'zustand';

type ViewMode = 'overview' | 'base-detail';

interface AppState {
  viewMode: ViewMode;
  selectedBaseId: string | null;
  selectedZoneId: string | null;
  setViewMode: (mode: ViewMode) => void;
  selectBase: (baseId: string) => void;
  selectZone: (zoneId: string) => void;
  goBack: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  viewMode: 'overview',
  selectedBaseId: null,
  selectedZoneId: null,
  setViewMode: (mode) => set({ viewMode: mode }),
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
