"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(
      titleRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, delay: 0.5 }
    )
    .fromTo(
      subtitleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "-=1"
    )
    .fromTo(
      ctaRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "-=0.8"
    );
  }, []);

  const scrollToAbout = () => {
    // Assuming next section has an ID or by calculating height
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth"
    });
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center pointer-events-none"
    >
      <div className="container mx-auto px-6 z-10 flex flex-col items-center md:items-start text-center md:text-left pointer-events-auto">
        <div className="max-w-4xl">
          <h1 
            ref={titleRef}
            className="font-heading text-6xl md:text-[140px] font-bold tracking-tighter leading-none text-highlight mix-blend-difference select-none"
          >
            John Ebenezer
          </h1>
          
          <p 
            ref={subtitleRef}
            className="font-mono text-[10px] md:text-sm tracking-[0.4em] md:tracking-[0.8em] uppercase text-accent/80 mt-6 blur-[0.2px] select-none"
          >
            Analog Heart, Digital Brain
          </p>

          <div ref={ctaRef} className="mt-16 md:mt-24">
            <button 
              onClick={scrollToAbout}
              className="group relative px-8 py-3 border border-accent/30 hover:border-accent transition-colors duration-500 overflow-hidden"
            >
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent/80 group-hover:text-accent">
                Discover The Narrative
              </span>
              <div className="absolute inset-0 bg-accent/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Down Hint in DOM */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40 animate-pulse select-none">
        <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-accent">Scroll</span>
        <div className="w-[1px] h-12 bg-accent/30" />
      </div>
    </section>
  );
}
