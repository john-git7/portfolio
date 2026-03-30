"use client";

import { useEffect, useRef } from "react";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Skills from "@/components/Skills/Skills";
import Projects from "@/components/Projects/Projects";
import Contact from "@/components/Contact/Contact";
import Navigation from "@/components/Navigation/Navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Subtle page depth animation for all sections
    if (containerRef.current) {
      const sections = gsap.utils.toArray<HTMLElement>("section:not(:first-child)");
      
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { 
            y: 80, 
            scale: 0.98,
            boxShadow: "0px -20px 40px rgba(43, 30, 18, 0)" 
          },
          {
            y: 0,
            scale: 1,
            boxShadow: "0px -20px 40px rgba(43, 30, 18, 0.05)",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "top 30%",
              scrub: 1,
            },
          }
        );
      });
    }

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Navigation />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </div>
  );
}
