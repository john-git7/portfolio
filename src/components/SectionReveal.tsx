"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface SectionRevealProps {
  children: ReactNode;
  id: string;
  className?: string;
  label?: string;
  number?: string;
  showDivider?: boolean;
}

/**
 * A reusable section wrapper that adds:
 * - Scroll-triggered entrance animation
 * - Semi-transparent glassmorphic backdrop for readability over 3D
 * - Section number/label badge
 * - Horizontal divider between sections
 */
export default function SectionReveal({
  children,
  id,
  className = "",
  label,
  number,
  showDivider = true,
}: SectionRevealProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      // Fade in the entire section content
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`section-container ${className}`}
    >
      {/* Top divider */}
      {showDivider && <div className="section-divider absolute top-0 left-0" />}

      {/* Section label badge */}
      {(label || number) && (
        <div className="absolute top-8 left-6 md:left-12 lg:left-24 flex items-center gap-3 z-20">
          {number && (
            <span className="font-mono text-[10px] tracking-[0.3em] text-accent/50">
              {number}
            </span>
          )}
          {label && (
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-primary-text/30">
              {label}
            </span>
          )}
        </div>
      )}

      {/* Content wrapper with glass backdrop */}
      <div ref={contentRef} className="section-inner relative z-10">
        {children}
      </div>
    </section>
  );
}
