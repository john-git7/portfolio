import { create } from 'zustand';

interface CursorState {
  isHovering: boolean;
  isOnLink: boolean;
  setHovering: (v: boolean) => void;
  setOnLink: (v: boolean) => void;
}

export const useCursorStore = create<CursorState>((set) => ({
  isHovering: false,
  isOnLink: false,
  setHovering: (v) => set({ isHovering: v }),
  setOnLink: (v) => set({ isOnLink: v }),
}));
