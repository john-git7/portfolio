"use client";

import { useEffect, useRef, useState } from "react";
import Scene from "@/components/Scene";
import AudioManager from "@/components/AudioManager";
import VintagePaperBackground from "@/components/VintagePaperBackground";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import Hero from "@/components/Hero/Hero";
import Skills from "@/components/Skills/Skills";
import Projects from "@/components/Projects/Projects";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer";
import { ReactLenis, useLenis } from 'lenis/react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { globalScrollState } from "@/store/scrollStore";

function GSAPSync() {
  const lenis = useLenis(({ scroll, progress }) => {
    globalScrollState.scroll = scroll;
    globalScrollState.progress = progress;
    ScrollTrigger.update();
  });

  useEffect(() => {
    if (!lenis) return;
    
    // Sync GSAP ticker with Lenis for smooth ScrollTrigger animations
    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    
    return () => {
      gsap.ticker.remove(update);
    };
  }, [lenis]);
  
  return null;
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Force scroll to top on refresh
    if (typeof window !== 'undefined') {
      history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }

    gsap.registerPlugin(ScrollTrigger);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <ReactLenis root options={{ duration: 1.4, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, autoRaf: false }}>
      <GSAPSync />
      <div ref={containerRef} className="relative w-full text-primary-text bg-background font-sans overflow-x-hidden md:cursor-none">
      <CustomCursor />
      <ScrollProgress />
      
      {/* Cinematic Texture Layer */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-20">
        <VintagePaperBackground />
      </div>

      {/* Global UI Components */}
      <Navbar />
      <AudioManager />

      {/* 3D Canvas Layer (Fixed Background) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Scene />
      </div>

      {/* =====================
          SCROLLABLE DOM CONTENT — Natural editorial flow
          ===================== */}
      
      {/* Hero Section */}
      <Hero />

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Projects Section */}
      <Projects />

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Skills Section */}
      <Skills />

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <Footer />
      </div>
    </ReactLenis>
  );
}
