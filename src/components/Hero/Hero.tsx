"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * HERO SECTION
 *
 * Layout: Editorial left-aligned, full viewport.
 * Content:
 *   - Small mono index label
 *   - Large name (148px Syne)
 *   - Gold role label
 *   - One statement sentence
 *   - Animated scroll indicator
 *
 * Entry: Staggered line-by-line reveal (total ~0.9s)
 * No button needed — scroll indicator is the CTA.
 */
export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".hero-line",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, stagger: 0.14 }
      )
        .fromTo(
          ".hero-scroll-indicator",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.3"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="section"
      style={{ minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: "120px" }}
    >
      <div className="container-editorial">
        <div style={{ maxWidth: "900px" }}>
          {/* Index label */}
          <p className="hero-line label" style={{ marginBottom: "clamp(1.5rem, 3vh, 2.5rem)" }}>
            Portfolio — 2026
          </p>

          {/* Name */}
          <h1 className="hero-name hero-line" style={{ marginBottom: "clamp(1.2rem, 2.5vh, 2rem)" }}>
            John<br />Ebenezer
          </h1>

          {/* Role */}
          <p className="hero-role hero-line" style={{ marginBottom: "clamp(2rem, 4vh, 3.5rem)" }}>
            Full-Stack Developer
          </p>

          {/* Statement */}
          <p className="hero-statement hero-line">
            Building AI-powered products where engineering precision
            and developer craft meet — RAG pipelines, real-time systems,
            and interfaces that feel inevitable.
          </p>
        </div>
      </div>

      {/* Scroll indicator — bottom center */}
      <div
        className="hero-scroll-indicator scroll-indicator"
        style={{
          position: "absolute",
          bottom: "clamp(2rem, 5vh, 3.5rem)",
          left: "50%",
          transform: "translateX(-50%)",
        }}
        aria-hidden="true"
      >
        <span className="scroll-indicator-label">Scroll</span>
        <div
          className="scroll-indicator-line animate-scroll-line"
        />
      </div>
    </section>
  );
}
