"use client";

import { useRef } from "react";

import Footer from "../Footer";

const socialLinks = [
  { name: "GitHub",   url: "https://github.com/john-git7" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/john-ebenezer-b99ba6316/" },
  { name: "LeetCode", url: "https://leetcode.com/u/Johnze/" },
];

/**
 * CONTACT SECTION
 *
 * Driven by MasterTimeline. Positioned absolutely to act as an exhibit in the journey.
 */
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section contact-section desktop-exhibit"
      aria-label="Contact"
    >
      <div className="container-editorial" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "clamp(2rem, 4vh, 3.5rem)",
          }}
        >
          {/* Label */}
          <p className="contact-label label">
            Get in touch
          </p>

          {/* Headline */}
          <h2 className="contact-headline">
            Let&apos;s build<br />something.
          </h2>

          {/* Email CTA */}
          <a
            href="mailto:johnebenezerxa@gmail.com"
            className="contact-email"
            data-cursor="link"
            style={{ display: "inline-block" }}
          >
            johnebenezerxa@gmail.com
          </a>

          {/* Divider */}
          <div
            style={{
              width: "1px",
              height: "40px",
              background: "var(--border-strong)",
            }}
            aria-hidden="true"
          />

          {/* Social links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(2rem, 5vw, 4rem)",
            }}
          >
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-link"
                data-cursor="link"
              >
                {link.name} <span>↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="contact-footer" style={{ width: "100%", position: "absolute", bottom: 0, left: 0 }}>
        <Footer />
      </div>
    </section>
  );
}
