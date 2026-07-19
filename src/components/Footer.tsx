"use client";

import { useLenis } from "lenis/react";

/**
 * FOOTER
 *
 * Single-line. Minimal.
 * Name left — copyright center — back to top right.
 */
export default function Footer() {
  const lenis = useLenis();

  const scrollToTop = () => {
    lenis
      ? lenis.scrollTo(0, { duration: 2.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
      : window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      style={{
        position: "relative",
        zIndex: 10,
        borderTop: "1px solid var(--border)",
        paddingBlock: "clamp(1.5rem, 3vh, 2.2rem)",
      }}
    >
      <div
        className="container-editorial"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Name */}
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "var(--text-secondary)",
          }}
        >
          John Ebenezer
        </span>

        {/* Copyright */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--text-dim)",
          }}
        >
          © {new Date().getFullYear()}
        </span>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--text-dim)",
            background: "none",
            border: "none",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-dim)")}
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
