"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppStore } from "@/store/appStore";

const projects = [
  {
    title: "Tunify",
    description: "Audio engine architecture. Built a complex Web Audio API routing system with offline caching strategies and sub-10ms latency playback.",
    tags: ["React", "Web Audio API", "IndexedDB", "Node.js"],
    year: "2025",
  },
  {
    title: "AgriConnect",
    description: "Real-time marketplace architecture. Engineered a MongoDB transaction layer to handle concurrent agricultural inventory updates without race conditions.",
    tags: ["Next.js", "MongoDB", "Redis", "Stripe API"],
    year: "2025",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isEngaged } = useAppStore();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      if (isEngaged) {
        // Immersive cinematic scroll animations for Engage mode
        gsap.fromTo(
          ".project-row",
          { opacity: 0, x: -40, skewX: 5 },
          {
            opacity: 1,
            x: 0,
            skewX: 0,
            duration: 1.2,
            stagger: 0.3,
            ease: "power4.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              toggleActions: "play none none reverse",
            },
          }
        );
      } else {
        // Fast, static-friendly reveal for Bypass mode
        gsap.fromTo(
          sectionRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isEngaged]);

  return (
    <section ref={sectionRef} id="projects" className="editorial-section py-24">
      <div className="editorial-container">
        <div className="mb-16 border-b border-primary-text/20 pb-8 flex justify-between items-end">
          <div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-primary-text/40 block mb-2">[ ARCHIVE : ACTIVE ]</span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-mono uppercase tracking-tighter text-primary-text leading-tight">
              Signal Path.<br />
              <span className="text-primary-text/50">Core systems.</span>
            </h2>
          </div>
          <span className="font-mono text-[10px] tracking-widest text-primary-text/30 hidden md:block">
            I/O
          </span>
        </div>

        <div className="flex flex-col gap-0 border-t border-primary-text/10">
          {projects.map((project, index) => (
            <div 
              key={project.title} 
              className={`project-row group flex flex-col md:flex-row gap-6 md:gap-12 py-10 md:py-16 border-b border-primary-text/10 transition-colors duration-500 hover:bg-primary-text/[0.02] ${isEngaged ? 'cursor-none hover:pl-4' : ''}`}
              style={{ transitionProperty: 'background-color, padding-left' }}
            >
              <div className="md:w-1/4 shrink-0 flex flex-col justify-between">
                <span className="font-mono text-2xl md:text-4xl text-primary-text/20 group-hover:text-accent transition-colors duration-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] tracking-widest text-primary-text/40 mt-4 md:mt-0">
                  {project.year}
                </span>
              </div>
              
              <div className="md:w-3/4 flex flex-col justify-between">
                <div>
                  <h3 className="font-mono text-lg sm:text-xl md:text-2xl uppercase tracking-wider text-primary-text mb-4 group-hover:text-accent transition-colors duration-500">
                    {project.title}
                  </h3>
                  <p className="text-primary-text/70 text-base leading-relaxed max-w-2xl font-light">
                    {project.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-primary-text/5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[9px] tracking-widest uppercase text-primary-text/50">
                      [{tag}]
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
