"use client";

import { useEffect, useRef, useState } from "react";
import Scene from "@/components/Scene";
import AudioManager from "@/components/AudioManager";
import VintagePaperBackground from "@/components/VintagePaperBackground";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [lenis, setLenis] = useState<any>(null);

  useEffect(() => {
    // Force scroll to top on refresh
    if (typeof window !== 'undefined') {
      history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }

    gsap.registerPlugin(ScrollTrigger);
    
    const lenisInstance = new Lenis({
      duration: 0.8, // Faster, snappier input
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -14 * t)), // More aggressive curve
      smoothWheel: true,
    });

    lenisInstance.scrollTo(0, { immediate: true });
    setLenis(lenisInstance);

    lenisInstance.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    // Scroll Hint Fade Out
    gsap.to("#scroll-hint", {
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "300 top", // Faster fade out
        scrub: true,
      },
      opacity: 0,
      scale: 0.8,
      pointerEvents: "none"
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
      
      {/* Cinematic Texture Layer */}
      <div className="fixed inset-0 z-[100] pointer-events-none opacity-30">
        <VintagePaperBackground />
      </div>

      <AudioManager />

      {/* Persistence Navigation */}
      <Navbar lenis={lenis} />

      {/* 3D Canvas Container */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <Scene />
      </div>

      {/* Hero Entrance / Start Button */}
      {!started && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-xl transition-opacity duration-1000">
          <button 
            onClick={() => setStarted(true)}
            className="group flex flex-col items-center gap-6 pointer-events-auto"
          >
            <div className="w-16 h-16 border border-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-accent border-b-[8px] border-b-transparent ml-1" />
            </div>
            <span className="font-mono text-xs tracking-[0.4em] uppercase text-accent/80 group-hover:text-accent transition-colors">
              Enter The Gallery
            </span>
          </button>
        </div>
      )}

      {/* Scroll Hint */}
      <div 
        id="scroll-hint"
        className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[150] flex flex-col items-center gap-4 transition-opacity duration-1000 ${started ? 'opacity-40 animate-pulse' : 'opacity-0'}`}
      >
        <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-accent">Scroll to Discover</span>
        <div className="w-[1px] h-12 bg-accent/30" />
      </div>

      {/* HTML Content & Scroll Track - COMPACTED to 250vh for efficiency */}
      <div className={`relative z-10 w-full pointer-events-none transition-opacity duration-1000 ${started ? 'opacity-100' : 'opacity-0'}`} style={{ height: "250vh" }}>
        {/* Ghost scroll track to drive the the 3D transitions */}
      </div>
    </div>
  );
}
