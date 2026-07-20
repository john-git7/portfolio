import { create } from "zustand";
import * as THREE from "three";

interface SceneState {
  cameraGroupRef: THREE.Group | null;
  setCameraGroupRef: (ref: THREE.Group | null) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  cameraGroupRef: null,
  setCameraGroupRef: (ref) => set({ cameraGroupRef: ref }),
}));
