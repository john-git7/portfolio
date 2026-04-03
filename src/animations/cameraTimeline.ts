import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

// Make sure gsap is registered only once globally, usually in page.tsx, 
// but it's safe to do it here too just in case.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function createCameraTimeline(
  cameraGroup: THREE.Group,
  triggerElement: HTMLElement | Window | string,
  sceneGroups: { [key: string]: THREE.Object3D | undefined }
) {
  // Initial visibility: only Hero is visible
  if (sceneGroups.hero) sceneGroups.hero.visible = true;
  if (sceneGroups.about) sceneGroups.about.visible = false;
  if (sceneGroups.skills) sceneGroups.skills.visible = false;
  if (sceneGroups.projects) sceneGroups.projects.visible = false;
  if (sceneGroups.contact) sceneGroups.contact.visible = false;

  // Start the camera at Hero position
  cameraGroup.position.set(0, 0, 10);
  cameraGroup.rotation.set(0, 0, 0);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.1, // Near-instant camera response
    },
  });

  // PRE-TRANSITION STATE: Only hero is visible
  tl.set(sceneGroups.hero || {}, { visible: true });
  tl.set([
    sceneGroups.about || {}, 
    sceneGroups.skills || {}, 
    sceneGroups.projects || {}, 
    sceneGroups.contact || {}
  ], { visible: false });

  // --- 1. HERO ---
  tl.addLabel("hero");
  tl.to(cameraGroup.position, { z: 10, duration: 0.6 }); // Faster static pause

  // --- 2. MOVE TO ABOUT ---
  tl.addLabel("move-to-about");
  
  // Transition Starts: Move halfway before showing About
  tl.to(cameraGroup.position, {
    x: 0,
    y: -12.5,
    z: -30,
    ease: "power3.in",
    duration: 0.3
  });
  tl.set(sceneGroups.about || {}, { visible: true });
  tl.set(sceneGroups.hero || {}, { visible: false });

  tl.to(cameraGroup.position, {
    y: -25,
    z: -70, 
    ease: "power3.out",
    duration: 0.3
  });
  tl.to(cameraGroup.rotation, {
    x: -0.05, 
    y: 0.2,
    ease: "power3.inOut",
    duration: 0.6
  }, "<");

  // Hide hero after transition
  tl.set(sceneGroups.hero || {}, { visible: false });
  tl.to(cameraGroup.position, { z: -70, duration: 0.1 }); // Fast pause

  // --- 3. MOVE TO SKILLS ---
  tl.addLabel("move-to-skills");
  
  // Transition Starts: Move halfway before showing Skills
  tl.to(cameraGroup.position, {
    x: 20,
    y: -37.5,
    z: -110,
    ease: "power3.in",
    duration: 0.3
  });
  tl.set(sceneGroups.skills || {}, { visible: true });
  tl.set(sceneGroups.about || {}, { visible: false });

  tl.to(cameraGroup.position, {
    x: 40,
    y: -50,
    z: -150, 
    ease: "power3.out",
    duration: 0.3
  });
  tl.to(cameraGroup.rotation, {
    x: 0.02,
    y: -0.3,
    ease: "power3.inOut",
    duration: 0.6
  }, "<");

  tl.to(cameraGroup.position, { z: -150, duration: 0.1 }); // Fast pause

  // --- 4. MOVE TO PROJECTS ---
  tl.addLabel("move-to-projects");
  
  // Transition Starts: Move halfway before showing Projects
  tl.to(cameraGroup.position, {
    x: 60,
    y: -62.5,
    z: -190,
    ease: "power3.in",
    duration: 0.3
  });
  tl.set(sceneGroups.projects || {}, { visible: true });
  tl.set(sceneGroups.skills || {}, { visible: false });

  tl.to(cameraGroup.position, {
    x: 80,
    y: -75,
    z: -230, 
    ease: "power3.out",
    duration: 0.3
  });
  tl.to(cameraGroup.rotation, {
    x: -0.02,
    y: 0.1,
    ease: "power3.inOut",
    duration: 0.6
  }, "<");

  tl.to(cameraGroup.position, { z: -230, duration: 0.1 }); // Fast pause

  // --- 5. MOVE TO CONTACT ---
  tl.addLabel("move-to-contact");
  
  // Transition Starts: Move halfway before showing Contact
  tl.to(cameraGroup.position, {
    x: 100,
    y: -87.5,
    z: -270,
    ease: "power3.in",
    duration: 0.3
  });
  tl.set(sceneGroups.contact || {}, { visible: true });
  tl.set(sceneGroups.projects || {}, { visible: false });

  tl.to(cameraGroup.position, {
    x: 120,
    y: -100,
    z: -310, 
    ease: "power3.out",
    duration: 0.3
  });
  tl.to(cameraGroup.rotation, {
    x: -0.05,
    y: 0.1,
    z: 0.01,
    ease: "power3.inOut",
    duration: 0.6
  }, "<");

  tl.to(cameraGroup.position, { z: -310, duration: 0.2 }); // Final Pause

  return tl;
}
