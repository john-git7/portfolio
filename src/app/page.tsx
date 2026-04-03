"use client";

import { useEffect, useRef, useState } from "react";
import Scene from "@/components/Scene";
import AudioManager from "@/components/AudioManager";
import VintagePaperBackground from "@/components/VintagePaperBackground";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero/Hero";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lenis, setLenis] = useState<any>(null);

  useEffect(() => {
    // Force scroll to top on refresh
    if (typeof window !== 'undefined') {
      history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }

    gsap.registerPlugin(ScrollTrigger);
    
    // Smooth scrolling setup
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    setLenis(lenisInstance);

    lenisInstance.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    return () => {
      gsap.ticker.remove(lenisInstance.raf);
      lenisInstance.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full text-primary-text bg-background font-sans overflow-hidden md:cursor-none">
      <CustomCursor />
      
      {/* Cinematic Texture Layer - Behind Hero but ahead of 3D Canvas */}
      <div className="fixed inset-0 z-1 pointer-events-none opacity-20">
        <VintagePaperBackground />
      </div>

      {/* Hero Layer (DOM UI) */}
      <section className="relative z-10 w-full">
        <Hero />
      </section>

      {/* Global Navigation & Audio */}
      <Navbar lenis={lenis} />
      <AudioManager />

      {/* 3D Canvas Layer (VISUAL BACKGROUND) */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <Scene />
      </div>

      {/* SCROLL TRACKER - Space for About, Skills, Projects, Contact scenes to live below Hero */}
      <div className="relative z-5 w-full pointer-events-none" style={{ height: "400vh" }}>
        {/* Placeholder spaces for other sections */}
        <div id="about" className="h-screen w-full" />
        <div id="skills" className="h-screen w-full" />
        <div id="projects" className="h-screen w-full" />
        <div id="contact" className="h-screen w-full" />
      </div>
    </div>
  );
}
