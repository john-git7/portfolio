"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const projects = [
  {
    title: "Tunify",
    description:
      "A music streaming web application with offline playback and vocal/instrument separation capabilities.",
    tags: ["React", "Next.js", "Tailwind CSS", "Web Audio API", "Node.js", "Express.js"],
    demoUrl: "#",
    codeUrl: "#",
  },
  {
    title: "AgriConnect Marketplace",
    description:
      "A digital marketplace connecting farmers directly with consumers for fresh produce.",
    tags: ["React", "Next.js", "Tailwind CSS", "MongoDB", "Node.js", "Express.js", "Stripe"],
    demoUrl: "#",
    codeUrl: "#",
  },
  {
    title: "TaskFlow",
    description:
      "A collaborative project management tool with real-time updates and team workspaces.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Firebase", "Redux"],
    demoUrl: "#",
    codeUrl: "#",
  },
  {
    title: "WeatherNow",
    description:
      "A beautiful weather application with location-based forecasts and interactive maps.",
    tags: ["React", "Next.js", "Tailwind CSS", "OpenWeather API", "Leaflet"],
    demoUrl: "#",
    codeUrl: "#",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Title reveal animation
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Stagger card animations
    gsap.fromTo(
      cardRefs.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative w-full overflow-hidden bg-transparent py-24 md:py-32"
    >
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="mb-24 text-center">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl font-heading leading-tight text-primary-text"
          >
            Selected Works
          </h2>
          <div className="w-16 h-px bg-primary-text/40 mt-6 mx-auto" />
        </div>

        {/* Projects list - continuous reading feel */}
        <div className="space-y-32 md:space-y-48">
          {projects.map((project, index) => (
            <div
              key={project.title}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className={`flex flex-col gap-8 md:gap-16 ${
                index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              } items-center`}
            >
              {/* Project "Image" placeholder styling like a print */}
              <div className="w-full md:w-1/2">
                <div className="w-full aspect-[4/3] bg-primary-text/5 border border-primary-text/20 p-2 sm:p-4 shadow-sm relative group overflow-hidden">
                   <div className="absolute inset-x-0 bottom-0 top-0 m-4 sm:m-6 border border-primary-text/10" />
                   {/* In a real project, replace this with next/image */}
                   <div className="w-full h-full bg-surface/50 border border-primary-text/10 flex items-center justify-center">
                      <span className="font-serif italic text-primary-text/40 text-lg">Plate {index + 1}</span>
                   </div>
                </div>
              </div>

              {/* Project Content */}
              <div className="w-full md:w-1/2 space-y-6">
                {/* Chapter/Number */}
                <div className="text-xl font-serif italic text-primary-text/50">
                  Chapter {String(index + 1).padStart(2, "0")}
                </div>

                <h3 className="text-3xl md:text-4xl font-heading text-primary-text">
                  {project.title}
                </h3>

                <p className="text-lg font-serif text-primary-text/80 leading-relaxed max-w-lg">
                  {project.description}
                </p>

                {/* Tags styled like print metadata */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 pt-4 border-t border-primary-text/20 max-w-lg">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm font-body text-primary-text/70 uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Print style links */}
                <div className="flex gap-8 pt-4">
                  <a
                    href={project.demoUrl}
                    className="font-body text-sm tracking-widest uppercase border-b border-primary-text/30 hover:border-primary-text text-primary-text transition-colors pb-1"
                  >
                    View Project
                  </a>
                  <a
                    href={project.codeUrl}
                    className="font-body text-sm tracking-widest uppercase border-b border-primary-text/30 hover:border-primary-text text-primary-text transition-colors pb-1"
                  >
                    Source Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
