"use client";

import { useEffect, useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createCameraTimeline } from "../animations/cameraTimeline";

export default function CameraSetup() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  // The 'animator' group is what GSAP actually tweens
  const animatorRef = useRef<THREE.Group>(null);
  
  // The 'drift' group adds mouse parallax on top of GSAP
  const driftRef = useRef<THREE.Group>(null);

  const { mouse, size } = useThree();
  const aspect = size.width / size.height;
  
  // Calculate responsive FOV: Increase for portrait (mobile)
  const baseFov = 45;
  const responsiveFov = aspect < 1 ? baseFov + (1 - aspect) * 30 : baseFov;

  useEffect(() => {
    if (!animatorRef.current) return;

    // Find scenes in the parent canvas to control visibility
    const scene = animatorRef.current.parent;
    const hero = scene?.getObjectByName("scene-hero");
    const about = scene?.getObjectByName("scene-about");
    const skills = scene?.getObjectByName("scene-skills");
    const projects = scene?.getObjectByName("scene-projects");
    const contact = scene?.getObjectByName("scene-contact");

    const sceneGroups = { hero, about, skills, projects, contact };

    // GSAP controls the animator group and scene visibility
    const tl = createCameraTimeline(animatorRef.current, document.body, sceneGroups);

    return () => {
      if (tl) tl.kill();
    };
  }, []);

  useFrame((state, delta) => {
    if (!driftRef.current) return;

    // Calculate subtle drift based on mouse
    const targetX = mouse.x * 0.5;
    const targetY = mouse.y * 0.3;

    // Smoother lerp for cinematic "weight"
    driftRef.current.position.x = THREE.MathUtils.lerp(driftRef.current.position.x, targetX, delta * 2);
    driftRef.current.position.y = THREE.MathUtils.lerp(driftRef.current.position.y, targetY, delta * 2);
    
    // Slight rotation drift
    driftRef.current.rotation.y = THREE.MathUtils.lerp(driftRef.current.rotation.y, -targetX * 0.05, delta * 1.5);
    driftRef.current.rotation.x = THREE.MathUtils.lerp(driftRef.current.rotation.x, targetY * 0.05, delta * 1.5);
  });

  return (
    <group ref={animatorRef}>
      <group ref={driftRef}>
        <PerspectiveCamera 
          ref={cameraRef} 
          makeDefault 
          fov={responsiveFov} 
          near={0.1} 
          far={1000} 
        />
      </group>
    </group>
  );
}
