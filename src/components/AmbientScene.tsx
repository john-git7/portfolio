"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { globalScrollState } from "@/store/scrollStore";

// =============================================================
// DUST PARTICLES
// Near-invisible fine particles that create atmospheric depth.
// Near-white, very small, extremely low opacity — felt, not seen.
// =============================================================
function DustParticles({ count = 120 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 100 - 20,
        (Math.random() - 0.5) * 40 - 10,
      ] as [number, number, number],
      speed: 0.04 + Math.random() * 0.08,
      offset: Math.random() * Math.PI * 2,
      scale: 0.006 + Math.random() * 0.012,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;

    particles.forEach((p, i) => {
      dummy.position.set(
        p.position[0] + Math.sin(t * p.speed + p.offset) * 1.2,
        p.position[1] + Math.cos(t * p.speed * 0.6 + p.offset) * 0.8,
        p.position[2] + Math.sin(t * p.speed * 0.4 + p.offset * 2) * 0.6
      );
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial
        color="#D4C9B0"
        transparent
        opacity={0.18}
      />
    </instancedMesh>
  );
}

// =============================================================
// SCULPTURAL TORUS KNOT
// The primary 3D object. Dark metal, architectural, neutral.
// Positioned right-center, partially off-screen for editorial feel.
// Gold accent point light orbits it slowly.
// =============================================================
function SculpturalObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const goldLightRef = useRef<THREE.PointLight>(null);
  const groupRef = useRef<THREE.Group>(null);

  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  useFrame(({ clock, mouse }) => {
    const t = clock.elapsedTime;

    // Slow idle rotation — deliberate, heavy, confident
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.0007;
      meshRef.current.rotation.y += 0.0012;
      meshRef.current.rotation.z += 0.0004;
    }

    // Gold light orbits the sculpture
    if (goldLightRef.current) {
      goldLightRef.current.position.x = Math.sin(t * 0.3) * 4;
      goldLightRef.current.position.y = Math.cos(t * 0.2) * 3;
      goldLightRef.current.position.z = Math.cos(t * 0.3) * 4 + 2;
    }

    // Mouse parallax — subtle, cinematic inertia
    targetRotation.current.x = -mouse.y * 0.12;
    targetRotation.current.y = mouse.x * 0.12;

    currentRotation.current.x = THREE.MathUtils.lerp(
      currentRotation.current.x,
      targetRotation.current.x,
      0.04
    );
    currentRotation.current.y = THREE.MathUtils.lerp(
      currentRotation.current.y,
      targetRotation.current.y,
      0.04
    );

    // Scroll parallax — sculpture drifts as user scrolls
    if (groupRef.current) {
      groupRef.current.rotation.x = currentRotation.current.x;
      groupRef.current.rotation.y = currentRotation.current.y;
      groupRef.current.position.y =
        -globalScrollState.scroll * 0.003 + Math.sin(t * 0.25) * 0.08;
    }
  });

  return (
    // Right-offset, partially off viewport for editorial asymmetry
    <group ref={groupRef} position={[3.8, 0.2, -2]}>
      {/* Gold accent orbiting light */}
      <pointLight
        ref={goldLightRef}
        color="#C8A96E"
        intensity={28}
        distance={14}
      />

      {/* Cold rim light from behind-left */}
      <pointLight
        position={[-6, 2, -6]}
        color="#D0E4F0"
        intensity={10}
        distance={20}
      />

      <mesh ref={meshRef} castShadow={false}>
        <torusKnotGeometry args={[1.15, 0.32, 220, 28, 2, 3]} />
        <meshStandardMaterial
          color="#1A1A1A"
          metalness={0.96}
          roughness={0.11}
          envMapIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

// =============================================================
// AMBIENT SCENE EXPORT
// =============================================================
export default function AmbientScene() {
  return (
    <group>
      <DustParticles count={110} />
      <SculpturalObject />
    </group>
  );
}
