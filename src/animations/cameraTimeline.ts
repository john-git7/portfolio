import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Simplified camera timeline — gentle vertical descent with subtle rotations.
 * The camera creates depth/parallax behind DOM content, not framing 3D text.
 */
export function createCameraTimeline(
  cameraGroup: THREE.Group,
  triggerElement: HTMLElement | Window | string,
) {
  // Start the camera at Hero position
  cameraGroup.position.set(0, 0, 10);
  cameraGroup.rotation.set(0, 0, 0);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
    },
  });

  // --- 1. HERO (starting position) ---
  tl.addLabel("hero");
  tl.to(cameraGroup.position, { x: 0, y: 0, z: 10, duration: 0.05 });

  // --- 2. SCROLL TO ABOUT --- gentle descent + slight rotation
  tl.addLabel("move-to-about");
  tl.to(cameraGroup.position, {
    x: 2,
    y: -15,
    z: 6,
    ease: "power2.inOut",
    duration: 0.9
  });
  tl.to(cameraGroup.rotation, {
    x: -0.03,
    y: 0.05,
    ease: "power2.inOut",
    duration: 0.9
  }, "<");
  tl.to(cameraGroup.position, { duration: 0.05 }); // Brief pause

  // --- 3. SCROLL TO SKILLS --- continue descent with opposite rotation
  tl.addLabel("move-to-skills");
  tl.to(cameraGroup.position, {
    x: -3,
    y: -35,
    z: 4,
    ease: "power2.inOut",
    duration: 0.9
  });
  tl.to(cameraGroup.rotation, {
    x: 0.02,
    y: -0.06,
    ease: "power2.inOut",
    duration: 0.9
  }, "<");
  tl.to(cameraGroup.position, { duration: 0.05 });

  // --- 4. SCROLL TO PROJECTS --- deeper, wider view
  tl.addLabel("move-to-projects");
  tl.to(cameraGroup.position, {
    x: 4,
    y: -55,
    z: 3,
    ease: "power2.inOut",
    duration: 0.9
  });
  tl.to(cameraGroup.rotation, {
    x: -0.01,
    y: 0.04,
    ease: "power2.inOut",
    duration: 0.9
  }, "<");
  tl.to(cameraGroup.position, { duration: 0.05 });

  // --- 5. SCROLL TO CONTACT --- final position
  tl.addLabel("move-to-contact");
  tl.to(cameraGroup.position, {
    x: 0,
    y: -75,
    z: 5,
    ease: "power2.inOut",
    duration: 0.9
  });
  tl.to(cameraGroup.rotation, {
    x: -0.02,
    y: 0,
    z: 0.01,
    ease: "power2.inOut",
    duration: 0.9
  }, "<");

  return tl;
}
