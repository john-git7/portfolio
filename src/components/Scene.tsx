"use client";

import { Canvas } from "@react-three/fiber";
import CameraSetup from "../three/cameraSetup";
import Lighting from "../three/lighting";
import AmbientScene from "./AmbientScene";
import { useAppStore } from "@/store/appStore";

/**
 * The core 3D world — ambient background elements.
 * All content rendering is done in DOM sections, not in 3D.
 */
function MainScene() {
  return (
    <>
      <Lighting />
      <CameraSetup />

      {/* Ambient decorative elements throughout the scroll depth */}
      <AmbientScene />
    </>
  );
}

/**
 * The Background Canvas Layer — fixed behind all DOM content.
 */
export default function Scene() {
  const { isEngaged } = useAppStore();

  if (!isEngaged) return null;

  return (
    <Canvas 
      shadows 
      dpr={[1, 1.5]}
      gl={{ 
        antialias: true, 
        alpha: true, 
        powerPreference: "high-performance",
        stencil: false,
        depth: true
      }}
    >
      <MainScene />
    </Canvas>
  );
}
