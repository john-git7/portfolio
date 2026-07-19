"use client";

/**
 * Global lighting for the 3D world.
 *
 * System:
 *   - Soft ambient (near-black bg with slight warm bias)
 *   - Warm key light from top-right
 *   - Cold rim light from behind-left
 *   - Subtle hemisphere
 *
 * Lighting guides attention to the sculptural torus knot.
 * Additional point lights are placed directly in AmbientScene.tsx
 * near the sculpture for precise control.
 */
export default function GlobalLighting() {
  return (
    <>
      {/* Ambient — just enough to read dark metal forms */}
      <ambientLight intensity={0.18} color="#F0EDE8" />

      {/* Hemisphere — warm sky, cool ground */}
      <hemisphereLight
        args={["#1A1810", "#090910", 0.25]}
      />

      {/* Warm key light — upper right */}
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.4}
        color="#FFF6E8"
      />

      {/* Cold fill — upper left */}
      <directionalLight
        position={[-6, 8, -4]}
        intensity={0.35}
        color="#E4EEF8"
      />
    </>
  );
}
