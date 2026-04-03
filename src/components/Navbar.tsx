"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";

const navItems = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Works" },
  { id: "contact" , label: "Contact" }
];

export default function Navbar({ lenis }: { lenis: any }) {
  const [activeSegment, setActiveSegment] = useState("hero");

  // Map segment to scroll percentage (0 to 1)
  // This depends on the total height in page.tsx (250vh = 2.5 * viewport)
  // Total scrollable range is 1.5 * viewport (since 100vh is visible)
  // But Lenis uses absolute scroll. 
  // We can calculate based on total height.
  const scrollToLabel = (id: string) => {
    if (!lenis) return;
    
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    let target = 0;
    
    switch(id) {
      case "hero": target = 0; break;
      case "about": target = totalHeight * 0.25; break;
      case "skills": target = totalHeight * 0.5; break;
      case "projects": target = totalHeight * 0.75; break;
      case "contact": target = totalHeight; break;
    }

    lenis.scrollTo(target, {
      duration: 2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };

  useEffect(() => {
    if (!lenis) return;

    const handleScroll = ({ scroll, limit, progress }: any) => {
      if (progress < 0.15) setActiveSegment("hero");
      else if (progress < 0.4) setActiveSegment("about");
      else if (progress < 0.65) setActiveSegment("skills");
      else if (progress < 0.85) setActiveSegment("projects");
      else setActiveSegment("contact");
    };

    lenis.on("scroll", handleScroll);
    return () => lenis.off("scroll", handleScroll);
  }, [lenis]);

  return (
    <nav className="fixed right-2 md:right-8 top-[55%] md:top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-5 md:gap-8 items-end pointer-events-auto">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToLabel(item.id)}
          className="group flex items-center gap-3 md:gap-4 transition-all duration-500"
        >
          {/* Label is always visible but very faint on mobile when inactive */}
          <span className={`font-mono text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.4em] uppercase transition-all duration-500 ${activeSegment === item.id ? 'text-accent opacity-100' : 'text-highlight opacity-30 md:opacity-0 group-hover:opacity-40'}`}>
            {item.label}
          </span>
          <div className={`w-5 md:w-8 h-[1px] transition-all duration-500 ${activeSegment === item.id ? 'bg-accent w-8 md:w-12' : 'bg-highlight/20 group-hover:bg-highlight/60'}`} />
        </button>
      ))}
    </nav>
  );
}
