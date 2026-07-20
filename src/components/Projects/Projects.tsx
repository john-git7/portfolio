"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

const projects = [
  {
    title: "DevGrasp",
    description:
      "AI-powered GitHub code intelligence platform. Query any repository using natural language through a RAG pipeline with local transformer-based embeddings and real-time streaming.",
    tags: ["React.js", "Node.js", "MongoDB", "RAG", "Gemini API"],
    year: "2026",
    url: "#",
    github: "https://github.com/john-git7",
    image: "/images/devgrasp.png",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (!imageRef.current) return;
    // We use matchMedia to ensure this effect only runs on desktop
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 769px)", () => {
      const xTo = gsap.quickTo(imageRef.current, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(imageRef.current, "y", { duration: 0.6, ease: "power3.out" });

      const handleMouseMove = (e: MouseEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };
      
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    });

    return () => mm.revert();
  }, []);

  const handleMouseEnter = (img: string | undefined) => {
    if (!img || window.innerWidth < 768) return;
    setActiveImage(img);
    gsap.to(imageRef.current, { autoAlpha: 1, scale: 1, rotation: gsap.utils.random(-3, 3), duration: 0.5, ease: "power3.out" });
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 768) return;
    gsap.to(imageRef.current, { autoAlpha: 0, scale: 0.95, rotation: 0, duration: 0.4, ease: "power3.in" });
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      className="section projects-section desktop-exhibit"
      aria-label="Selected work"
    >
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
            marginBottom: "3rem",
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

        {/* Project rows - Treated as exhibits */}
        <div className="work-rows" style={{ position: "relative", zIndex: 10 }}>
          {projects.map((project, i) => (
            <div 
              key={project.title} 
              className="work-row"
              onMouseEnter={() => handleMouseEnter(project.image)}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: "pointer" }}
            >
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
                className="work-cta-container"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "1rem",
                }}
              >
                <span className="label" style={{ color: "var(--text-dim)" }}>
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

      {/* Hover Reveal Image */}
      <div
        ref={imageRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "40vw",
          maxWidth: "500px",
          pointerEvents: "none",
          zIndex: 5,
          opacity: 0,
          visibility: "hidden",
          transform: "translate(-50%, -50%) scale(0.95)",
        }}
      >
        {activeImage && (
          <img 
            src={activeImage} 
            alt="Project Preview" 
            style={{ 
              width: "100%", 
              height: "auto",
              borderRadius: "16px", 
              boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "block" 
            }} 
          />
        )}
      </div>
    </section>
  );
}
