"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const socialLinks = [
  { name: "GitHub",   url: "https://github.com/john-git7" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/john-ebenezer-b99ba6316/" },
  { name: "LeetCode", url: "https://leetcode.com/u/Johnze/" },
];

/**
 * CONTACT SECTION
 *
 * Centered. Minimal. One clear CTA.
 * Large headline → email → social links.
 * Nothing competing for attention.
 */
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 68%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        ".contact-label",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 }
      )
        .fromTo(
          ".contact-headline",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.1 },
          "-=0.4"
        )
        .fromTo(
          ".contact-email",
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 1.0 },
          "-=0.5"
        )
        .fromTo(
          ".contact-social-link",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
          "-=0.4"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section"
      aria-label="Contact"
      style={{ textAlign: "center" }}
    >
      <div className="container-editorial">
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
    </section>
  );
}
