"use client";

import { useEffect, useState } from "react";

import { useLenis } from 'lenis/react';
import { useAppStore } from '@/store/appStore';

const navItems = [
  { id: "hero", label: "Home" },
  { id: "projects", label: "Signal Path" },
  { id: "skills", label: "Patch Panel" },
  { id: "contact", label: "Master Out" },
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
      {/* Top Left Control Surface Toggle */}
      <div className="fixed top-6 left-6 md:top-10 md:left-10 z-[100] pointer-events-auto flex items-center gap-4">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary-text/40">System:</span>
        <button 
          onClick={toggleEngage}
          className="relative flex items-center bg-primary-text/5 border border-primary-text/20 p-1 w-32 h-8 hover:border-primary-text/40 transition-colors"
        >
          <div 
            className={`absolute h-6 w-[calc(50%-4px)] bg-accent transition-transform duration-300 ease-out ${isEngaged ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`}
          />
          <span className={`flex-1 text-center font-mono text-[9px] tracking-widest z-10 transition-colors ${!isEngaged ? 'text-background font-bold' : 'text-primary-text/40'}`}>BYPASS</span>
          <span className={`flex-1 text-center font-mono text-[9px] tracking-widest z-10 transition-colors ${isEngaged ? 'text-background font-bold' : 'text-primary-text/40'}`}>ENGAGE</span>
        </button>
      </div>

      <nav className="fixed right-2 md:right-8 top-[55%] md:top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-5 md:gap-7 items-end pointer-events-auto">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className="group flex items-center gap-3 md:gap-4 transition-all duration-500"
          aria-label={`Navigate to ${item.label}`}
        >
          <span className={`font-mono text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.4em] uppercase transition-all duration-500 ${activeSegment === item.id ? 'text-accent opacity-100 translate-x-0' : 'text-highlight opacity-0 md:opacity-0 translate-x-1 group-hover:opacity-50 group-hover:translate-x-0'}`}>
            {item.label}
          </span>
          <div className={`h-[1px] transition-all duration-500 ${activeSegment === item.id ? 'bg-accent w-10 md:w-14' : 'bg-highlight/20 w-5 md:w-8 group-hover:bg-highlight/50 group-hover:w-7 md:group-hover:w-10'}`} />
        </button>
      ))}
      </nav>
    </>
  );
}
