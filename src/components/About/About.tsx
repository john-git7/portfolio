"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * ABOUT SECTION
 *
 * Two-column: ghost index left, bio right.
 * Minimal. Authentic. Readable.
 * Three short statements — no long paragraphs.
 */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-reveal",
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section"
      aria-label="About John Ebenezer"
    >
      <div className="container-editorial">
        {/* Section label */}
        <p className="about-reveal label" style={{ marginBottom: "clamp(3rem, 6vh, 5rem)" }}>
          About
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "clamp(2rem, 6vw, 8rem)",
            alignItems: "start",
          }}
        >
          {/* Ghost index */}
          <span
            className="about-index about-reveal"
            aria-hidden="true"
            style={{ lineHeight: "0.88" }}
          >
            01
          </span>

          {/* Bio */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
            <p className="about-text about-reveal">
              <strong>Full-stack developer</strong> focused on building AI-powered
              products with engineering precision and thoughtful UX.
            </p>
            <p className="about-text about-reveal">
              Currently studying Computer Science at{" "}
              <strong>Kalvium / Kalasalingam University</strong>.
              Previously interned at Zippy Digital Solutions,
              and led an n8n Automation Workshop.
            </p>
            <p className="about-text about-reveal">
              Finalist at the IIT Palakkad Hackathon. Drawn to problems
              where <strong>craft and velocity</strong> both matter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
