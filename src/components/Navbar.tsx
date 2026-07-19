"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

const navItems = [
  { id: "work",    label: "Work" },
  { id: "stack",   label: "Stack" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const lenis = useLenis();
  const [activeId, setActiveId] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navInnerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (id: string) => {
    if (id === "top") {
      lenis
        ? lenis.scrollTo(0, { duration: 2.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
        : window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const el = document.getElementById(id);
    if (!el) return;

    lenis
      ? lenis.scrollTo(el, { duration: 2.0, offset: -80, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
      : el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);

      // Active section detection
      const ids = ["contact", "stack", "work"];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            setActiveId(id);
            return;
          }
        }
      }
      setActiveId("");
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
