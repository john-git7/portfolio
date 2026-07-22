"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    // Minimal calm entry animation
    gsap.fromTo(
      ".hero-text-line",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, stagger: 0.15, ease: "power3.out", delay: 0.2 }
    );
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      className="w-full min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-32 pb-24 relative"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-6 md:gap-10">
          <p className="font-mono text-text-secondary text-mono hero-text-line overflow-hidden uppercase tracking-widest">
            Portfolio [ 2026 ]
          </p>
          
          <h1 ref={headlineRef} className="font-serif text-hero text-text-primary max-w-5xl">
            <span className="block hero-text-line overflow-hidden">
              <span className="block">Software engineering</span>
            </span>
            <span className="block hero-text-line overflow-hidden">
              <span className="block text-text-secondary italic">architectural precision.</span>
            </span>
          </h1>

          <div className="mt-12 md:mt-24 max-w-2xl font-sans text-body hero-text-line text-text-primary leading-relaxed">
            <p>
              I build complex systems with an emphasis on performance, 
              robust architecture, and uncompromising attention to detail. 
              Currently exploring intelligence augmentation and distributed systems.
            </p>
          </div>

          <div className="mt-16 hero-text-line">
            <a href="#projects" className="link-arrow text-accent font-mono uppercase text-caption tracking-wider">
              <span>Explore Work</span>
              <span className="arrow-line"></span><span className="arrow-head">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
