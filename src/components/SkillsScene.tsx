import { useRef, useState } from "react";
import * as THREE from "three";
import { useMicroMotion, useMouseInteraction, useCinematicHover } from "../animations/interactions";
import { Text, Float, Html } from "@react-three/drei";

export default function SkillsScene({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Slight floating effect
  useMicroMotion(groupRef, 0.2, 0.3);

  // Perspective tilt
  useMouseInteraction(groupRef, isMobile ? 0.6 : 1.2);

  // Hover lift
  useCinematicHover(groupRef, hovered, 0.04);

  const skills = [
    "REACT / NEXT.JS",
    "NODE.JS / MONGODB",
    "THREE.JS / WEBGL",
    "TYPESCRIPT",
    "GSAP / ANIMATION"
  ];

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Integrated Skills UI */}
      <Html
        position={isMobile ? [0, 5, 0] : [-10, 0, 0]}
        transform
        distanceFactor={isMobile ? 1.8 : 3.5}
        center={isMobile}
      >
        <div className={`pointer-events-auto select-none interactive cursor-pointer group ${isMobile ? 'text-center' : ''}`}>
          <h2 className="font-heading text-2xl md:text-6xl text-accent mb-8 md:mb-16 font-bold uppercase tracking-tight opacity-90 group-hover:opacity-100 transition-opacity whitespace-nowrap drop-shadow-2xl">
            Core Expertise
          </h2>
          <div className={`flex flex-col ${isMobile ? 'gap-3 items-center' : 'gap-5 md:gap-8'}`}>
            {skills.map((skill, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 md:gap-8 group/item transition-all duration-500 hover:translate-x-4"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`h-[2px] bg-accent/30 group-hover/item:bg-accent transition-all duration-500 ${isMobile ? 'hidden' : 'w-16 group-hover/item:w-24'}`} />
                <span className="font-mono text-xl md:text-3xl tracking-[0.1em] md:tracking-[0.2em] font-black text-[#8a8076] group-hover/item:text-highlight transition-colors whitespace-nowrap">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Html>

      {/* Cinematic Lighting Refinement */}
      <spotLight 
        position={[10, 15, 10]} 
        angle={0.3} 
        penumbra={0.5} 
        intensity={500} 
        color="#fff1d6" 
        castShadow 
      />
      <pointLight position={[-10, 5, 5]} intensity={200} color="#ffaa00" distance={30} />
      {/* Rim light for that high-end metallic edge */}
      <pointLight position={[5, -5, -5]} intensity={150} color="#ffffff" distance={20} />

      {/* --- BRASS ART SCULPTURE --- */}
      
      {/* Central Horn Bell */}
      <mesh position={[2, 0, -2]} rotation={[0.4, -0.8, -0.2]} castShadow>
        <cylinderGeometry args={[2.5, 0.2, 6, 32, 1, true]} />
        <meshStandardMaterial 
          color="#b8860b" 
          metalness={1} 
          roughness={0.05} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Secondary Bell (Upward) */}
      <mesh position={[4, 3, -4]} rotation={[-0.2, 0.5, 0.1]} castShadow>
        <cylinderGeometry args={[1.5, 0.15, 4, 32, 1, true]} />
        <meshStandardMaterial 
          color="#d4af37" 
          metalness={1} 
          roughness={0.1} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Valve Blocks & Piping */}
      <group position={[1.2, -1, -1.5]} rotation={[0, 0.5, 0]}>
        {[0, 0.5, 1].map((x) => (
          <mesh key={x} position={[x, 0, 0]} castShadow>
            <boxGeometry args={[0.3, 1, 0.3]} />
            <meshStandardMaterial color="#8b4513" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
        {/* Connection pipe */}
        <mesh position={[0.5, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 1.5]} />
          <meshStandardMaterial color="#b8860b" metalness={1} />
        </mesh>
      </group>

      {/* Floating Decorative Pipes */}
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[-1, -2, -3]} rotation={[1.5, 0, 0.5]} castShadow>
          <torusGeometry args={[1.2, 0.05, 16, 64]} />
          <meshStandardMaterial color="#d4a017" metalness={1} roughness={0} />
        </mesh>
      </Float>
    </group>
  );
}
