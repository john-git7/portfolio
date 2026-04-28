"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Lighting() {
  const lightRef = useRef<THREE.PointLight>(null);
  const { viewport, mouse } = useThree();

  useFrame((state) => {
    if (!lightRef.current) return;
    
    // Mouse following light with subtle lag
    const x = (mouse.x * viewport.width) / 2;
    const y = (mouse.y * viewport.height) / 2;
    
    lightRef.current.position.lerp(new THREE.Vector3(x, y, 5), 0.1);
  });

  return (
    <>
      <ambientLight intensity={0.4} color="#f5e1c0" />
      
      {/* Global Mouse Follower for Highlights */}
      <pointLight 
        ref={lightRef} 
        intensity={80} 
        distance={25} 
        color="#fcd59a" 
        decay={1.5}
      />

      <color attach="background" args={["#0a0806"]} />
      
      {/* Cinematic Fog - Reduced density so background stays visible throughout scroll */}
      <fogExp2 attach="fog" args={["#0a0806", 0.005]} />
    </>
  );
}
