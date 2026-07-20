"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// UI Shell
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import MasterTimeline from "@/components/MasterTimeline";

// 3D Background
import Scene from "@/components/Scene";

// Sections
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Projects from "@/components/Projects/Projects";
import Skills from "@/components/Skills/Skills";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer";

import { globalScrollState } from "@/store/scrollStore";

/**
 * Sync GSAP ScrollTrigger with Lenis smooth scroll.
 * Must be inside <ReactLenis> to access useLenis().
 */
function GSAPLenisSync() {
  const lenis = useLenis(({ scroll, progress }) => {
    // Velocity: raw pixel delta per Lenis tick
    const rawVel = Math.abs(scroll - globalScrollState.prevScroll);
    globalScrollState.prevScroll       = scroll;
    globalScrollState.velocity         = rawVel;
    globalScrollState.smoothVelocity   = globalScrollState.smoothVelocity + (rawVel - globalScrollState.smoothVelocity) * 0.1;
    globalScrollState.scroll           = scroll;
    globalScrollState.progress         = progress;
    ScrollTrigger.update();
  });

  useEffect(() => {
    if (!lenis) return;

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, [lenis]);

  return null;
}

const lenisOptions = {
  duration: 1.4,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  autoRaf: false,
};

export default function Home() {
  useEffect(() => {
    // Always restore scroll to top on refresh
    if (typeof window !== "undefined") {
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

    gsap.registerPlugin(ScrollTrigger);
  }, []);

  return (
    <ReactLenis root options={lenisOptions}>
      <GSAPLenisSync />
      <MasterTimeline />

      {/* UI Shell — cursor + progress + nav */}
      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      {/* VISUAL CONTAINER */}
      <div className="main-visual-container">
        {/* 3D Canvas — fixed background, always on */}
        <div className="canvas-wrapper">
          <Scene />
        </div>

        {/* DOM Sections */}
        <div className="exhibits-wrapper">
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Contact />
        </div>
      </div>

      {/* SCROLLABLE ANCHOR - 600vh container to drive the GSAP Master Timeline slowly and smoothly */}
      <main className="scroll-container" style={{ height: "600vh", position: "relative" }} />
    </ReactLenis>
  );
}
