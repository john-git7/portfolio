"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SecretAdminTrigger() {
  const router = useRouter();
  const [hintVisible, setHintVisible] = useState(false);

  useEffect(() => {
    // Keyboard shortcut: Ctrl + Shift + A or Cmd + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        router.push("/admin");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <>
      {/* Invisible/subtle floating corner trigger in the bottom-right corner */}
      <div 
        className="fixed bottom-2 right-2 z-50 group pointer-events-auto"
        onMouseEnter={() => setHintVisible(true)}
        onMouseLeave={() => setHintVisible(false)}
      >
        <Link
          href="/admin"
          aria-label="Admin Control Panel"
          className="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-transparent hover:bg-white/20 transition-all duration-300 opacity-20 hover:opacity-100 border border-transparent hover:border-white/30"
          title="Admin Panel (Ctrl+Shift+A)"
        >
          <span className="w-1 h-1 rounded-full bg-white/40 group-hover:bg-accent transition-colors"></span>
        </Link>
        
        {/* Subtle tooltip on hover */}
        {hintVisible && (
          <div className="absolute bottom-5 right-0 whitespace-nowrap bg-bg-surface/95 text-text-secondary border border-hairline px-2.5 py-1 text-[10px] font-mono rounded shadow-xl backdrop-blur-md pointer-events-none animate-in fade-in zoom-in-95 duration-150">
            <span className="text-accent font-semibold">Admin Panel</span> · Ctrl+Shift+A
          </div>
        )}
      </div>
    </>
  );
}
