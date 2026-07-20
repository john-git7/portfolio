"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * HERO SECTION
 *
 * Layout: Editorial left-aligned, full viewport.
 * Now driven by MasterTimeline for scroll animations.
 */
export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  // ─ Entry animation (Initial load)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".hero-line",
        { y: 48, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.05, stagger: 0.15 }
      ).fromTo(
        ".hero-divider",
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 1.2, transformOrigin: "left center" },
        "-=0.6"
      ).fromTo(
        ".hero-scroll-indicator",
        { opacity: 0, y: 14 },
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
      className="section hero-section desktop-exhibit"
      style={{
        // Inline styles removed since desktop-exhibit handles desktop positioning
        // and mobile inherits relative flow from globals.css
      }}
    >
      <div className="container-editorial">
        <div style={{ maxWidth: "900px" }}>
          <p
            className="hero-line label"
            style={{ marginBottom: "clamp(1.5rem, 3vh, 2.5rem)" }}
          >
            Portfolio — 2026
          </p>

          <h1
            className="hero-name hero-line"
            style={{ marginBottom: "clamp(1.2rem, 2.5vh, 2rem)" }}
          >
            John<br />Ebenezer
          </h1>

          <p
            className="hero-role hero-line"
            style={{ marginBottom: "clamp(2rem, 4vh, 3.5rem)" }}
          >
            Full-Stack Developer
          </p>

          <div
            className="hero-divider"
            style={{
              width: "100%",
              maxWidth: "180px",
              height: "1px",
              backgroundColor: "var(--accent)",
              marginBottom: "clamp(2rem, 4vh, 3.5rem)",
            }}
            aria-hidden="true"
          />

          <p className="hero-statement hero-line">
            Building AI-powered products where engineering precision
            and developer craft meet — RAG pipelines, real-time systems,
            and interfaces that feel inevitable.
          </p>
        </div>
      </div>

      <div
        className="hero-scroll-indicator scroll-indicator"
        aria-hidden="true"
      >
        <span className="scroll-indicator-label">Scroll</span>
        <div className="scroll-indicator-line animate-scroll-line" />
      </div>
    </section>
  );
}
