"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const para1Ref = useRef<HTMLParagraphElement>(null);
  const para2Ref = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statNumberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Staggered paragraph reveals
      gsap.fromTo(
        para1Ref.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        para2Ref.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 58%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Stats counter animation
      gsap.fromTo(
        statsRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
            onEnter: () => {
              // Animate numbers counting up
              const stats = [
                { ref: statNumberRefs.current[0], target: 5 },
                { ref: statNumberRefs.current[1], target: 20 },
                { ref: statNumberRefs.current[2], target: 10 },
              ];
              stats.forEach(({ ref, target }) => {
                if (!ref) return;
                const obj = { val: 0 };
                gsap.to(obj, {
                  val: target,
                  duration: 2,
                  ease: "power2.out",
                  onUpdate: () => {
                    ref.textContent = Math.round(obj.val) + "+";
                  },
                });
              });
            },
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="editorial-section"
    >
      <div className="editorial-container">
        <div className="max-w-4xl mx-auto md:mx-0">
          {/* Glass panel container */}
          <div className="glass-panel p-8 md:p-14 glow-accent">
            <div className="section-header">
              <div className="flex items-center gap-4 mb-6">
                <span className="section-number">01</span>
                <div className="section-rule" />
              </div>
              <h2
                ref={titleRef}
                className="text-4xl md:text-6xl font-heading leading-tight text-primary-text"
              >
                The Story
              </h2>
            </div>

            <div className="space-y-6 text-lg md:text-xl text-primary-text/85 leading-relaxed">
              <p ref={para1Ref}>
                <span className="float-left text-6xl md:text-7xl font-heading leading-[0.8] pr-3 pt-2 text-accent">
                  I
                </span>
                &apos;m John Ebenezer, a Full Stack Developer passionate about building
                user-focused applications that solve real-world problems. With
                expertise in both frontend and backend technologies, I create
                seamless digital experiences from concept to deployment.
              </p>
              <p ref={para2Ref} className="text-primary-text/70">
                My journey in software engineering has been driven by curiosity and
                a desire to craft meaningful solutions. I specialize in React,
                Next.js, and Tailwind CSS for frontend development, while leveraging
                Node.js, Express.js, and MongoDB for robust backend systems.
              </p>
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="pt-8 border-t border-primary-text/10 mt-12 grid grid-cols-3 gap-8"
            >
              {[
                { label: "Years Experience", initial: "0+" },
                { label: "Projects Completed", initial: "0+" },
                { label: "Happy Clients", initial: "0+" },
              ].map((stat, i) => (
                <div key={stat.label} className="text-center md:text-left">
                  <span
                    ref={(el) => { statNumberRefs.current[i] = el; }}
                    className="block font-heading text-3xl md:text-4xl text-accent mb-1"
                  >
                    {stat.initial}
                  </span>
                  <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-primary-text/40">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
