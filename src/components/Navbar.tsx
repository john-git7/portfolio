"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

const navItems = [
  { id: "about",   label: "About" },
  { id: "stack",   label: "Stack" },
  { id: "work",    label: "Work" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const lenis = useLenis();
  const [activeId, setActiveId] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navInnerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (id: string) => {
    const scrollMap: Record<string, number> = {
      top: 0,
      about: 0.25,
      work: 0.51,
      stack: 0.77,
      contact: 1.0
    };

    const targetProgress = scrollMap[id] ?? 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = maxScroll * targetProgress;

    lenis
      ? lenis.scrollTo(targetY, { duration: 2.0, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
      : window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? y / maxScroll : 0;

      // Active section detection based on progress thresholds
      if (progress >= 0.9) {
        setActiveId("contact");
      } else if (progress >= 0.64) {
        setActiveId("stack");
      } else if (progress >= 0.38) {
        setActiveId("work");
      } else if (progress >= 0.12) {
        setActiveId("about");
      } else {
        setActiveId("");
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="nav-root" aria-label="Main navigation">
      <div
        ref={navInnerRef}
        className={`nav-inner${scrolled ? " scrolled" : ""}`}
      >
        {/* Wordmark — links back to top */}
        <button
          onClick={() => scrollToSection("top")}
          className="nav-wordmark"
          aria-label="Back to top"
        >
          JE
        </button>

        {/* Nav links */}
        <ul className="nav-links" role="list">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={`nav-link${activeId === item.id ? " active" : ""}`}
                aria-label={`Navigate to ${item.label}`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
