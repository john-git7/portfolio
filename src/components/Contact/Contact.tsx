"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppStore } from "@/store/appStore";

const socialLinks = [
  { name: "GitHub", url: "https://github.com/john-git7", icon: "↗" },
  { name: "LinkedIn", url: "https://linkedin.com/in/john-ebenezer", icon: "↗" },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isEngaged } = useAppStore();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      if (isEngaged) {
        gsap.fromTo(
          ".contact-header",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 65%" } }
        );
        gsap.fromTo(
          ".contact-link",
          { opacity: 0, scale: 0.9, filter: "blur(10px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.5, ease: "expo.out", delay: 0.2, scrollTrigger: { trigger: sectionRef.current, start: "top 65%" } }
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
            scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isEngaged]);

  return (
    <section ref={sectionRef} id="contact" className="editorial-section py-32 min-h-[70vh] flex flex-col justify-center">
      <div className="editorial-container w-full">
        <div className="flex flex-col items-center text-center">
          <span className="font-mono text-[10px] tracking-widest uppercase text-primary-text/40 block mb-12">
            03 // Master Out
          </span>
          
          <h2 className="contact-header text-4xl md:text-7xl font-mono uppercase tracking-tighter text-primary-text mb-16">
            Open a line.
          </h2>

          <a 
            href="mailto:contact@johnebenezer.dev"
            className={`contact-link group relative inline-block text-2xl md:text-5xl font-mono tracking-tight text-accent transition-all duration-500 mb-20 ${isEngaged ? 'cursor-none hover:scale-105 hover:tracking-widest' : 'hover:opacity-80'}`}
          >
            contact@johnebenezer.dev
            <div className={`absolute -bottom-4 left-0 h-[2px] bg-accent transition-all duration-500 ease-out ${isEngaged ? 'w-0 group-hover:w-full' : 'w-full opacity-30 group-hover:opacity-100'}`} />
          </a>

          <div className="flex items-center justify-center gap-8 mt-12 border-t border-primary-text/10 pt-12 w-full max-w-2xl">
            {socialLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`font-mono text-xs tracking-widest uppercase text-primary-text/50 flex items-center gap-2 transition-colors duration-300 ${isEngaged ? 'cursor-none hover:text-accent' : 'hover:text-primary-text'}`}
              >
                [{link.name}] <span className="opacity-50">{link.icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
