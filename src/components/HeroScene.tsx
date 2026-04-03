import { useRef, useState } from "react";
import * as THREE from "three";
import { Float, Html, Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useDeterministicRhythm } from "../animations/rhythm";
import { useMouseInteraction } from "../animations/interactions";

// --- Sub-components consume the shared rhythm context ---

/**
 * Procedural Vinyl with determined BPM timing
 */
function Vinyl({ rhythm, hovered }: { rhythm: any, hovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    // Deterministic Rotation Speed (Stable but modulated)
    const { fullCycle } = rhythm;
    const baseSpeed = 0.8; 
    const modFactor = hovered ? 1.1 : 1.0;
    const modulation = 0.05 * Math.sin(fullCycle * 0.5);
    
    // Explicitly set rotation relative to the clock
    meshRef.current.rotation.y = fullCycle * baseSpeed * modFactor + (modulation * modFactor);
    
    // Subtle axis wobble
    meshRef.current.rotation.x = 0.002 * Math.sin(fullCycle * 2.0);
    meshRef.current.rotation.z = 0.002 * Math.cos(fullCycle * 1.5);
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
function Tonearm({ rhythm }: { rhythm: any }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (!groupRef.current) return;
    const { smoothPulse, drift } = rhythm;
    
    const vibrato = Math.sin(rhythm.fullCycle * 20) * 0.001 * smoothPulse;
    groupRef.current.rotation.z = -0.05 + vibrato;
    groupRef.current.rotation.y = drift * 0.02;
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
function SceneLighting({ rhythm, hovered }: { rhythm: any, hovered: boolean }) {
  const spotlightRef = useRef<THREE.SpotLight>(null);
  const hoverFactor = useRef(0);

  useFrame((state, delta) => {
    // Smoothly lerp hover factor
    hoverFactor.current = THREE.MathUtils.lerp(hoverFactor.current, hovered ? 1 : 0, delta * 3);
    const h = hoverFactor.current;
    
    const { sharpPulse, drift, smoothPulse } = rhythm;
    
    if (spotlightRef.current) {
      const baseIntensity = 3000;
      const hoverMultiplier = 1 + (h * 0.2);
      spotlightRef.current.intensity = (baseIntensity + (sharpPulse * 500) + (drift * 200)) * hoverMultiplier;
    }
  });

  return (
    <>
      <Environment files="/studio_small_03_1k.hdr" environmentIntensity={hovered ? 0.5 : 0.3} />
      
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
        intensity={50 + (1 - rhythm.smoothPulse) * 30} 
        color="#00ffff" 
        distance={25} 
      />
    </>
  );
}

export default function HeroScene({ isMobile }: { isMobile: boolean }) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  
  const targetBPM = hovered ? 84 : 72;
  const rhythm = useDeterministicRhythm(targetBPM);
  
  useMouseInteraction(groupRef, isMobile ? 0.3 : 0.6);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const { smoothPulse, drift } = rhythm;
    groupRef.current.position.y = smoothPulse * 0.02;
    groupRef.current.rotation.y += drift * 0.0005;
  });

  return (
    <group 
      ref={groupRef} 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
      position={[0.5, -0.5, 0]}
    >
      <SceneLighting rhythm={rhythm} hovered={hovered} />
      
      <Html
        position={isMobile ? [0, 5, -2] : [-2.5, 3, -5]}
        transform
        distanceFactor={isMobile ? 2.2 : 4.5}
        center
        className="pointer-events-none select-none"
      >
        <div 
          className="flex flex-col items-start"
          style={{
            transform: `translateY(${rhythm.smoothPulse * 5}px)`,
            opacity: 0.8 + rhythm.sharpPulse * 0.2,
            transition: 'opacity 0.1s linear'
          }}
        >
          <h1 
            className="font-heading text-6xl md:text-[140px] font-bold tracking-tighter leading-none text-highlight mix-blend-difference whitespace-nowrap animate-in fade-in duration-1000"
            style={{ transform: `translateX(${rhythm.drift * 10}px)` }}
          >
            John Ebenezer
          </h1>
          <p 
            className="font-mono text-[10px] md:text-sm tracking-[0.4em] md:tracking-[0.8em] uppercase text-accent/80 mt-6 blur-[0.5px]"
            style={{ 
              transform: `translateX(${Math.sin((rhythm.fullCycle + 0.1) * Math.PI) * 5}px)`,
              opacity: 0.6 + Math.pow(Math.sin((rhythm.beatPhase + 0.1) * Math.PI), 3) * 0.4
            }}
          >
            Analog Heart, Digital Brain
          </p>
        </div>
      </Html>

      <Vinyl rhythm={rhythm} hovered={hovered} />
      <Tonearm rhythm={rhythm} />

      <group position={[1.5, 0.2, -1.5]} rotation={[0.4, -0.8, -0.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[2, 0.1, 3.5, 32, 1, true]} />
          <meshStandardMaterial color="#d4a017" metalness={0.95} roughness={0.15} side={THREE.DoubleSide} />
        </mesh>
        <pointLight intensity={rhythm.sharpPulse * 500 + 100} color="#ffaa00" distance={5} />
      </group>

      <mesh receiveShadow castShadow>
        <boxGeometry args={[4, 0.4, 4]} />
        <meshStandardMaterial color="#1a120b" roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  );
}
