"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Reveal animation with smooth easing
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

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full overflow-hidden bg-transparent py-24 md:py-32"
    >
      <div className="container mx-auto px-6 lg:px-12 flex justify-start">
        <div className="max-w-prose">
          <div className="mb-12">
            <h2
              ref={titleRef}
              className="text-4xl md:text-5xl font-heading leading-tight text-primary-text"
            >
              Foreword
            </h2>
            <div className="w-16 h-px bg-primary-text/40 mt-6" />
          </div>

          <div ref={contentRef} className="space-y-8 font-serif text-lg md:text-xl text-primary-text/90 leading-relaxed">
            <p>
              <span className="float-left text-6xl md:text-7xl font-heading leading-[0.8] pr-3 pt-2 text-primary-text">
                I
              </span>
              'm John Ebenezer, a Full Stack Developer passionate about building
              user-focused applications that solve real-world problems. With
              expertise in both frontend and backend technologies, I create
              seamless digital experiences from concept to deployment.
            </p>
            <p>
              My journey in software engineering has been driven by curiosity and
              a desire to craft meaningful solutions. I specialize in React,
              Next.js, and Tailwind CSS for frontend development, while leveraging
              Node.js, Express.js, and MongoDB for robust backend systems.
            </p>

            {/* Stats as subtle text list */}
            <div className="pt-8 border-t border-primary-text/20 mt-12 flex flex-col sm:flex-row gap-8 sm:gap-16 text-base font-body text-primary-text/70 uppercase tracking-widest">
              <div>
                <span className="block font-heading text-2xl text-primary-text normal-case tracking-normal mb-1">5+</span>
                Years Experience
              </div>
              <div>
                <span className="block font-heading text-2xl text-primary-text normal-case tracking-normal mb-1">20+</span>
                Projects
              </div>
              <div>
                <span className="block font-heading text-2xl text-primary-text normal-case tracking-normal mb-1">10+</span>
                Happy Clients
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
