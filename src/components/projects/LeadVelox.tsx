"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LeadVelox() {
  const containerRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
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

    // Scroll-driven automation workflow drawing
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svgRef.current,
        start: "top 75%",
      }
    });

    // Draw main workflow line
    tl.fromTo(".lv-path-main", 
      { strokeDasharray: 1000, strokeDashoffset: 1000 },
      { strokeDashoffset: 0, duration: 2, ease: "none" }
    );

    // Branching paths
    tl.fromTo(".lv-path-branch", 
      { strokeDasharray: 500, strokeDashoffset: 500 },
      { strokeDashoffset: 0, duration: 1.5, stagger: 0.5, ease: "none" },
      "-=1"
    );

    // Nodes appearing (timers, status changes)
    tl.fromTo(".lv-node",
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, stagger: 0.3, ease: "back.out(1.7)" },
      "-=1.5"
    );
    
    // Status color change to demonstrate progression
    tl.to(".lv-node-status", 
      { fill: "var(--color-proj-leadvelox)", duration: 0.5, stagger: 0.5 },
      "-=1"
    );

  }, { scope: containerRef });

  const stack = ["Next.js", "Supabase", "PostgreSQL", "Docker", "n8n"];

  return (
    <section ref={containerRef} className="w-full py-24 px-8 md:px-16 lg:px-24 relative z-10 bg-bg-base border-t border-hairline" id="leadvelox">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-16 md:gap-24 items-start">
        
        <div className="w-full md:w-1/2 flex flex-col justify-start">
          <p className="font-mono text-mono text-text-secondary uppercase tracking-widest mb-4">
            01 — Automation
          </p>
          
          <h2 className="hero-title text-text-primary mb-6 uppercase">
            LeadVelox
          </h2>
          
          <p className="font-sans text-body text-text-secondary mb-8">
            Real-Time Lead Response Monitoring Platform
          </p>
          
          <div className="flex flex-wrap gap-4 font-mono text-caption text-text-primary opacity-80 mb-8">
            {stack.map((tech) => (
              <span key={tech} className="border border-hairline px-3 py-1 rounded-sm">{tech}</span>
            ))}
          </div>

          <div className="flex gap-6 mb-12 font-mono text-caption uppercase tracking-wider text-text-secondary">
            <a href="https://github.com/john-git7/Leadvelox" target="_blank" rel="noopener noreferrer" className="link-arrow hover:text-text-primary">
              <span>GitHub</span>
              <span className="arrow-line"></span><span className="arrow-head">↗</span>
            </a>
            <a href="https://leadvelox.xyz" target="_blank" rel="noopener noreferrer" className="link-arrow hover:text-text-primary">
              <span>Live Site</span>
              <span className="arrow-line"></span><span className="arrow-head">↗</span>
            </a>
          </div>
          
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-text-primary font-mono uppercase text-caption tracking-wider mb-2">Problem</h3>
              <p className="font-sans text-body text-text-secondary leading-relaxed">
                Sales teams lose leads when response-time SLAs aren't tracked or enforced in real time.
              </p>
            </div>
            <div>
              <h3 className="text-text-primary font-mono uppercase text-caption tracking-wider mb-2">Approach</h3>
              <p className="font-sans text-body text-text-secondary leading-relaxed">
                Built a SaaS platform with authentication, role-based access control, webhook automation, and Slack notifications to monitor lead response SLAs.
              </p>
            </div>
            <div>
              <h3 className="text-text-primary font-mono uppercase text-caption tracking-wider mb-2">Result</h3>
              <p className="font-sans text-body text-text-secondary leading-relaxed">
                Deployed on Vercel with validated webhook processing, duplicate detection, and workflow reliability testing.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 relative h-[400px] border border-hairline rounded-md bg-bg-surface/50 backdrop-blur-sm flex items-center justify-center overflow-hidden p-8">
          <svg ref={svgRef} viewBox="0 0 800 600" className="w-full h-full stroke-[var(--color-text-secondary)] fill-none stroke-2">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Main workflow path */}
            <path className="lv-path-main opacity-50" d="M 100 300 L 300 300 L 300 150 L 500 150" />
            <path className="lv-path-main opacity-50" d="M 300 300 L 300 450 L 500 450" />
            <path className="lv-path-main opacity-50" d="M 500 150 L 700 150" />
            <path className="lv-path-main opacity-50" d="M 500 450 L 700 450" />
            
            {/* Branching paths */}
            <path className="lv-path-branch" stroke="var(--color-proj-leadvelox)" strokeDasharray="5,5" d="M 500 150 L 500 300 L 700 300" />
            
            {/* Nodes */}
            <circle className="lv-node lv-node-status" cx="100" cy="300" r="8" fill="var(--color-bg-base)" stroke="currentColor" />
            <text x="100" y="325" fill="currentColor" fontSize="12" fontFamily="monospace" textAnchor="middle" className="opacity-70">Incoming Lead</text>

            <circle className="lv-node" cx="300" cy="300" r="12" fill="var(--color-bg-base)" stroke="currentColor" />
            <text x="320" y="295" fill="currentColor" fontSize="12" fontFamily="monospace" className="opacity-70">Webhook Fires</text>

            <rect className="lv-node lv-node-status" x="480" y="130" width="40" height="40" rx="4" fill="var(--color-bg-base)" stroke="currentColor" />
            <text x="500" y="115" fill="currentColor" fontSize="12" fontFamily="monospace" textAnchor="middle" className="opacity-70">SLA Timer Starts</text>

            <rect className="lv-node" x="480" y="430" width="40" height="40" rx="4" fill="var(--color-bg-base)" stroke="currentColor" />
            <text x="500" y="490" fill="currentColor" fontSize="12" fontFamily="monospace" textAnchor="middle" className="opacity-70">Response Logged</text>

            <circle className="lv-node lv-node-status" cx="700" cy="150" r="8" fill="var(--color-bg-base)" stroke="currentColor" />
            <text x="715" y="154" fill="currentColor" fontSize="12" fontFamily="monospace" className="opacity-70">Slack Alert</text>

            <circle className="lv-node lv-node-status" cx="700" cy="300" r="8" fill="var(--color-bg-base)" stroke="currentColor" />
            <text x="715" y="304" fill="currentColor" fontSize="12" fontFamily="monospace" className="opacity-70">SLA Missed</text>

            <circle className="lv-node lv-node-status" cx="700" cy="450" r="8" fill="var(--color-bg-base)" stroke="currentColor" />
            <text x="715" y="454" fill="currentColor" fontSize="12" fontFamily="monospace" className="opacity-70">Success</text>
            
            {/* Data packets (abstract leads flowing) */}
            <circle cx="0" cy="0" r="4" fill="var(--color-proj-leadvelox)" className="lv-packet opacity-0">
               {/* Animation handled by GSAP, this is just visual placeholder */}
            </circle>
          </svg>
        </div>
        
      </div>
    </section>
  );
}
