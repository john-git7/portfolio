"use client";

import { useRef } from "react";

/**
 * ABOUT SECTION
 *
 * Two-column: ghost index left, bio right.
 * Now driven by MasterTimeline for scroll animations.
 */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section about-section desktop-exhibit"
      aria-label="About"
    >
      <div className="container-editorial">
        <p
          className="label"
          style={{ marginBottom: "clamp(3rem, 6vh, 5rem)" }}
        >
          About
        </p>

        <div className="about-grid">
          <span
            className="about-index"
            aria-hidden="true"
            style={{ lineHeight: "0.88" }}
          >
            01
          </span>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}
          >
            <p className="about-text">
              <strong>Full-stack developer</strong> focused on building AI-powered
              products with engineering precision and thoughtful UX.
            </p>
            <p className="about-text">
              Currently studying Computer Science at{" "}
              <strong>Kalvium / Kalasalingam University</strong>.
              Previously interned at Zippy Digital Solutions,
              and led an n8n Automation Workshop.
            </p>
            <p className="about-text">
              Finalist at the IIT Palakkad Hackathon. Drawn to problems
              where <strong>craft and velocity</strong> both matter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
