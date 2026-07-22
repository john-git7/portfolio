"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MermaidDiagram from "../ui/MermaidDiagram";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function DevGrasp() {
  const containerRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Standard fade-in/slide-up instead of pinning
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      }
    );

    // Animation sequence for DevGrasp (runs when scrolled into view)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: visualRef.current,
        start: "top 75%",
      }
    });

    // Step 1: Repository to Chunks
    tl.to(".dg-repo-file", {
      y: (i) => i * 40,
      opacity: 0.5,
      stagger: 0.1,
      duration: 1
    });

    tl.to(".dg-repo-file", {
      scaleY: 0.2,
      scaleX: 0.8,
      borderRadius: "4px",
      backgroundColor: "var(--color-proj-devgrasp)",
      duration: 1
    });

    // Step 2: Chunks to Embeddings (Abstract dots)
    tl.to(".dg-repo-file", {
      scale: 0.1,
      x: (i) => (i % 3) * 60 - 60,
      y: (i) => Math.floor(i / 3) * 60 - 60,
      borderRadius: "50%",
      duration: 1.5,
      ease: "power2.inOut"
    });

    // Step 3: Search line sweeping over embeddings
    tl.fromTo(".dg-search-line", 
      { scaleY: 0, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: 0.5 },
      "+=0.5"
    );

    tl.to(".dg-search-line", {
      x: 200,
      duration: 2,
      ease: "none"
    });

    // Highlight found embedding
    tl.to(".dg-repo-file:nth-child(4)", {
      scale: 0.3,
      boxShadow: "0 0 20px var(--color-proj-devgrasp)",
      duration: 0.5
    }, "-=1");

  }, { scope: containerRef });

  const stack = ["React", "Node.js", "Express.js", "MongoDB Atlas", "Gemini API", "@xenova/transformers", "Octokit", "JWT", "SSE", "Vector Search"];

  const diagram = `
graph LR
    classDef default fill:transparent,stroke:#fff,stroke-width:1px,color:#fff;
    A[GitHub Repo] --> B[Local Embed]
    B --> C[(Vector Store)]
    C --> D[Query Response]
  `;

  return (
    <section ref={containerRef} className="w-full py-24 px-8 md:px-16 lg:px-24 relative z-10 bg-bg-base border-t border-hairline" id="devgrasp">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-16 md:gap-24 items-start">
        
        <div className="w-full md:w-1/2 flex flex-col justify-start">
          <p className="font-mono text-mono text-text-secondary uppercase tracking-widest mb-4">
            Featured / Primary
          </p>
          
          <h2 className="hero-title text-text-primary mb-6 uppercase">
            DevGrasp
          </h2>
          
          <p className="font-sans text-body text-text-secondary mb-8">
            AI-Powered GitHub Repository Assistant
          </p>

          <div className="flex flex-wrap gap-4 font-mono text-caption text-text-primary opacity-80 mb-8">
            {stack.map((tech) => (
              <span key={tech} className="border border-hairline px-3 py-1 rounded-sm">{tech}</span>
            ))}
          </div>

          <div className="flex gap-6 mb-12 font-mono text-caption uppercase tracking-wider text-text-secondary">
            <a href="https://github.com/john-git7/DevGrasp" target="_blank" rel="noopener noreferrer" className="link-arrow hover:text-text-primary">
              <span>GitHub</span>
              <span className="arrow-line"></span><span className="arrow-head">↗</span>
            </a>
            <a href="https://devgrasp.vercel.app" target="_blank" rel="noopener noreferrer" className="link-arrow hover:text-text-primary">
              <span>Live Site</span>
              <span className="arrow-line"></span><span className="arrow-head">↗</span>
            </a>
          </div>
          
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-text-primary font-mono uppercase text-caption tracking-wider mb-2">Problem</h3>
              <p className="font-sans text-body text-text-secondary leading-relaxed">
                Understanding unfamiliar codebases requires slow manual navigation instead of natural-language search.
              </p>
            </div>
            <div>
              <h3 className="text-text-primary font-mono uppercase text-caption tracking-wider mb-2">Approach</h3>
              <p className="font-sans text-body text-text-secondary leading-relaxed">
                Built a RAG pipeline with 1,000-character semantic chunking, 768-dimensional vector embeddings, JWT-based multi-user workspaces, and real-time AI streaming via SSE — plus five AI-powered engineering workflows for repo analysis (PR review, onboarding guides, code explanations).
              </p>
            </div>
            <div>
              <h3 className="text-text-primary font-mono uppercase text-caption tracking-wider mb-2">Result</h3>
              <p className="font-sans text-body text-text-secondary leading-relaxed">
                End-to-end system handling automated indexing, semantic retrieval, and resilient API rate-limit recovery.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-12">
          <div ref={visualRef} className="w-full relative h-[400px] border border-hairline rounded-md bg-bg-surface/50 backdrop-blur-sm flex items-center justify-center overflow-hidden p-8">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-20 mix-blend-multiply"></div>
            
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Repo Files / Chunks / Embeddings */}
              {Array.from({ length: 9 }).map((_, i) => (
                <div 
                  key={i} 
                  className="dg-repo-file absolute w-48 h-12 border border-hairline bg-bg-base text-text-secondary font-mono text-[10px] p-2 flex items-start justify-start overflow-hidden"
                  style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 - i }}
                >
                  src/components/module_{i}.ts<br/>
                  export const process = () =&gt; ...
                </div>
              ))}

              {/* Search Line */}
              <div className="dg-search-line absolute left-[20%] top-1/4 bottom-1/4 w-[2px] bg-accent z-20 origin-top" style={{ backgroundColor: "var(--color-proj-devgrasp)" }}></div>
            </div>
          </div>

          <div className="w-full p-8 border border-hairline bg-bg-surface flex items-center justify-center">
             <MermaidDiagram chart={diagram} />
          </div>
        </div>
        
      </div>
    </section>
  );
}
