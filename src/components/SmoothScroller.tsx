"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { usePathname, useSearchParams } from "next/navigation";

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
    }
    
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.clearScrollMemory("manual");

    const lenis = new Lenis({
      lerp: 0.06, // Fluid, heavier inertia for Lusion-like feel
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 2,
    });
    
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []); // Keeps the lenis instance alive across routes

  // Reset scroll on navigation (Next.js App Router)
  useEffect(() => {
    // Before GSAP calculates pinning and layout, ensure we are at the top
    window.scrollTo(0, 0);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();

      if (lenisRef.current) {
        lenisRef.current.resize();

        if (window.location.hash) {
          const target = document.querySelector(window.location.hash) as HTMLElement;
          if (target) {
            // Scroll to the target smoothly using Lenis after GSAP has calculated layout
            lenisRef.current.scrollTo(target, { offset: 0 });
          }
        }
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return <>{children}</>;
}
