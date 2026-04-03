"use client";

import { Canvas } from "@react-three/fiber";
import CameraSetup from "../three/cameraSetup";
import Lighting from "../three/lighting";
import { useResponsiveScene, ResponsiveConfig } from "../hooks/useResponsiveScene";

// Import abstract scenes
import HeroScene from "./HeroScene";
import AboutScene from "./AboutScene";
import SkillsScene from "./SkillsScene";
import ProjectsScene from "./ProjectsScene";
import ContactScene from "./ContactScene";

/**
 * The core 3D world with responsive layout control
 */
function MainScene({ responsive }: { responsive: ResponsiveConfig }) {
  // Use responsive scale for the entire scene if needed, 
  // but better to apply per-component for precise control.
  const isMobile = responsive.cameraFov < 45; 

  return (
    <>
      <Lighting />
      <CameraSetup />

      {/* Hero (Phonograph @ Responsive Position) */}
      <group name="scene-hero">
        <HeroScene responsive={responsive} />
      </group>

      {/* About (Melodica @ 0, -25, -80) */}
      <group position={isMobile ? [0, -20, -75] : [0, -25, -80]} name="scene-about">
        <AboutScene isMobile={isMobile} />
      </group>

      {/* Skills (Brass @ 40, -50, -160) */}
      <group position={isMobile ? [30, -40, -155] : [40, -50, -160]} name="scene-skills">
        <SkillsScene isMobile={isMobile} />
      </group>

      {/* Projects (Gallery @ 80, -75, -240) */}
      <group position={isMobile ? [60, -60, -235] : [80, -75, -240]} name="scene-projects">
        <ProjectsScene isMobile={isMobile} />
      </group>

      {/* Contact (Ending @ 120, -100, -320) */}
      <group position={isMobile ? [90, -80, -315] : [120, -100, -320]} name="scene-contact">
        <ContactScene isMobile={isMobile} />
      </group>
    </>
  );
}

/**
 * The Background Canvas Layer
 */
export default function Scene() {
  // We need the hook at the top level to configure the Canvas camera
  // However, useResponsiveScene uses useThree(), so it MUST be inside Canvas.
  // We'll create a small wrapper to handle the conditional R3F state.
  
  return (
    <Canvas 
      shadows 
      dpr={[1, 1.5]}
      gl={{ 
        antialias: true, 
        alpha: true, 
        powerPreference: "high-performance",
        stencil: false,
        depth: true
      }}
    >
      <SceneContent />
    </Canvas>
  );
}

function SceneContent() {
  const responsive = useResponsiveScene();
  
  return (
    <>
      {/* Dynamic Camera setup is handled within CameraSetup which uses responsive values 
          or we can directly influence the state here if needed. */}
      <MainScene responsive={responsive} />
    </>
  );
}
