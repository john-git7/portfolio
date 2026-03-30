"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const skills = [
  {
    category: "Frontend",
    skills: ["React", "Next.js", "Tailwind CSS", "TypeScript", "JavaScript"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express.js", "REST APIs", "JWT", "GraphQL"],
  },
  {
    category: "Database",
    skills: ["MongoDB", "PostgreSQL", "Redis", "Prisma"],
  },
  {
    category: "Tools",
    skills: ["Git", "Docker", "Vercel", "AWS", "Figma"],
  },
];

export default function Skills() {
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
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative w-full overflow-hidden bg-transparent py-24 md:py-32"
    >
      <div className="container mx-auto px-6 lg:px-12 flex justify-end">
        <div className="w-full lg:w-3/5">
          {/* Section header */}
          <div className="mb-16">
            <h2
              ref={titleRef}
              className="text-4xl md:text-5xl font-heading leading-tight text-primary-text"
            >
              Appendix I: <br/> Technical Proficiency
            </h2>
            <div className="w-16 h-px bg-primary-text/40 mt-6" />
          </div>

          {/* Skills list styled like an index */}
          <div className="space-y-12">
            {skills.map((skill, index) => (
              <div
                key={skill.category}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="group relative"
              >
                <div className="flex flex-col sm:flex-row items-baseline gap-4 sm:gap-8">
                  <h3 className="text-xl font-heading text-primary-text min-w-[120px]">
                    {skill.category}
                  </h3>
                  <div className="flex-grow hidden sm:block border-b border-primary-text/20 border-dotted" />
                  <div className="flex flex-wrap gap-x-4 gap-y-2 lg:max-w-md">
                    {skill.skills.map((item, i) => (
                      <span
                        key={item}
                        className="text-base font-serif text-primary-text/80"
                      >
                        {item}{i < skill.skills.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
