"use client";

import React, { useState } from "react";
import { Maximize2 } from "lucide-react";
import Lightbox from "./Lightbox";
import MermaidDiagram from "./MermaidDiagram";

interface TechnicalWriteupProps {
  isExpanded: boolean;
  content: React.ReactNode;
  diagramChart: string;
}

export default function TechnicalWriteup({ isExpanded, content, diagramChart }: TechnicalWriteupProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <>
      <div 
        className={`w-full overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100 mt-24' : 'max-h-0 opacity-0 mt-0'}`}
      >
        <div className="max-w-7xl mx-auto w-full border-t border-hairline pt-16">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Markdown / Text Content */}
            <div className="w-full lg:w-1/3 flex flex-col gap-8 text-body text-text-secondary leading-relaxed">
              {content}
            </div>

            {/* Architecture Diagram Thumbnail */}
            <div className="w-full lg:w-2/3">
              <div 
                className="w-full border border-hairline rounded-md bg-bg-surface/30 p-8 relative group cursor-pointer overflow-hidden flex items-center justify-center min-h-[400px]"
                onClick={() => setIsLightboxOpen(true)}
              >
                <div className="absolute top-4 right-4 bg-bg-base border border-hairline rounded-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Maximize2 size={18} className="text-text-primary" />
                </div>
                
                {/* Pointer events none so the click passes through to the container */}
                <div className="pointer-events-none w-full">
                  <MermaidDiagram chart={diagramChart} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Lightbox isOpen={isLightboxOpen} onClose={() => setIsLightboxOpen(false)}>
        <MermaidDiagram chart={diagramChart} />
      </Lightbox>
    </>
  );
}
