import { create } from 'zustand';

interface AppState {
  isEngaged: boolean;
  toggleEngage: () => void;
  setEngaged: (state: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isEngaged: false, // Default to BYPASS mode for recruiter friendliness
  toggleEngage: () => set((state) => ({ isEngaged: !state.isEngaged })),
  setEngaged: (state) => set({ isEngaged: state }),
}));
