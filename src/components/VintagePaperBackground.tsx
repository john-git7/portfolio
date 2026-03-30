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
      // Extremely slow and smooth to avoid distraction
      gsap.to(wrinkleRef.current, {
        scale: 1.01,
        duration: 8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "center center",
      });

      // 2. Handcrafted Cartoon Boil
      // Slower framerate (~3-4 fps) with slight shifts to feel like hand-drawn frames
      const tlx = gsap.timeline({ repeat: -1, yoyo: true });
      tlx.to(wrinkleRef.current, {
        x: 2,
        duration: 1.2,
        ease: "steps(4)",
      }).to(wrinkleRef.current, {
        x: -2,
        duration: 1.2,
        ease: "steps(4)",
      });

      const tly = gsap.timeline({ repeat: -1, yoyo: true });
      tly.to(wrinkleRef.current, {
        y: 2,
        duration: 1.4,
        ease: "steps(4)",
      }).to(wrinkleRef.current, {
        y: -2,
        duration: 1.4,
        ease: "steps(4)",
      });

      // --- GRAIN ANIMATION LAYER ---
      
      // 3. Cartoon Stop-Motion Grain
      // We remove the high-frequency opacity blinking that causes the "malfunction" feel.
      // Instead, we lock opacity and step through 4 distinct positions every 0.25s (4fps).
      gsap.set(grainRef.current, { opacity: 0.4 });

      const grainTl = gsap.timeline({ repeat: -1 });
      grainTl
        .set(grainRef.current, { x: 0, y: 0 })
        .to(grainRef.current, { x: 5, y: -5, duration: 0.25, ease: "steps(1)" })
        .to(grainRef.current, { x: -5, y: 5, duration: 0.25, ease: "steps(1)" })
        .to(grainRef.current, { x: 5, y: 5, duration: 0.25, ease: "steps(1)" })
        .to(grainRef.current, { x: -5, y: -5, duration: 0.25, ease: "steps(1)" });
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
