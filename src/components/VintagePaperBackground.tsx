"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function VintagePaperBackground() {
  const wrinkleRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrinkleRef.current || !grainRef.current) return;

    const ctx = gsap.context(() => {
      // --- WRINKLE ANIMATION LAYER ---

      // 1. Organic Breathing Motion
      // Extremely slow and smooth background scale
      gsap.to(wrinkleRef.current, {
        scale: 1.01,
        duration: 8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "center center",
      });

      // 2. Stop-motion jitter for wrinkles
      // Small 1px shifts, step-based easing for handcrafted feel
      const tlx = gsap.timeline({ repeat: -1, yoyo: true });
      tlx.to(wrinkleRef.current, {
        x: 1,
        duration: 2,
        ease: "steps(8)",
      }).to(wrinkleRef.current, {
        x: -1,
        duration: 2,
        ease: "steps(8)",
      });

      const tly = gsap.timeline({ repeat: -1, yoyo: true });
      tly.to(wrinkleRef.current, {
        y: 1,
        duration: 2.5,
        ease: "steps(10)",
      }).to(wrinkleRef.current, {
        y: -1,
        duration: 2.5,
        ease: "steps(10)",
      });

      // --- GRAIN ANIMATION LAYER ---
      
      // 3. Subtle grain flicker
      // Slight opacity shifts, step-based, very low visibility
      // Base opacity is 0.03 via CSS, we animate between 0.02 and 0.04
      gsap.fromTo(grainRef.current, 
        { opacity: 0.02 }, 
        {
          opacity: 0.04,
          duration: 1.2,
          ease: "steps(4)",
          repeat: -1,
          yoyo: true,
        }
      );

      // Stop-motion grain position jitter (very subtle 1px shifts)
      const grainTl = gsap.timeline({ repeat: -1 });
      grainTl
        .set(grainRef.current, { x: 0, y: 0 })
        .to(grainRef.current, { x: 1, y: -1, duration: 0.3, ease: "steps(1)" })
        .to(grainRef.current, { x: -1, y: 1, duration: 0.3, ease: "steps(1)" })
        .to(grainRef.current, { x: 1, y: 1, duration: 0.3, ease: "steps(1)" })
        .to(grainRef.current, { x: -1, y: -1, duration: 0.3, ease: "steps(1)" });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="vintage-paper-container">
      {/* Layer 1: Base paper tone */}
      <div className="vintage-paper-base" />
      
      {/* Layer 2: Wrinkle simulation (Animated) */}
      <div ref={wrinkleRef} className="vintage-paper-wrinkles" />
      
      {/* Layer 3: Grain layer (Animated opacity) */}
      <div ref={grainRef} className="vintage-paper-grain" />

      {/* Layer 4: Lighting layer */}
      <div className="vintage-paper-lighting" />
    </div>
  );
}
