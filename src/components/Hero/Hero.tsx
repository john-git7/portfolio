"use client";

import { Canvas } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PhonographCanvas = () => {
  const vinylRef = useRef<any>(null);

  useEffect(() => {
    if (vinylRef.current) {
      // Animate vinyl rotation with GSAP using steps easing for stop-motion effect
      gsap.to(vinylRef.current.rotation, {
        y: Math.PI * 2,
        duration: 12,
        repeat: -1,
        ease: "steps(12)",
      });
    }
  }, []);

  return (
    <group>
      {/* Ambient light */}
      <ambientLight intensity={0.5} />
      {/* Point light for warm lighting */}
      <pointLight position={[-5, 10, 5]} intensity={1.5} color={0xffb84d} />
      {/* Base platform */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 0.05, 32]} />
        <meshPhongMaterial color={0x5a3e2b} />
      </mesh>
      {/* Vinyl record */}
      <mesh ref={vinylRef} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 64]} />
        <meshPhongMaterial color={0x1a1a1a} shininess={10} />
      </mesh>
      {/* Tonearm */}
      <group rotation={[0, 0, -0.2]} position={[0.3, 0.1, 0]}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
          <meshPhongMaterial color={0xc79a3b} shininess={50} />
        </mesh>
      </group>
      {/* Phonograph horn */}
      <group rotation={[0, 0, Math.PI / 4]} position={[0, 0.8, -1.2]}>
        <mesh>
          <coneGeometry args={[0.3, 2, 8]} />
          <meshPhongMaterial color={0xc79a3b} shininess={50} />
        </mesh>
      </group>
    </group>
  );
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Cinematic entrance animation with power3.out easing
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      canvasRef.current,
      { opacity: 0, scale: 0.8, x: -50 },
      { opacity: 1, scale: 1, x: 0, duration: 1.2 }
    )
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.8"
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(
        descRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.5"
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4"
      );

    // Parallax effect on scroll
    gsap.to(canvasRef.current, {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  const scrollToProjects = () => {
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden"
    >
      <div className="container mx-auto max-w-[1200px] px-6 text-center z-10">
        <div className="flex flex-col items-center justify-center space-y-8">
          <p className="text-secondary-text font-serif italic text-lg tracking-[0.1em] opacity-80">
            A portfolio by
          </p>
          <div className="space-y-4">
            <h1
              ref={titleRef}
              className="text-[10vw] sm:text-[120px] font-heading leading-none text-primary-text tracking-tight mx-auto"
            >
              John Ebenezer
            </h1>
            <div className="w-24 h-[1px] bg-primary-text/30 mx-auto" />
          </div>
          <p
            ref={subtitleRef}
            className="text-xl sm:text-2xl font-serif text-primary-text/80 max-w-2xl mx-auto italic"
          >
            Crafting digital experiences with precision and passion.
          </p>
          <p
            ref={descRef}
            className="text-base sm:text-lg font-body text-primary-text/70 max-w-md mx-auto leading-relaxed"
          >
            Full Stack Developer specializing in accessible, pixel-perfect, and performant web applications.
          </p>
          <div className="pt-8">
             <button
              ref={ctaRef}
              onClick={scrollToProjects}
              className="group relative px-10 py-4 bg-transparent border border-primary-text/40 text-primary-text font-serif text-sm tracking-widest uppercase overflow-hidden hover:border-primary-text transition-colors duration-500"
            >
              <span className="relative z-10 transition-colors duration-500">
                Turn the Page
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Centered Phonograph below text or blended in background */}
      <div 
        ref={canvasRef} 
        className="relative w-full aspect-video max-w-[600px] mx-auto opacity-70 mt-12 md:mt-16 pointer-events-none"
      >
        <Canvas
          className="w-full h-full"
          camera={{ position: [0, 1.5, 5], fov: 45 }}
        >
          <PhonographCanvas />
        </Canvas>
      </div>
    </section>
  );
}
