"use client";

import { useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Cinematic camera with mouse parallax.
 *
 * Two groups:
 *   animatorRef — for GSAP scroll-based movement (currently idle/minimal)
 *   driftRef    — for real-time mouse parallax with heavy inertia
 *
 * Philosophy:
 *   - Slow. Heavy. Confident.
 *   - Users should feel the camera has weight.
 *   - Max drift: ±0.4 units — subtle, never disorienting.
 */
export default function CameraSetup() {
  const driftRef = useRef<THREE.Group>(null);
  const { mouse, size } = useThree();

  // Responsive FOV
  const aspect = size.width / size.height;
  const baseFov = 42;
  const responsiveFov = aspect < 1 ? baseFov + (1 - aspect) * 22 : baseFov;

  // Slow idle breathing
  const idlePhase = useRef(Math.random() * Math.PI * 2);

  useFrame(({ clock }, delta) => {
    if (!driftRef.current) return;

    const t = clock.elapsedTime;

    // Mouse parallax — very slow lerp for cinematic weight
    const targetX = mouse.x * 0.38;
    const targetY = mouse.y * 0.22;

    driftRef.current.position.x = THREE.MathUtils.lerp(
      driftRef.current.position.x,
      targetX,
      delta * 1.2
    );
    driftRef.current.position.y = THREE.MathUtils.lerp(
      driftRef.current.position.y,
      targetY,
      delta * 1.2
    );

    // Tiny idle breathing rotation — barely perceptible
    const idleBreath = Math.sin(t * 0.18 + idlePhase.current) * 0.003;
    driftRef.current.rotation.z = THREE.MathUtils.lerp(
      driftRef.current.rotation.z,
      idleBreath,
      delta * 0.8
    );

    // Subtle rotation following mouse
    driftRef.current.rotation.y = THREE.MathUtils.lerp(
      driftRef.current.rotation.y,
      -mouse.x * 0.04,
      delta * 1.0
    );
    driftRef.current.rotation.x = THREE.MathUtils.lerp(
      driftRef.current.rotation.x,
      mouse.y * 0.03,
      delta * 1.0
    );
  });

  return (
    <group>
      <group ref={driftRef}>
        <PerspectiveCamera
          makeDefault
          fov={responsiveFov}
          near={0.1}
          far={600}
          position={[0, 0, 8]}
        />
      </group>
    </group>
  );
}
