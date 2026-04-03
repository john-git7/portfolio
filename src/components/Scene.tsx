"use client";

import { Canvas } from "@react-three/fiber";
import CameraSetup from "../three/cameraSetup";
import Lighting from "../three/lighting";
import { useThree } from "@react-three/fiber";

// Import abstract scenes
import HeroScene from "./HeroScene";
import AboutScene from "./AboutScene";
import SkillsScene from "./SkillsScene";
import ProjectsScene from "./ProjectsScene";
import ContactScene from "./ContactScene";

function ResponsiveScene() {
  const { size } = useThree();
  const isMobile = size.width < 768;
  const scale = 1.0; // Keep scale consistent to avoid tiny text issues

  return (
    <>
      <Lighting />
      <CameraSetup />

      {/* Hero (Phonograph @ 0, 0, 0) */}
      <group position={isMobile ? [0, 0, 2] : [0, 0, 0]} name="scene-hero" scale={scale}>
        <HeroScene isMobile={isMobile} />
      </group>

      {/* About (Melodica @ 0, -15, -80) */}
      <group position={isMobile ? [0, -20, -75] : [0, -25, -80]} name="scene-about" scale={scale}>
        <AboutScene isMobile={isMobile} />
      </group>

      {/* Skills (Brass @ 30, -30, -160) */}
      <group position={isMobile ? [30, -40, -155] : [40, -50, -160]} name="scene-skills" scale={scale}>
        <SkillsScene isMobile={isMobile} />
      </group>

      {/* Projects (Gallery @ 60, -45, -240) */}
      <group position={isMobile ? [60, -60, -235] : [80, -75, -240]} name="scene-projects" scale={scale}>
        <ProjectsScene isMobile={isMobile} />
      </group>

      {/* Contact (Ending @ 90, -60, -320) */}
      <group position={isMobile ? [90, -80, -315] : [120, -100, -320]} name="scene-contact" scale={scale}>
        <ContactScene isMobile={isMobile} />
      </group>
    </>
  );
}

export default function Scene() {
  return (
    <Canvas 
      shadows 
      dpr={[1, 1.5]} // Capped dpr for performance
      gl={{ 
        antialias: true, 
        alpha: true, 
        powerPreference: "high-performance",
        stencil: false,
        depth: true
      }}
      camera={{ fov: 45 }}
    >
      <ResponsiveScene />
    </Canvas>
  );
}
