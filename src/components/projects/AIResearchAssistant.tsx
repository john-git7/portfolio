"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AIResearchAssistant() {
  const containerRef = useRef<HTMLDivElement>(null);
  const visualsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Standard fade-in instead of pinning
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

      // Very minimal parallax effect (no pinning)
      gsap.to(visualsRef.current, {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: containerRef }
  );

  const stack = ["React", "Tailwind", "FastAPI", "ChromaDB", "LangGraph", "Gemini 1.5 Flash"];

  return (
    <section ref={containerRef} className="w-full py-24 px-8 md:px-16 lg:px-24 relative z-10 bg-bg-base border-t border-hairline" id="airesearchassistant">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-16 md:gap-24 items-start">
        
        <div className="w-full md:w-1/2 flex flex-col justify-start">
          <p className="font-mono text-mono text-text-secondary uppercase tracking-widest mb-4">
            Document Intelligence
          </p>
          
          <h2 className="hero-title text-text-primary mb-6 uppercase">
            AI Research Assistant
          </h2>
          
          <p className="font-sans text-body text-text-secondary mb-8">
            Document RAG Tool
          </p>
          
          <div className="flex flex-wrap gap-4 font-mono text-caption text-text-primary opacity-80 mb-8">
            {stack.map((tech) => (
              <span key={tech} className="border border-hairline px-3 py-1 rounded-sm">{tech}</span>
            ))}
          </div>

          <div className="flex gap-6 mb-12 font-mono text-caption uppercase tracking-wider text-text-secondary">
            <a href="https://github.com/john-git7/AI_research_assistant" target="_blank" rel="noopener noreferrer" className="link-arrow hover:text-text-primary">
              <span>GitHub</span>
              <span className="arrow-line"></span><span className="arrow-head">↗</span>
            </a>
            <a href="https://ai-rasp.vercel.app" target="_blank" rel="noopener noreferrer" className="link-arrow hover:text-text-primary">
              <span>Live Site</span>
              <span className="arrow-line"></span><span className="arrow-head">↗</span>
            </a>
          </div>
          
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-text-primary font-mono uppercase text-caption tracking-wider mb-2">Problem</h3>
              <p className="font-sans text-body text-text-secondary leading-relaxed">
                Researchers and students need faster ways to extract answers, summaries, and study material from their own documents.
              </p>
            </div>
            <div>
              <h3 className="text-text-primary font-mono uppercase text-caption tracking-wider mb-2">Approach</h3>
              <p className="font-sans text-body text-text-secondary leading-relaxed">
                Built a RAG tool where users upload PDF/TXT documents and ask questions, generate summaries, or create quizzes — using ChromaDB for vector storage and LangGraph for multi-agent routing.
              </p>
            </div>
            <div>
              <h3 className="text-text-primary font-mono uppercase text-caption tracking-wider mb-2">Result</h3>
              <p className="font-sans text-body text-text-secondary leading-relaxed">
                Provides instant, citation-backed answers and automated study material strictly grounded in the user's own uploaded documents.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Visuals */}
        <div
          ref={visualsRef}
          className="w-full md:w-1/2 flex flex-col gap-8 items-center justify-center mt-12 md:mt-0"
        >
          {/* Main App Mockup / Visual */}
          <div className="w-full aspect-[4/3] border border-hairline p-8 flex flex-col items-center justify-center bg-bg-surface relative overflow-hidden group">
            {/* Abstract representation of Vector Embeddings / Document Nodes */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none"></div>
            
            <div className="flex flex-col gap-4 w-full max-w-sm z-10 relative">
              {/* Fake Document Chat UI */}
              <div className="w-full border border-hairline p-4 rounded-sm flex items-start gap-4">
                 <div className="w-8 h-8 rounded-full border border-hairline flex-shrink-0 flex items-center justify-center font-mono text-xs">U</div>
                 <div className="flex-1">
                   <div className="h-2 w-3/4 bg-white/20 rounded-full mb-2"></div>
                   <div className="h-2 w-1/2 bg-white/20 rounded-full"></div>
                 </div>
              </div>

              <div className="w-full border border-hairline bg-white text-black p-4 rounded-sm flex items-start gap-4 relative shadow-2xl translate-x-4">
                 <div className="w-8 h-8 rounded-full border border-black/20 flex-shrink-0 flex items-center justify-center font-mono text-xs bg-black text-white">AI</div>
                 <div className="flex-1">
                   <div className="h-2 w-full bg-black/20 rounded-full mb-2"></div>
                   <div className="h-2 w-5/6 bg-black/20 rounded-full mb-4"></div>
                   <div className="flex gap-2">
                     <span className="w-12 h-3 bg-black/20 rounded-sm"></span>
                     <span className="w-12 h-3 bg-black/20 rounded-sm"></span>
                   </div>
                 </div>
              </div>
            </div>
            
            <p className="absolute bottom-6 right-8 font-mono text-caption text-text-secondary">01. CITATION_AGENT</p>
          </div>

          <div className="w-full aspect-video border border-hairline p-8 flex items-center justify-center relative overflow-hidden group">
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs relative z-10">
              <div className="aspect-square border border-hairline flex flex-col items-center justify-center font-mono text-xs p-4 text-center hover:bg-white hover:text-black transition-colors gap-2">
                <div className="w-8 h-2 bg-white/20 rounded-full"></div>
                <div className="w-16 h-2 bg-white/20 rounded-full"></div>
              </div>
              <div className="aspect-square border border-white bg-white text-black flex flex-col items-center justify-center font-mono text-xs p-4 text-center gap-2">
                <div className="w-8 h-2 bg-black/20 rounded-full"></div>
                <div className="w-16 h-2 bg-black/20 rounded-full"></div>
              </div>
              <div className="aspect-square border border-hairline flex flex-col items-center justify-center font-mono text-xs p-4 text-center hover:bg-white hover:text-black transition-colors gap-2">
                <div className="w-8 h-2 bg-white/20 rounded-full"></div>
                <div className="w-16 h-2 bg-white/20 rounded-full"></div>
              </div>
              <div className="aspect-square border border-hairline flex flex-col items-center justify-center font-mono text-xs p-4 text-center hover:bg-white hover:text-black transition-colors gap-2">
                <div className="w-8 h-2 bg-white/20 rounded-full"></div>
                <div className="w-16 h-2 bg-white/20 rounded-full"></div>
              </div>
            </div>
            <p className="absolute bottom-6 right-8 font-mono text-caption text-text-secondary">02. QUIZ_AGENT</p>
          </div>

        </div>
        
      </div>
    </section>
  );
}
