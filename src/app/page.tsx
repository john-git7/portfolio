"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Waves from "@/components/Waves";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import DevGrasp from "@/components/projects/DevGrasp";
import LeadVelox from "@/components/projects/LeadVelox";
import AIResearchAssistant from "@/components/projects/AIResearchAssistant";
import { PortfolioData } from "@/types/portfolio";
import defaultData from "@/data/portfolio-content.json";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

export default function Home() {
  const [data, setData] = useState<PortfolioData>(defaultData as PortfolioData);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const wavesRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const textInnerRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  // Sync latest portfolio data from API
  useEffect(() => {
    async function loadPortfolio() {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.warn("Using default static portfolio data");
      }
    }
    loadPortfolio();
  }, []);

  useGSAP(() => {
    // Simple fade-in instead of a complex slide-up
    gsap.fromTo(textInnerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: "power2.out" }
    );

    // Typewriter effect for tagline
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion && taglineRef.current) {
      const originalText = taglineRef.current.innerText;
      taglineRef.current.innerText = "";
      gsap.to(taglineRef.current, {
        text: originalText,
        duration: 1.5,
        delay: 0.5,
        ease: "none"
      });
    }

    // Pinned cinematic dive sequence using the original Waves
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "+=100%", // Reduced pin duration for better UX
        scrub: 1, 
        pin: true,
        pinSpacing: false, // Content will scroll up to cover it seamlessly
      }
    });

    // We animate a CSS variable --zoom on the wavesRef instead of CSS scale.
    // This allows the Waves component to redraw the lines sharply at native resolution.
    tl.to(wavesRef.current, {
      "--zoom": 15, // Using CSS variable for crisp canvas rendering
      opacity: 0,
      duration: 1,
      ease: "power2.in"
    }, 0);

    // Text escapes upward and fades out VERY quickly (in the first 25% of the scroll)
    tl.to(textRef.current, {
      y: -150,
      scale: 1.05,
      opacity: 0,
      duration: 0.25,
      ease: "power2.out"
    }, 0);

    // Cinematic reveal of the rest of the page from inside the scaled waves
    gsap.fromTo(contentWrapperRef.current,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: contentWrapperRef.current,
          start: "top 90%", // Start fading in as it enters the bottom of the screen
          end: "top 0%", // Fully opaque by the time it reaches the top
          scrub: true,
        }
      }
    );

    // Animate section entrances inside the content wrapper
    const sections = gsap.utils.toArray('.animate-section');
    sections.forEach((section: any) => {
      gsap.fromTo(section,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
          }
        }
      );
    });

  }, { scope: containerRef });

  const leetcodeLink = data.socialLinks.find((s) => s.id === "leetcode")?.url || "https://leetcode.com/u/Johnze";

  return (
    <main ref={containerRef} className="w-full relative overflow-x-hidden bg-bg-base">
      
      {/* Hero Section (Pinned) */}
      <section ref={heroRef} className="w-full h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 relative z-0 overflow-hidden bg-bg-base">
        <div ref={wavesRef} className="absolute inset-0 z-0 origin-center" style={{ "--zoom": 1 } as React.CSSProperties}>
          <Waves
            lineColor="rgba(255, 255, 255, 0.3)"
            backgroundColor="transparent"
            waveSpeedX={0.02}
            waveSpeedY={0.01}
            waveAmpX={40}
            waveAmpY={20}
            friction={0.9}
            tension={0.01}
            maxCursorMove={120}
            xGap={12}
            yGap={36}
          />
        </div>
        <div ref={textRef} className="max-w-7xl mx-auto w-full z-10 relative pointer-events-none">
          <div ref={textInnerRef} className="flex flex-col gap-6 md:gap-10 pointer-events-auto">
            <h1 className="hero-title text-text-primary uppercase">
              <span className="block mb-2 md:mb-4">{data.profile.firstName}</span>
              <span className="block ml-0 md:ml-12 text-accent">{data.profile.lastName}</span>
            </h1>

            <div ref={taglineRef} className="mt-8 font-mono text-mono text-text-secondary uppercase tracking-widest min-h-[1.5em]">
              {data.profile.tagline}
            </div>

            <div className="mt-4 max-w-xl font-sans text-[1.125rem] md:text-[1.25rem] text-text-secondary leading-relaxed tracking-tight">
              {data.profile.shortBio}
            </div>

            <div className="flex flex-wrap gap-6 mt-8 font-mono text-caption uppercase tracking-wider text-text-secondary">
              {/* Dynamic Resume Link */}
              <a 
                href={data.resume.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="link-arrow hover:text-text-primary text-text-primary font-bold"
              >
                <span>{data.resume.label || "Resume"}</span>
                <span className="arrow-line"></span><span className="arrow-head">↗</span>
              </a>

              {/* Dynamic Social Links */}
              {data.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.isMail ? undefined : "_blank"}
                  rel={link.isMail ? undefined : "noopener noreferrer"}
                  className="link-arrow hover:text-text-primary"
                >
                  <span>{link.label}</span>
                  <span className="arrow-line"></span><span className="arrow-head">↗</span>
                </a>
              ))}

              {/* Dynamic Custom Links (Hero) */}
              {data.customLinks?.filter((l) => l.showInHero).map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-arrow hover:text-text-primary text-accent font-medium"
                >
                  <span>{link.label}</span>
                  <span className="arrow-line"></span><span className="arrow-head">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Wrapper that emerges from the scaled waves */}
      <div ref={contentWrapperRef} className="w-full relative z-10 bg-bg-base/90 backdrop-blur-sm border-t border-hairline shadow-2xl">
        
        {/* Intro / About */}
        <section className="animate-section w-full py-24 px-8 md:px-16 lg:px-24 relative z-10">
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/3">
              <h2 className="section-title text-text-secondary">
                About
              </h2>
            </div>
            <div className="w-full md:w-2/3 max-w-2xl">
              <p className="font-sans text-body text-text-primary leading-relaxed">
                {data.profile.aboutText}
              </p>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="animate-section w-full py-24 px-8 md:px-16 lg:px-24 border-t border-hairline relative z-10">
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/3">
              <h2 className="section-title text-text-secondary">
                Experience
              </h2>
            </div>
            <div className="w-full md:w-2/3 max-w-2xl">
              <div className="flex flex-col gap-12">
                <div>
                  <div className="flex flex-col md:flex-row justify-between items-baseline mb-4">
                    <h4 className="text-lg font-medium text-text-primary">Web Developer Intern — Zippy Digital Solutions</h4>
                    <span className="font-mono text-caption text-text-secondary whitespace-nowrap mt-2 md:mt-0">Nov 2025 – Apr 2026</span>
                  </div>
                  <ul className="list-disc list-outside ml-4 font-sans text-body text-text-secondary flex flex-col gap-2">
                    <li>Built an Electron-based offline billing application enabling desktop-first business operations</li>
                    <li>Implemented secure local data synchronization and offline transaction processing across multiple devices</li>
                    <li>Collaborated using Git/GitHub in a production development environment</li>
                  </ul>
                  <a 
                    href={data.certificates.zippyInternship} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 mt-6 px-4 py-2 border border-hairline rounded-full hover:bg-white/5 transition-colors text-xs font-mono uppercase tracking-wider text-text-primary w-fit group"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent group-hover:scale-110 transition-transform"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    <span>View Certificate</span>
                    <span className="text-text-secondary">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Container */}
        <div className="w-full relative z-10" id="projects">
          <div className="w-full py-24 px-8 md:px-16 lg:px-24 border-t border-hairline relative z-10">
            <div className="max-w-7xl mx-auto w-full">
              <h2 className="section-title text-text-secondary mb-8">
                Projects
              </h2>
            </div>
          </div>
          <DevGrasp />
          <LeadVelox />
          <AIResearchAssistant />
        </div>

        {/* Core Stack */}
        <section className="animate-section w-full py-24 px-8 md:px-16 lg:px-24 border-t border-hairline relative z-10">
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/3">
              <h2 className="section-title text-text-secondary">
                Core Stack
              </h2>
            </div>
            <div className="w-full md:w-2/3 max-w-2xl">
              <ul className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 font-mono text-mono text-text-primary">
                {data.coreStack.map((tech) => (
                  <li key={tech} className="flex items-center">{tech}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="animate-section w-full py-24 px-8 md:px-16 lg:px-24 border-t border-hairline relative z-10">
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/3">
              <h2 className="section-title text-text-secondary">
                Education
              </h2>
            </div>
            <div className="w-full md:w-2/3 max-w-2xl">
              <div>
                <h4 className="text-lg font-medium text-text-primary mb-2">B.Tech – Software Product Engineering (Kalvium)</h4>
                <p className="font-mono text-caption text-text-secondary">Kalasalingam Academy of Research and Education, 2024–2028</p>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="animate-section w-full py-24 px-8 md:px-16 lg:px-24 border-t border-hairline relative z-10">
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/3">
              <h2 className="section-title text-text-secondary">
                Achievements
              </h2>
            </div>
            <div className="w-full md:w-2/3 max-w-2xl">
              <ul className="list-disc list-outside ml-4 font-sans text-body text-text-secondary flex flex-col gap-6">
                <li>
                  <div className="flex flex-col gap-4">
                    <span>n8n Workflow Automation Workshop — Participant, Led session for 200+ students at Kalasalingam University</span>
                    <a 
                      href={data.certificates.n8nWorkshop} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 px-4 py-2 border border-hairline rounded-full hover:bg-white/5 transition-colors text-xs font-mono uppercase tracking-wider text-text-primary w-fit group"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent group-hover:scale-110 transition-transform"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      <span>View Images</span>
                      <span className="text-text-secondary">↗</span>
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex flex-col gap-4">
                    <span>NASA International Space Apps Challenge 2025 — Participant, "Galactic Problem Solver" recognition</span>
                    <a 
                      href={data.certificates.nasaSpaceApps} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 px-4 py-2 border border-hairline rounded-full hover:bg-white/5 transition-colors text-xs font-mono uppercase tracking-wider text-text-primary w-fit group"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent group-hover:scale-110 transition-transform"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      <span>View Certificate</span>
                      <span className="text-text-secondary">↗</span>
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex flex-col gap-4">
                    <span>NeuroBots Global Robotics Championship, IIT Palakkad 2026 — Participant, Team CODE 404</span>
                    <a 
                      href={data.certificates.neuroBots} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 px-4 py-2 border border-hairline rounded-full hover:bg-white/5 transition-colors text-xs font-mono uppercase tracking-wider text-text-primary w-fit group"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent group-hover:scale-110 transition-transform"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      <span>View Images</span>
                      <span className="text-text-secondary">↗</span>
                    </a>
                  </div>
                </li>
                <li>
                  150+ DSA problems solved on{" "}
                  <a href={leetcodeLink} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    LeetCode
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer / Contact */}
        <footer className="w-full py-24 px-8 md:px-16 lg:px-24 border-t border-hairline relative z-10">
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <p className="text-project text-text-primary tracking-tight select-none flex items-baseline">
                <span>Let&apos;s talk</span>
                {/* Hidden Easter Egg / Secret Access Trigger: The period in "Let's talk." */}
                <Link
                  href="/admin"
                  className="text-text-primary/70 hover:text-accent hover:scale-125 transition-all inline-block cursor-pointer px-0.5"
                  title="Secret Admin Access"
                  aria-label="Admin Portal"
                >
                  .
                </Link>
              </p>
              <div className="mt-2 flex items-center gap-3">
                <span className="font-mono text-[10px] text-text-secondary/50 uppercase tracking-widest">
                  {data.profile.availabilityStatus || "Available for Opportunities"}
                </span>
                {/* Subtle discrete stealth glyph */}
                <Link
                  href="/admin"
                  className="text-text-secondary/20 hover:text-text-primary hover:opacity-100 transition-all font-mono text-[10px]"
                  title="Admin console (Ctrl+Shift+A)"
                  aria-label="Admin Console"
                >
                  ⚙
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-8 font-mono text-caption text-text-secondary uppercase tracking-wider">
              {/* Dynamic Resume Link */}
              <a 
                href={data.resume.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="link-arrow hover:text-text-primary text-text-primary font-bold"
              >
                <span>{data.resume.label || "Resume"}</span>
                <span className="arrow-line"></span><span className="arrow-head">↗</span>
              </a>

              {/* Dynamic Social Links */}
              {data.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.isMail ? undefined : "_blank"}
                  rel={link.isMail ? undefined : "noopener noreferrer"}
                  className="link-arrow hover:text-text-primary"
                >
                  <span>{link.label}</span>
                  <span className="arrow-line"></span><span className="arrow-head">↗</span>
                </a>
              ))}

              {/* Dynamic Custom Links (Footer) */}
              {data.customLinks?.filter((l) => l.showInFooter).map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-arrow hover:text-text-primary text-accent font-medium"
                >
                  <span>{link.label}</span>
                  <span className="arrow-line"></span><span className="arrow-head">↗</span>
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
