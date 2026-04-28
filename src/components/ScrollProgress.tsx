"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * A thin golden progress bar at the top of the viewport showing scroll position.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!barRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(barRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={barRef}
      className="scroll-progress"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
