"use client";

import { Canvas } from "@react-three/fiber";
import CameraSetup from "../three/cameraSetup";
import GlobalLighting from "../three/lighting";
import AmbientScene from "./AmbientScene";

/**
 * The permanent 3D background world.
 * Always renders — no isEngaged gate.
 * Fixed behind all DOM content.
 */
function MainScene() {
  return (
    <>
      <GlobalLighting />
      <CameraSetup />
      <AmbientScene />
    </>
  );
}

export default function Scene() {
  return (
    <Canvas
      shadows={false}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      style={{ background: "transparent" }}
    >
      <MainScene />
    </Canvas>
  );
}
