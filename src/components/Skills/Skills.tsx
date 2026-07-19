"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stack = [
  {
    category: "Core Languages",
    items: ["Python", "JavaScript / TypeScript", "C++"],
  },
  {
    category: "Frontend & Frameworks",
    items: ["React.js", "Next.js", "Tailwind CSS", "Three.js"],
  },
  {
    category: "Backend & Infrastructure",
    items: ["Node.js & Express", "MongoDB & Supabase", "Electron.js"],
  },
  {
    category: "AI & Automation",
    items: [
      "RAG & Vector Search",
      "Gemini API & Transformers",
      "n8n Automation",
      "LangChain",
    ],
  },
  {
    category: "Experience",
    items: [
      "Web Dev Intern · Zippy Digital Solutions",
      "Finalist · IIT Palakkad Hackathon",
      "Lead · n8n Automation Workshop",
    ],
  },
];

/**
 * STACK SECTION
 *
 * Five columns of plain text — no cards, no progress bars.
 * Category labels in gold mono, items in light Inter.
 * Item separation by thin rules.
 * Staggered column reveal on scroll.
 */
export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stack-col",
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="stack" ref={sectionRef} className="section" aria-label="Technology stack">
      <div className="container-editorial">
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingBottom: "clamp(1.5rem, 3vh, 2.5rem)",
            borderBottom: "1px solid var(--border-strong)",
            marginBottom: "clamp(3rem, 6vh, 5rem)",
          }}
        >
          <div>
            <p className="label" style={{ marginBottom: "12px" }}>Capabilities</p>
            <h2 className="h-section">Stack</h2>
          </div>
        </div>

        {/* Columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "clamp(2.5rem, 5vw, 4rem)",
          }}
        >
          {stack.map((col) => (
            <div key={col.category} className="stack-col">
              <p className="stack-category">{col.category}</p>
              <ul style={{ listStyle: "none" }}>
                {col.items.map((item) => (
                  <li key={item} className="stack-item">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
