"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Custom cursor — two layer system:
 *   - cursor-dot   : 6px solid dot, snaps immediately to mouse
 *   - cursor-ring  : 36px ring, follows with GSAP lag (cinematic weight)
 *
 * On hover (links, buttons):
 *   - Ring expands to 56px
 *   - Gold tint appears
 *
 * Hidden on mobile (pointer: coarse).
 * Always active — no mode gates.
 */
export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only show on fine-pointer devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // GSAP quickSetter for performance
    const setDotX  = gsap.quickSetter(dot,  "x", "px");
    const setDotY  = gsap.quickSetter(dot,  "y", "px");

    // Ring follows with lerp in the ticker
    const pos = { x: -100, y: -100 };
    const current = { x: -100, y: -100 };

    const onMouseMove = (e: MouseEvent) => {
      // Dot snaps instantly
      setDotX(e.clientX);
      setDotY(e.clientY);

      // Ring target
      pos.x = e.clientX;
      pos.y = e.clientY;
    };

    // Smooth ring follow
    const ticker = gsap.ticker.add(() => {
      if (!ring) return;
      const lerpFactor = 0.12;
      current.x += (pos.x - current.x) * lerpFactor;
      current.y += (pos.y - current.y) * lerpFactor;
      ring.style.transform = `translate(calc(${current.x}px - 50%), calc(${current.y}px - 50%))`;
    });

    // Hover state detection
    const onPointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor='link']");

      if (isInteractive) {
        ring?.classList.add("is-link");
        ring?.classList.remove("is-hovering");
      } else {
        ring?.classList.remove("is-link");
      }
    };

    const onPointerOut = () => {
      ring?.classList.remove("is-link", "is-hovering");
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("pointerover", onPointerOver);
    window.addEventListener("pointerout", onPointerOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerout", onPointerOut);
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
