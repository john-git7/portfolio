"use client";

import { useEffect, useState } from "react";
import { useLenis } from 'lenis/react';
import { useAppStore } from '@/store/appStore';

const navItems = [
  { id: "hero", label: "Home", short: "Home" },
  { id: "projects", label: "Signal Path", short: "Signal" },
  { id: "skills", label: "Patch Panel", short: "Patch" },
  { id: "contact", label: "Master Out", short: "Out" },
];

export default function Navbar() {
  const lenis = useLenis();
  const [activeSegment, setActiveSegment] = useState("hero");
  const { isEngaged, toggleEngage } = useAppStore();

  const scrollToSection = (id: string) => {
    if (id === "hero") {
      if (lenis) {
        lenis.scrollTo(0, { duration: 2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const element = document.getElementById(id);
    if (!element) return;

    if (lenis) {
      lenis.scrollTo(element, { duration: 2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), offset: -40 });
    } else {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Determine active section based on which section is most visible
      const sections = ["hero", "projects", "skills", "contact"];

      for (let i = sections.length - 1; i >= 0; i--) {
        const id = sections[i];
        if (id === "hero") {
          if (scrollY < windowHeight * 0.5) {
            setActiveSegment("hero");
            break;
          }
          continue;
        }
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= windowHeight * 0.4) {
            setActiveSegment(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Control Surface Toggle (Bottom-left on mobile, Top-left on desktop) */}
      <div className="fixed bottom-6 left-4 md:top-10 md:left-10 md:bottom-auto z-[100] pointer-events-auto flex items-center gap-2 md:gap-4">
        <span className="hidden md:inline font-mono text-[10px] tracking-[0.2em] uppercase text-primary-text/40">System:</span>
        <button 
          onClick={toggleEngage}
          className="relative flex items-center bg-primary-text/5 border border-primary-text/20 p-1 w-32 md:w-40 h-8 hover:border-primary-text/40 transition-colors"
        >
          <div 
            className={`absolute h-6 w-[calc(50%-4px)] bg-accent transition-transform duration-300 ease-out ${isEngaged ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`}
          />
          <span className={`flex-1 text-center font-mono text-[10px] md:text-xs tracking-widest z-10 transition-colors ${!isEngaged ? 'text-background font-bold' : 'text-primary-text/40'}`}>BYPASS</span>
          <span className={`flex-1 text-center font-mono text-[10px] md:text-xs tracking-widest z-10 transition-colors ${isEngaged ? 'text-background font-bold' : 'text-primary-text/40'}`}>ENGAGE</span>
        </button>
      </div>

      {/* Native-style Floating Top Navbar */}
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto w-[95%] sm:w-[85%] max-w-2xl">
        <div className="flex items-center justify-between bg-black/70 backdrop-blur-xl border border-white/10 px-6 md:px-10 py-4 md:py-5 rounded-full shadow-2xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="group relative flex flex-col items-center justify-center transition-all duration-300"
              aria-label={`Navigate to ${item.label}`}
            >
              <span className={`font-mono text-base md:text-xl tracking-widest uppercase transition-colors duration-300 ${activeSegment === item.id ? 'text-accent' : 'text-primary-text/50 group-hover:text-primary-text'}`}>
                {/* Use short label on mobile, full label on desktop */}
                <span className="block md:hidden">{item.short}</span>
                <span className="hidden md:block">{item.label}</span>
              </span>
              {/* Active dot indicator */}
              <div 
                className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent transition-opacity duration-300 ${activeSegment === item.id ? 'opacity-100' : 'opacity-0'}`}
              />
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
