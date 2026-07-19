"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const projects = [
  {
    title: "DevGrasp",
    description:
      "AI-powered GitHub code intelligence platform. Query any repository using natural language through a RAG pipeline with local transformer-based embeddings and real-time streaming.",
    tags: ["React.js", "Node.js", "MongoDB", "RAG", "Gemini API"],
    year: "2026",
    url: "#",
    github: "https://github.com/john-git7",
  },
];

/**
 * WORK SECTION
 *
 * Full-width editorial list layout.
 * Each project: ghost number | title + description + tags | year + CTA
 * Hover: number turns gold, subtle warm overlay traces across.
 */
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        ".work-header",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      // Each row reveals
      gsap.fromTo(
        ".work-row",
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".work-rows",
            start: "top 72%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" ref={sectionRef} className="section" aria-label="Selected work">
      <div className="container-editorial">
        {/* Header */}
        <div
          className="work-header"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingBottom: "clamp(1.5rem, 3vh, 2.5rem)",
            borderBottom: "1px solid var(--border-strong)",
            marginBottom: "0",
          }}
        >
          <div>
            <p className="label" style={{ marginBottom: "12px" }}>Selected Work</p>
            <h2 className="h-section">Projects</h2>
          </div>
          <span className="label" style={{ paddingBottom: "6px" }}>
            {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        {/* Project rows */}
        <div className="work-rows">
          {projects.map((project, i) => (
            <div key={project.title} className="work-row">
              {/* Ghost number */}
              <span className="work-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Main content */}
              <div>
                <h3 className="work-title">{project.title}</h3>
                <p className="work-desc">{project.description}</p>
                <div className="work-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="work-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Year + CTA */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "1rem",
                }}
              >
                <span
                  className="label"
                  style={{ color: "var(--text-dim)" }}
                >
                  {project.year}
                </span>

                {project.url && project.url !== "#" && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="work-cta"
                    data-cursor="link"
                  >
                    View Project <span>→</span>
                  </a>
                )}
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="work-cta"
                  data-cursor="link"
                >
                  GitHub <span>↗</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
