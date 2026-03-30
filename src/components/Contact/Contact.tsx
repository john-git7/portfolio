"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Form reveal animation
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      formRef.current?.reset();
      alert("Message sent successfully!");
    }, 1500);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full overflow-hidden bg-transparent py-24 md:py-32"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <div className="mb-20 text-center">
            <h2
              ref={titleRef}
              className="text-4xl md:text-5xl font-heading leading-tight text-primary-text"
            >
              Epilogue
            </h2>
            <div className="w-16 h-px bg-primary-text/40 mt-6 mx-auto" />
            <p className="mt-8 text-xl font-serif italic text-primary-text/70 mx-auto">
              Correspondence & Inquiries
            </p>
          </div>

          {/* Print style form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full bg-transparent border-0 border-b border-primary-text/30 px-0 py-3 text-lg font-serif text-primary-text placeholder:text-transparent focus:ring-0 focus:outline-none focus:border-primary-text peer transition-colors"
                  placeholder="Name"
                />
                <label
                  htmlFor="name"
                  className="absolute left-0 top-3 text-lg font-serif text-primary-text/50 transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:top-3 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-primary-text/80 peer-valid:-top-6 peer-valid:text-sm"
                >
                  Name
                </label>
              </div>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full bg-transparent border-0 border-b border-primary-text/30 px-0 py-3 text-lg font-serif text-primary-text placeholder:text-transparent focus:ring-0 focus:outline-none focus:border-primary-text peer transition-colors"
                  placeholder="Email"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 top-3 text-lg font-serif text-primary-text/50 transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:top-3 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-primary-text/80 peer-valid:-top-6 peer-valid:text-sm"
                >
                  Email
                </label>
              </div>
            </div>
            <div className="relative mt-12">
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full bg-transparent border-0 border-b border-primary-text/30 px-0 py-3 text-lg font-serif text-primary-text placeholder:text-transparent focus:ring-0 focus:outline-none focus:border-primary-text peer transition-colors"
                placeholder="Subject"
              />
              <label
                htmlFor="subject"
                className="absolute left-0 top-3 text-lg font-serif text-primary-text/50 transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:top-3 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-primary-text/80 peer-valid:-top-6 peer-valid:text-sm"
              >
                Subject
              </label>
            </div>
            <div className="relative mt-12">
              <textarea
                id="message"
                name="message"
                rows={1}
                required
                className="w-full bg-transparent border-0 border-b border-primary-text/30 px-0 py-3 text-lg font-serif text-primary-text placeholder:text-transparent focus:ring-0 focus:outline-none focus:border-primary-text peer transition-colors resize-none overflow-hidden"
                placeholder="Message"
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />
              <label
                htmlFor="message"
                className="absolute left-0 top-3 text-lg font-serif text-primary-text/50 transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:top-3 peer-focus:-top-6 peer-focus:text-sm peer-focus:text-primary-text/80 peer-valid:-top-6 peer-valid:text-sm"
              >
                Message
              </label>
            </div>
            
            <div className="pt-12 text-center md:text-left">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative px-12 py-4 bg-transparent border border-primary-text/40 text-primary-text font-serif text-sm tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-text transition-colors duration-500"
              >
                <span className="relative z-10">
                  {isSubmitting ? "Sending..." : "Send Dispatch"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
