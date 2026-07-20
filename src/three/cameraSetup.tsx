"use client";

import { useRef, useEffect } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { globalScrollState } from "@/store/scrollStore";
import { useSceneStore } from "@/store/sceneStore";

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
  const animatorRef = useRef<THREE.Group>(null);
  const { mouse, size } = useThree();
  const setCameraGroupRef = useSceneStore((state) => state.setCameraGroupRef);

  // Responsive FOV
  const aspect = size.width / size.height;
  const baseFov = 42;
  const responsiveFov = aspect < 1 ? baseFov + (1 - aspect) * 22 : baseFov;

  // Slow idle breathing
  const idlePhase = useRef(Math.random() * Math.PI * 2);

  useEffect(() => {
    if (animatorRef.current) {
      setCameraGroupRef(animatorRef.current);
    }
    return () => setCameraGroupRef(null);
  }, [setCameraGroupRef]);

  useFrame(({ clock }, delta) => {
    if (!driftRef.current) return;

    const t   = clock.elapsedTime;
    const vel = globalScrollState.smoothVelocity || 0; // fallback in case it's undefined

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

    // Scroll velocity → subtle Z push: camera "leans in" when scrolling fast
    const targetZ = -(Math.min(vel, 80) * 0.015);
    driftRef.current.position.z = THREE.MathUtils.lerp(
      driftRef.current.position.z,
      targetZ,
      delta * 2.5
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
    <group ref={animatorRef}>
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
