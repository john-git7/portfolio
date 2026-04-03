import { useRef } from "react";
import * as THREE from "three";
import { useMicroMotion, useMouseInteraction } from "../animations/interactions";
import { Html } from "@react-three/drei";

export default function ContactScene({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useMicroMotion(groupRef, 0.4, 0.1); // Extremely slow drift

  // Soft perspective shift
  useMouseInteraction(groupRef, isMobile ? 0.2 : 0.4);

  return (
    <group ref={groupRef}>
      {/* Integrated Contact Form */}
      <Html
        position={[0, 0, 0]}
        transform
        distanceFactor={isMobile ? 2.2 : 4}
        center
      >
        <div className={`w-full max-w-[90vw] md:max-w-lg ${isMobile ? 'p-6' : 'p-12'} bg-[#0d0a07]/80 backdrop-blur-3xl border border-white/5 rounded-2xl shadow-2xl pointer-events-auto select-none interactive transition-transform hover:scale-[1.02]`}>
          <div className="text-center mb-10">
            <h2 className="font-heading text-5xl text-highlight mb-4 font-light italic tracking-tight">Connect</h2>
            <p className="font-mono text-[10px] text-[#a8a096] tracking-[0.3em] uppercase opacity-60">Ready to start the session?</p>
          </div>
          
          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                placeholder="NAME" 
                className="w-full bg-transparent border-b border-white/10 py-3 text-xs font-mono tracking-widest text-primary-text focus:outline-none focus:border-accent transition-colors placeholder-[#665e55]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="EMAIL" 
                className="w-full bg-transparent border-b border-white/10 py-3 text-xs font-mono tracking-widest text-primary-text focus:outline-none focus:border-accent transition-colors placeholder-[#665e55]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <textarea
                placeholder="MESSAGE"
                rows={3}
                className="w-full bg-transparent border-b border-white/10 py-3 text-xs font-mono tracking-widest text-primary-text focus:outline-none focus:border-accent transition-colors placeholder-[#665e55] resize-none"
              />
            </div>
            <button className="mt-4 px-12 py-5 bg-accent/5 border border-accent/20 text-accent hover:bg-accent hover:text-background transition-all duration-500 uppercase tracking-[0.4em] text-[10px] font-bold">
              Send Transmission
            </button>
          </form>
        </div>
      </Html>

      {/* Calm ending, barely lit */}
      <spotLight 
        position={[0, 20, 5]} 
        angle={0.8} 
        penumbra={0.7} 
        intensity={50} 
        color="#a98c69" 
        castShadow 
      />

      {/* A single, minimal monolithic object floating far away */}
      <mesh position={[0, -5, -30]} receiveShadow>
        <sphereGeometry args={[12, 64, 64]} />
        <meshStandardMaterial 
          color="#050505" 
          roughness={1} 
          metalness={0} 
        />
      </mesh>
    </group>
  );
}
