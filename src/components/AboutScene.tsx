import { useRef, useState } from "react";
import * as THREE from "three";
import { Text, Float, Html } from "@react-three/drei";
import { useMicroMotion, useMouseInteraction, useCinematicHover } from "../animations/interactions";

export default function AboutScene({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Very slow breathing motion
  useMicroMotion(groupRef, 0.2, 0.4);

  // Perspective tilt
  useMouseInteraction(groupRef, isMobile ? 0.3 : 0.6);

  // Subtle hover lift
  useCinematicHover(groupRef, hovered, 0.03);

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Narrative Text Integrated into 3D */}
      <Html
        position={isMobile ? [0, 4, 0] : [-8, 2, 0]}
        transform
        distanceFactor={isMobile ? 2.2 : 4}
        center={isMobile}
      >
        <div className={`max-w-sm md:max-w-md pointer-events-auto select-none interactive cursor-pointer group ${isMobile ? 'text-center' : ''}`}>
          <h2 className="font-heading text-4xl md:text-6xl text-accent mb-4 font-light italic transition-all duration-700 group-hover:translate-x-4">The Narrative</h2>
          <p className={`text-lg md:text-xl font-light leading-relaxed text-[#d1c8bd]/80 ${isMobile ? '' : 'border-l border-accent/20 pl-6'}`}>
            I orchestrate clean, harmonious code to build digital experiences that resonate. 
            Minimalism in design paired with maximalism in performance.
          </p>
        </div>
      </Html>

      {/* Cool/warm offset lighting, highly dramatic */}
      <spotLight 
        position={[4, 10, 5]} 
        angle={0.2} 
        penumbra={1} 
        intensity={300} 
        color="#fff4e0" 
        castShadow 
      />
      <pointLight position={[2, -2, 2]} intensity={40} color="#ffaa00" distance={12} />
      <pointLight position={[-4, 4, 3]} intensity={20} color="#ffffff" distance={10} />

      {/* Rim light for the instrument */}
      <pointLight position={[5, 2, 2]} intensity={50} color="#add8e6" distance={15} />

      <Text
        position={[-4, 0.8, 1]}
        fontSize={0.15}
        color="#a8a096"
        maxWidth={4}
        anchorX="left"
      >
        // COMPOSITION & CODE
      </Text>
      
      {/* Melodica Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[7, 0.6, 1.6]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Mouthpiece / Tube setup */}
      <group position={[-4, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.35, 1.2, 16]} />
          <meshStandardMaterial color="#222" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      {/* Piano Keys Layout with micro-interaction */}
      {[...Array(14)].map((_, i) => {
        const isBlackKey = [1, 3, 6, 8, 10, 13].includes(i);
        const color = isBlackKey ? "#050505" : "#f2f2f2";
        const yPos = isBlackKey ? 0.4 : 0.31;
        const zPos = isBlackKey ? -0.25 : 0;
        const width = isBlackKey ? 0.2 : 0.35;
        const length = isBlackKey ? 0.9 : 1.3;

        return (
          <mesh 
            key={i} 
            position={[-2.8 + (i * 0.42), yPos, zPos]} 
            castShadow
          >
            <boxGeometry args={[width, 0.1, length]} />
            <meshStandardMaterial 
              color={color} 
              roughness={0.1} 
              metalness={0.2}
              emissive={hovered ? "#333" : "#000"}
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
}
