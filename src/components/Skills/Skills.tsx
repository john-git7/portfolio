"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppStore } from "@/store/appStore";

const skills = [
  {
    category: "Client-Side",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Three.js / WebGL", "GSAP / Framer Motion"],
  },
  {
    category: "Server-Side",
    items: ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs", "GraphQL"],
  },
  {
    category: "Infrastructure",
    items: ["Git / GitHub", "Docker", "Redis", "Vercel / AWS", "CI/CD Pipelines", "Jest / Cypress"],
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isEngaged } = useAppStore();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      if (isEngaged) {
        // Immersive staggered reveal
        gsap.fromTo(
          ".skill-col",
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      } else {
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
    <section ref={sectionRef} id="skills" className="editorial-section py-24">
      <div className="editorial-container">
        <div className="mb-16 border-b border-primary-text/20 pb-8 flex justify-between items-end">
          <div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-primary-text/40 block mb-2">02 // Stack</span>
            <h2 className="text-3xl md:text-5xl font-mono uppercase tracking-tighter text-primary-text">
              Patch Panel
            </h2>
          </div>
          <span className="font-mono text-[10px] tracking-widest text-primary-text/30 hidden md:block">
            I/O ROUTING
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {skills.map((category, catIndex) => (
            <div key={category.category} className="skill-col group">
              <div className="flex items-center justify-between mb-8 border-b border-primary-text/10 pb-4">
                <h3 className="font-mono text-sm tracking-widest uppercase text-primary-text/60">
                  [{category.category}]
                </h3>
                <span className="font-mono text-[9px] text-primary-text/30">CH.0{catIndex + 1}</span>
              </div>
              
              <ul className="space-y-4">
                {category.items.map((skill) => (
                  <li 
                    key={skill} 
                    className={`font-mono text-base text-primary-text/80 transition-all duration-300 ${isEngaged ? 'hover:text-accent hover:pl-2 cursor-none' : ''}`}
                  >
                    {skill}
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
