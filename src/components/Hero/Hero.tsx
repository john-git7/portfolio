"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppStore } from "@/store/appStore";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isEngaged } = useAppStore();

  useEffect(() => {
    if (!isEngaged) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          start: "top top",
          end: "+=1800", // Drastically reduced scroll distance required
          scrub: 0.5, // Tighter responsiveness
        }
      });

      // Scene 1: John Ebenezer
      tl.to(".scene-1", { opacity: 0, y: -30, duration: 0.5 })
        
        // Scene 2: The server must be relentless
        .fromTo(".scene-2", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
        .to(".scene-2", { opacity: 0, y: -30, duration: 0.5 }, "+=1") // Solid hold
        
        // Scene 3: Backend logic. Visual precision.
        .fromTo(".scene-3", { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 0.5 }, "-=0.2")
        .to(".scene-3", { opacity: 0, scale: 0.95, duration: 0.5 }, "+=1")
        
        // Scene 4: State consistency under load.
        .fromTo(".scene-4-line", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 }, "-=0.2")
        .to(".scene-4", { opacity: 0, y: -30, duration: 0.5 }, "+=1")
        
        // Scene 5: Theory is irrelevant without execution.
        .fromTo(".scene-5", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");

    }, containerRef);

    return () => ctx.revert();
  }, [isEngaged]);

  const scrollToProjects = () => {
    const projectsEl = document.getElementById("projects");
    if (projectsEl) {
      projectsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ----------------------------------------------------
  // BYPASS MODE (Recruiter-friendly static view)
  // ----------------------------------------------------
  if (!isEngaged) {
    return (
      <section id="hero" className="editorial-section editorial-section--hero min-h-[90vh] flex flex-col justify-center py-32">
        <div className="editorial-container flex flex-col items-start max-w-4xl">
          <h1 className="font-mono text-4xl sm:text-5xl md:text-8xl tracking-tighter text-highlight mb-4">
            John Ebenezer
          </h1>
          <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-accent/80 mb-16">
            Heavy Architecture. Fluid Interfaces.
          </p>
          
          <div className="space-y-8 mb-20 text-base sm:text-lg md:text-2xl text-primary-text/80 font-mono tracking-tight leading-relaxed border-l-2 border-primary-text/10 pl-4 md:pl-6">
            <p>The server must be relentless.<br /><span className="text-primary-text/40">The client must be weightless.</span></p>
            <p>Backend logic. Visual precision.<br /><span className="text-accent/80 uppercase text-xs sm:text-sm tracking-widest">No compromise.</span></p>
            <p>State consistency under load.<br />60fps under real-time updates.</p>
          </div>

          <p className="text-lg sm:text-xl md:text-3xl text-primary-text mb-8">
            Theory is irrelevant without execution.
          </p>

          <button 
            onClick={scrollToProjects} 
            className="magnetic-btn px-10 py-4 border border-accent/40 hover:border-accent hover:bg-accent/10 transition-colors duration-500"
          >
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent">
              Enter Archive
            </span>
          </button>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // ENGAGE MODE (Cinematic Pinned Sequence)
  // ----------------------------------------------------
  return (
    <section id="hero" ref={containerRef} className="relative h-screen w-full bg-transparent pointer-events-none">
      <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center pointer-events-auto">
        
        {/* SCENE 01: Hook */}
        <div className="scene-1 absolute inset-0 flex flex-col items-center justify-center text-center px-4 w-full max-w-[95vw] mx-auto">
          <h1 className="font-mono text-6xl sm:text-7xl md:text-[120px] font-bold tracking-tighter text-highlight mix-blend-difference select-none mb-6">
            John Ebenezer
          </h1>
          <p className="font-mono text-[10px] sm:text-xs md:text-sm tracking-[0.4em] uppercase text-accent/80">
            Heavy Architecture. Fluid Interfaces.
          </p>
        </div>

        {/* SCENE 02: Positioning */}
        <div className="scene-2 absolute inset-0 flex flex-col items-center justify-center text-center px-4 w-full max-w-[90vw] mx-auto opacity-0">
          <p className="font-mono text-3xl sm:text-4xl md:text-6xl text-primary-text/90 tracking-tight leading-tight">
            The server must be relentless.<br />
            <span className="text-primary-text/50">The client must be weightless.</span>
          </p>
        </div>

        {/* SCENE 03: Differentiation */}
        <div className="scene-3 absolute inset-0 flex flex-col items-center justify-center text-center px-4 w-full max-w-[90vw] mx-auto opacity-0">
          <p className="font-mono text-4xl sm:text-5xl md:text-7xl text-primary-text font-bold tracking-tighter leading-none mb-8">
            Backend logic.<br />Visual precision.
          </p>
          <p className="font-mono text-lg sm:text-xl md:text-3xl text-accent/80 uppercase tracking-[0.4em]">
            No compromise.
          </p>
        </div>

        {/* SCENE 04: Credibility */}
        <div className="scene-4 absolute inset-0 flex flex-col items-center justify-center text-center px-4 w-full max-w-[90vw] mx-auto">
          <p className="scene-4-line opacity-0 font-mono text-2xl sm:text-3xl md:text-5xl text-primary-text/80 mb-6 tracking-tight">
            State consistency under load.
          </p>
          <p className="scene-4-line opacity-0 font-mono text-2xl sm:text-3xl md:text-5xl text-primary-text/80 tracking-tight">
            60fps under real-time updates.
          </p>
        </div>

        {/* SCENE 05: Transition */}
        <div className="scene-5 absolute inset-0 flex flex-col items-center justify-center text-center px-4 w-full max-w-[90vw] mx-auto opacity-0">
          <p className="font-mono text-3xl sm:text-4xl md:text-6xl text-highlight mb-16 tracking-tight">
            Theory is irrelevant without execution.
          </p>
          <button 
            onClick={scrollToProjects}
            className="magnetic-btn px-12 py-5 border border-accent/40 hover:border-accent hover:bg-accent/10 transition-all duration-500"
          >
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
              Enter Archive
            </span>
          </button>
        </div>

      </div>
    </section>
  );
}
