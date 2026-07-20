"use client";

import { useRef } from "react";

const stack = [
  {
    category: "Core Languages",
    items: ["Python", "JavaScript / TypeScript", "C++"],
  },
  {
    category: "Frontend & Frameworks",
    items: ["React.js", "Next.js", "Tailwind CSS", "Three.js"],
  },
  {
    category: "Backend & Infrastructure",
    items: ["Node.js & Express", "MongoDB & Supabase", "Electron.js"],
  },
  {
    category: "AI & Automation",
    items: [
      "RAG & Vector Search",
      "Gemini API & Transformers",
      "n8n Automation",
      "LangChain",
    ],
  },
];

const experience = {
  category: "Experience",
  items: [
    "Web Dev Intern · Zippy Digital Solutions",
    "Finalist · IIT Palakkad Hackathon",
    "Lead · n8n Automation Workshop",
  ],
};

/**
 * STACK SECTION
 *
 * Driven by MasterTimeline. Positioned absolutely to act as an exhibit in the journey.
 */
export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section skills-section desktop-exhibit"
      aria-label="Tech Stack"
    >
      <div className="container-editorial">
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingBottom: "1.5rem",
            borderBottom: "1px solid var(--border-strong)",
            marginBottom: "2rem",
          }}
        >
          <div>
            <p className="label" style={{ marginBottom: "8px" }}>Capabilities</p>
            <h2 className="h-section" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>Stack & Experience</h2>
          </div>
        </div>

        {/* Layout Split: Stack Grid on left, Experience on right */}
        <div className="skills-layout-split" style={{ display: "grid", gap: "clamp(2rem, 4vw, 4rem)" }}>
          
          {/* Tech Stack */}
          <div className="stack-grid">
            {stack.map((col) => (
              <div key={col.category} className="stack-col">
                <p className="stack-category">{col.category}</p>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {col.items.map((item) => (
                    <li key={item} className="stack-item">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Experience Sidebar */}
          <div className="stack-col">
            <p className="stack-category">{experience.category}</p>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {experience.items.map((item) => (
                <li key={item} className="stack-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
