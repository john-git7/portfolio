import { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text, useCursor, Float, Html } from "@react-three/drei";
import { useMicroMotion, useMouseInteraction } from "../animations/interactions";

function ProjectPlaque({ 
  position, 
  title, 
  description, 
  rotation = [0, 0, 0],
  isMobile = false
}: { 
  position: [number, number, number], 
  title: string, 
  description: string,
  rotation?: [number, number, number],
  isMobile?: boolean
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const targetScale = hovered ? 1.05 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={position} rotation={rotation} ref={meshRef}>
        {/* Main Plaque Body */}
        <mesh 
          castShadow 
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        >
          <boxGeometry args={[6.2, 4.2, 0.1]} />
          <meshStandardMaterial color="#0d0d0d" roughness={0.3} metalness={0.9} />
        </mesh>
        
        {/* Inner Surface */}
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[5.8, 3.8, 0.05]} />
          <meshStandardMaterial 
            color={hovered ? "#1a1a1a" : "#050505"} 
            roughness={0.1} 
            metalness={1} 
            emissive={hovered ? "#fcd59a" : "#000"}
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Integrated Html for text - allows better typography & layout */}
        <Html
          position={[0, 0, 0.1]}
          transform
          distanceFactor={isMobile ? 2.2 : 5}
          center
          className="pointer-events-none select-none w-[300px]"
        >
          <div className={`${isMobile ? 'p-4' : 'p-8'} text-center md:text-left`}>
            <h3 className={`font-heading text-2xl md:text-4xl mb-4 transition-colors duration-500 ${hovered ? 'text-accent' : 'text-highlight'}`}>
              {title}
            </h3>
            <p className="text-[10px] md:text-sm font-light leading-relaxed text-[#a8a096] mb-4 md:mb-8">
              {description}
            </p>
            <div className={`font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-40'}`}>
              Details &rarr;
            </div>
          </div>
        </Html>

        {/* Dedicated Point Light for Hover Feedback */}
        <pointLight 
          position={[0, 0, 1]} 
          intensity={hovered ? 30 : 0} 
          color="#fcd59a" 
          distance={8}
        />
      </group>
    </Float>
  );
}

export default function ProjectsScene({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Floating movement
  useMicroMotion(groupRef, 0.1, 0.3);

  // Perspective tilt
  useMouseInteraction(groupRef, isMobile ? 0.4 : 0.7);

  return (
    <group ref={groupRef}>
      {/* Integrated "Selected Works" Title */}
      <Html
        position={isMobile ? [0, 12, 0] : [-15, 8, -5]}
        transform
        distanceFactor={isMobile ? 2.5 : 4.5}
        center={isMobile}
      >
        <div className={`pointer-events-auto select-none interactive cursor-pointer group ${isMobile ? 'text-center' : ''}`}>
          <h2 className="font-heading text-5xl md:text-[120px] font-bold uppercase tracking-tighter leading-none text-highlight/20 italic transition-all group-hover:text-highlight/60 whitespace-nowrap">
            Selected Work
          </h2>
          <div className="flex items-center gap-4 mt-6">
            <div className="h-[1px] w-12 bg-accent/40" />
            <p className="font-mono text-[9px] md:text-sm tracking-[0.5em] uppercase text-accent/80 transition-all group-hover:tracking-[0.7em]">
              Archive // 2024-2026
            </p>
          </div>
        </div>
      </Html>

      {/* Cinematic Mood Lighting */}
      <spotLight 
        position={[20, 30, 20]} 
        angle={0.4} 
        penumbra={1} 
        intensity={300} 
        color="#ffffff" 
        castShadow 
      />
      <pointLight position={[-15, 10, 10]} intensity={100} color="#ffaa00" />
      
      <ProjectPlaque 
        position={isMobile ? [0, 5, 0] : [-8, 2, 2]} 
        rotation={isMobile ? [0, 0, 0] : [0, 0.3, 0]}
        title="TUNIFY" 
        description="A cinematic music streaming experience built with React and Web Audio API." 
        isMobile={isMobile}
      />

      <ProjectPlaque 
        position={isMobile ? [0, -5, 0] : [6, -4, 6]} 
        rotation={isMobile ? [0, 0, 0] : [0, -0.2, 0]}
        title="AGRICONNECT" 
        description="A scalable B2B agricultural marketplace mapping farmers to global supply chains." 
        isMobile={isMobile}
      />
    </group>
  );
}
