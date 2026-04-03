"use client";

import { useRef, useState } from "react";
import * as THREE from "three";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useDeterministicRhythm } from "../animations/rhythm";
import { useMouseInteraction } from "../animations/interactions";
import { ResponsiveConfig } from "../hooks/useResponsiveScene";

// --- Sub-components consume the shared rhythm context ---

/**
 * Procedural Vinyl with determined BPM timing
 */
function Vinyl({ rhythm, hovered, motionIntensity }: { rhythm: any, hovered: boolean, motionIntensity: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    // Deterministic Rotation Speed (Stable but modulated)
    const { fullCycle } = rhythm;
    const baseSpeed = 0.8; 
    const modFactor = hovered ? 1.1 : 1.0;
    const modulation = 0.05 * Math.sin(fullCycle * 0.5);
    
    // Explicitly set rotation relative to the clock
    meshRef.current.rotation.y = (fullCycle * baseSpeed * modFactor + (modulation * modFactor)) * (0.8 + motionIntensity * 0.2);
    
    // Subtle axis wobble - Reduced on mobile
    meshRef.current.rotation.x = 0.002 * Math.sin(fullCycle * 2.0) * motionIntensity;
    meshRef.current.rotation.z = 0.002 * Math.cos(fullCycle * 1.5) * motionIntensity;
  });

  return (
    <group position={[0, 0.22, 0]}>
      <mesh ref={meshRef} castShadow>
        <cylinderGeometry args={[1.6, 1.6, 0.04, 64]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          roughness={0.4} 
          metalness={0.1}
          onBeforeCompile={(shader) => {
            shader.vertexShader = shader.vertexShader.replace(
              '#include <common>',
              '#include <common>\nvarying vec2 vGrooveUv;'
            );
            shader.vertexShader = shader.vertexShader.replace(
              '#include <uv_vertex>',
              '#include <uv_vertex>\nvGrooveUv = uv;'
            );
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <common>',
              '#include <common>\nvarying vec2 vGrooveUv;'
            );
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <roughnessmap_fragment>',
              `
              #include <roughnessmap_fragment>
              float dist = distance(vGrooveUv, vec2(0.5));
              float grooves = sin(dist * 600.0) * 0.4 + 0.6;
              roughnessFactor = mix(roughnessFactor, roughnessFactor * 0.4, grooves);
              `
            );
          }}
        />
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.01, 32]} />
          <meshStandardMaterial color="#8c2e2e" />
        </mesh>
      </mesh>
    </group>
  );
}

/**
 * Rhythm-aware Tonearm
 */
function Tonearm({ rhythm, motionIntensity }: { rhythm: any, motionIntensity: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (!groupRef.current) return;
    const { smoothPulse, drift } = rhythm;
    
    const vibrato = Math.sin(rhythm.fullCycle * 20) * 0.001 * smoothPulse * motionIntensity;
    groupRef.current.rotation.z = -0.05 + vibrato;
    groupRef.current.rotation.y = drift * 0.02 * motionIntensity;
  });

  return (
    <group ref={groupRef} position={[-1.8, 0.4, 0]} rotation={[0, 0.5, -0.05]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        <meshStandardMaterial color="#111" metalness={0.9} />
      </mesh>
      <mesh position={[1.2, 0.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 2.4, 16]} />
        <meshStandardMaterial color="silver" metalness={1} />
      </mesh>
    </group>
  );
}

/**
 * Lighting system synchronized to rhythm and hover state
 */
function SceneLighting({ rhythm, hovered, lightIntensity }: { rhythm: any, hovered: boolean, lightIntensity: number }) {
  const spotlightRef = useRef<THREE.SpotLight>(null);
  const hoverFactor = useRef(0);

  useFrame((state, delta) => {
    // Smoothly lerp hover factor
    hoverFactor.current = THREE.MathUtils.lerp(hoverFactor.current, hovered ? 1 : 0, delta * 3);
    const h = hoverFactor.current;
    
    const { sharpPulse, drift } = rhythm;
    
    if (spotlightRef.current) {
      const baseIntensity = 3000 * lightIntensity;
      const hoverMultiplier = 1 + (h * 0.2);
      spotlightRef.current.intensity = (baseIntensity + (sharpPulse * 500 * lightIntensity) + (drift * 200 * lightIntensity)) * hoverMultiplier;
    }
  });

  return (
    <>
      <Environment files="/studio_small_03_1k.hdr" environmentIntensity={hovered ? 0.5 * lightIntensity : 0.3 * lightIntensity} />
      
      <spotLight 
        ref={spotlightRef}
        position={[5, 12, 5]} 
        angle={0.25} 
        penumbra={1} 
        intensity={3000} 
        color="#fff1d6" 
        castShadow 
      />

      <pointLight 
        position={[-8, 4, 6]} 
        intensity={(50 + (1 - rhythm.smoothPulse) * 30) * lightIntensity} 
        color="#00ffff" 
        distance={25} 
      />
    </>
  );
}

export default function HeroScene({ responsive }: { responsive: ResponsiveConfig }) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  
  const targetBPM = hovered ? 84 : 72;
  const rhythm = useDeterministicRhythm(targetBPM);
  
  const { phonographScale, phonographPosition, motionIntensity, lightIntensity } = responsive;
  
  useMouseInteraction(groupRef, 0.6 * motionIntensity);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const { smoothPulse, drift } = rhythm;
    groupRef.current.position.y = phonographPosition[1] + (smoothPulse * 0.02 * motionIntensity);
    groupRef.current.rotation.y += drift * 0.0005 * motionIntensity;
  });

  return (
    <group 
      ref={groupRef} 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
      position={phonographPosition}
      scale={phonographScale}
    >
      <SceneLighting rhythm={rhythm} hovered={hovered} lightIntensity={lightIntensity} />
      
      <Vinyl rhythm={rhythm} hovered={hovered} motionIntensity={motionIntensity} />
      <Tonearm rhythm={rhythm} motionIntensity={motionIntensity} />

      {/* Phonograph Horn ART */}
      <group position={[1.5, 0.2, -1.5]} rotation={[0.4, -0.8, -0.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[2, 0.1, 3.5, 32, 1, true]} />
          <meshStandardMaterial color="#d4a017" metalness={0.95} roughness={0.15} side={THREE.DoubleSide} />
        </mesh>
        <pointLight intensity={(rhythm.sharpPulse * 500 + 100) * lightIntensity} color="#ffaa00" distance={5} />
      </group>

      {/* Phonograph Base */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[4, 0.4, 4]} />
        <meshStandardMaterial color="#1a120b" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Ground system for stability */}
      <ContactShadows 
        position={[0, -0.21, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2.5} 
        far={2} 
      />
    </group>
  );
}
