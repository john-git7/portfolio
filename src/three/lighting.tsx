"use client";

/**
 * Global static lighting.
 * Ambient and dynamic lighting are now owned by AmbientScene.tsx
 * so they can be coordinated with the morphing object and section state.
 *
 * This file provides only the scene-wide directional structure:
 *   - Warm key from top-right (main light source)
 *   - Cold fill from top-left (shadow detail)
 *   - Hemisphere for natural ground bounce
 */
export default function GlobalLighting() {
  return (
    <>
      {/* Hemisphere — warm sky, cool ground bounce */}
      <hemisphereLight args={["#1A1810", "#090910", 0.20]} />

      {/* Warm key light — upper right */}
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.2}
        color="#FFF6E8"
      />

      {/* Cold fill — upper left */}
      <directionalLight
        position={[-6, 8, -4]}
        intensity={0.28}
        color="#E4EEF8"
      />
    </>
  );
}
