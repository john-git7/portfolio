"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSceneStore } from "@/store/sceneStore";

export default function MasterTimeline() {
  const { cameraGroupRef } = useSceneStore();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    let mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      // We bind the master timeline to the .scroll-container element which is 600vh
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".scroll-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Smooth scrub
        },
      });

      // --- HTML DOM EXHIBITS & CAMERA FLIGHT PATH ---
      // We use GSAP labels to synchronize camera movements precisely with 
      // the sections fading in and out.
      
      // 1. HERO (Starts visible)
      tl.addLabel("hero");
      tl.to({}, { duration: 0.2 }, "hero"); // Small pause
      tl.to(".hero-name, .hero-role, .hero-statement, .hero-index, .scroll-indicator", { 
        autoAlpha: 0, 
        y: -30, 
        stagger: 0.1, 
        ease: "power2.inOut", 
        duration: 1 
      }, "hero+=0.2");
      tl.to(".hero-section", { autoAlpha: 0, duration: 0.01 }, ">");

      // 2. ABOUT
      tl.addLabel("about");
      
      if (cameraGroupRef) {
        tl.to(cameraGroupRef.position, { z: 4, x: -1, ease: "power2.inOut", duration: 1.5 }, "about");
        tl.to(cameraGroupRef.rotation, { y: 0.1, ease: "power2.inOut", duration: 1.5 }, "about");
      }

      tl.to(".about-section", { autoAlpha: 1, duration: 0.01 }, "about");
      tl.fromTo(".about-text", 
        { autoAlpha: 0, y: 40 }, 
        { autoAlpha: 1, y: 0, stagger: 0.1, ease: "power2.out", duration: 1 }, 
        "about+=0.01"
      );
      tl.fromTo(".about-index", 
        { autoAlpha: 0, scale: 0.8 }, 
        { autoAlpha: 1, scale: 1, ease: "power2.out", duration: 1 }, 
        "about+=0.01" 
      );
      // Pause for reading
      tl.to({}, { duration: 0.8 });
      // Fade out
      tl.to(".about-text, .about-index", { 
        autoAlpha: 0, y: -40, stagger: 0.1, ease: "power2.in", duration: 1 
      });
      tl.to(".about-section", { autoAlpha: 0, duration: 0.01 }, ">");

      // 3. PROJECTS
      tl.addLabel("projects");
      
      if (cameraGroupRef) {
        tl.to(cameraGroupRef.position, { z: 0, y: -0.5, ease: "power2.inOut", duration: 1.5 }, "projects");
        tl.to(cameraGroupRef.rotation, { x: 0.05, y: 0, ease: "power2.inOut", duration: 1.5 }, "projects");
      }

      tl.to(".projects-section", { autoAlpha: 1, duration: 0.01 }, "projects");
      tl.fromTo(".work-header", 
        { autoAlpha: 0, y: 30 }, 
        { autoAlpha: 1, y: 0, ease: "power2.out", duration: 1 }, 
        "projects+=0.01"
      );
      tl.fromTo(".work-row", 
        { autoAlpha: 0, y: 40 }, 
        { autoAlpha: 1, y: 0, stagger: 0.1, ease: "power2.out", duration: 1 }, 
        "projects+=0.5" // Overlap slightly with header
      );
      // Pause for reading
      tl.to({}, { duration: 1 });
      // Fade out
      tl.to(".work-header, .work-row", { 
        autoAlpha: 0, y: -30, stagger: 0.1, ease: "power2.in", duration: 1 
      });
      tl.to(".projects-section", { autoAlpha: 0, duration: 0.01 }, ">");

      // 4. SKILLS
      tl.addLabel("skills");
      
      if (cameraGroupRef) {
        tl.to(cameraGroupRef.position, { z: -4, x: 1, y: 0, ease: "power2.inOut", duration: 1.5 }, "skills");
        tl.to(cameraGroupRef.rotation, { y: -0.1, x: 0, ease: "power2.inOut", duration: 1.5 }, "skills");
      }

      tl.to(".skills-section", { autoAlpha: 1, duration: 0.01 }, "skills");
      tl.fromTo(".skills-section .h-section, .skills-section .label", 
        { autoAlpha: 0, y: 30 }, 
        { autoAlpha: 1, y: 0, ease: "power2.out", duration: 1 }, 
        "skills+=0.01"
      );
      tl.fromTo(".stack-col", 
        { autoAlpha: 0, y: 40 }, 
        { autoAlpha: 1, y: 0, stagger: 0.1, ease: "power2.out", duration: 1 }, 
        "skills+=0.5"
      );
      // Pause for reading
      tl.to({}, { duration: 1 });
      // Fade out
      tl.to(".skills-section .h-section, .skills-section .label, .stack-col", { 
        autoAlpha: 0, y: -30, stagger: 0.1, ease: "power2.in", duration: 1 
      });
      tl.to(".skills-section", { autoAlpha: 0, duration: 0.01 }, ">");

      // 5. CONTACT
      tl.addLabel("contact");
      
      if (cameraGroupRef) {
        tl.to(cameraGroupRef.position, { z: -8, x: 2, y: 0, ease: "power2.inOut", duration: 1.5 }, "contact");
        tl.to(cameraGroupRef.rotation, { y: -0.15, x: 0, ease: "power2.inOut", duration: 1.5 }, "contact");
      }

      tl.to(".contact-section", { autoAlpha: 1, duration: 0.01 }, "contact");
      tl.fromTo(".contact-headline", 
        { autoAlpha: 0, y: 40 }, 
        { autoAlpha: 1, y: 0, ease: "power2.out", duration: 1 }, 
        "contact+=0.01"
      );
      tl.fromTo(".contact-email, .contact-social-link, .contact-footer", 
        { autoAlpha: 0, y: 20 }, 
        { autoAlpha: 1, y: 0, stagger: 0.1, ease: "power2.out", duration: 1 }, 
        "contact+=0.5"
      );
      // Small padding at the end so it doesn't snap abruptly at scroll bottom
      tl.to({}, { duration: 0.5 });

      return () => {
        tl.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, [cameraGroupRef]);

  return null;
}
