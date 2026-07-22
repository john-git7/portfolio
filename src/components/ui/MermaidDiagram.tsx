"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "var(--font-mono)",
    });

    const renderChart = async () => {
      if (containerRef.current && chart) {
        try {
          const { svg } = await mermaid.render(`mermaid-${Math.random().toString(36).substring(7)}`, chart);
          setSvgContent(svg);
        } catch (error) {
          console.error("Failed to render Mermaid chart", error);
        }
      }
    };

    renderChart();
  }, [chart]);

  return (
    <div 
      ref={containerRef} 
      className="w-full flex justify-center py-8"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
