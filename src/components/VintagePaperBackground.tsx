"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function VintagePaperBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrinkleRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrinkleRef.current || !grainRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Organic Breathing Motion - Extremely slow
      gsap.to(wrinkleRef.current, {
        scale: 1.02,
        duration: 20,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // 2. Subtle grain flicker - very low frequency
      gsap.fromTo(grainRef.current, 
        { opacity: 0.01 }, 
        {
          opacity: 0.03,
          duration: 4,
          ease: "none",
          repeat: -1,
          yoyo: true,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="vintage-paper-container">
      {/* Layer 1: Base paper tone */}
      <div className="vintage-paper-base" />
      
      {/* Layer 2: Wrinkle simulation (Slow breathing) */}
      <div ref={wrinkleRef} className="vintage-paper-wrinkles" />
      
      {/* Layer 3: Grain layer (Subtle flicker) */}
      <div ref={grainRef} className="vintage-paper-grain" />

      {/* Layer 4: Lighting layer */}
      <div className="vintage-paper-lighting" />
    </div>
  );
}

