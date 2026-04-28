"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { globalScrollState } from "@/store/scrollStore";

/**
 * Floating metallic particles that drift gently through the scene.
 * These are purely decorative ambient elements.
 */
function AmbientParticles({ count = 80 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 120 - 40,
        (Math.random() - 0.5) * 80 - 20,
      ] as [number, number, number],
      speed: 0.1 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
      scale: 0.02 + Math.random() * 0.06,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;

    particles.forEach((p, i) => {
      dummy.position.set(
        p.position[0] + Math.sin(t * p.speed + p.offset) * 2,
        p.position[1] + Math.cos(t * p.speed * 0.7 + p.offset) * 1.5,
        p.position[2] + Math.sin(t * p.speed * 0.5 + p.offset * 2) * 1
      );
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#d4a017"
        emissive="#d4a017"
        emissiveIntensity={0.3}
        metalness={1}
        roughness={0.3}
        transparent
        opacity={0.6}
      />
    </instancedMesh>
  );
}

/**
 * Floating geometric accents at various depths.
 * Creates visual interest without competing with DOM content.
 */
function FloatingGeometry() {
  const group1 = useRef<THREE.Mesh>(null);
  const group2 = useRef<THREE.Mesh>(null);
  const group3 = useRef<THREE.Mesh>(null);
  
  const wrapperRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    
    // Read the scroll directly from the global state 
    // to bypass Context constraints inside the R3F Canvas
    if (wrapperRef.current) {
      wrapperRef.current.position.y = globalScrollState.scroll * 0.02;
    }

    if (group1.current) {
      group1.current.rotation.x = t * 0.05;
      group1.current.rotation.y = t * 0.08;
    }
    if (group2.current) {
      group2.current.rotation.x = t * 0.03;
      group2.current.rotation.z = t * 0.06;
    }
    if (group3.current) {
      group3.current.rotation.y = t * 0.04;
      group3.current.rotation.z = t * 0.02;
    }
  });

  return (
    <group ref={wrapperRef}>
      {/* Deep background torus */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={group1} position={[15, -30, -40]} castShadow>
          <torusGeometry args={[3, 0.08, 16, 64]} />
          <meshStandardMaterial
            color="#d4a017"
            metalness={1}
            roughness={0.1}
            transparent
            opacity={0.4}
          />
        </mesh>
      </Float>

      {/* Mid-depth icosahedron */}
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.3}>
        <mesh ref={group2} position={[-20, -60, -30]} castShadow>
          <icosahedronGeometry args={[2, 0]} />
          <meshStandardMaterial
            color="#1a120b"
            metalness={0.9}
            roughness={0.2}
            wireframe
          />
        </mesh>
      </Float>

      {/* Lower octahedron */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.6}>
        <mesh ref={group3} position={[25, -90, -25]} castShadow>
          <octahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial
            color="#d4a017"
            metalness={1}
            roughness={0.05}
            transparent
            opacity={0.3}
          />
        </mesh>
      </Float>

      {/* Ring near contact section */}
      <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.4}>
        <mesh position={[-10, -120, -35]} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[4, 0.04, 16, 100]} />
          <meshStandardMaterial
            color="#f0c554"
            metalness={1}
            roughness={0}
            transparent
            opacity={0.25}
          />
        </mesh>
      </Float>
    </group>
  );
}

/**
 * The ambient background scene. Purely decorative, no content.
 * Creates depth and cinematic atmosphere behind DOM sections.
 */
export default function AmbientScene() {
  return (
    <group>
      <AmbientParticles count={80} />
      <FloatingGeometry />
      
      {/* Subtle ambient lights at different depths */}
      <pointLight position={[10, -20, -15]} intensity={30} color="#d4a017" distance={40} />
      <pointLight position={[-15, -60, -20]} intensity={20} color="#f0c554" distance={35} />
      <pointLight position={[20, -100, -10]} intensity={15} color="#add8e6" distance={30} />
    </group>
  );
}
