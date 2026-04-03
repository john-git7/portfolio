"use client";

import { useEffect, useRef, useState, useMemo } from "react";

export default function AudioManager() {
  const [isMuted, setIsMuted] = useState(true);
  const ambientRef = useRef<HTMLAudioElement | null>(null);

  // Stable bar heights computed once on mount — prevents hydration mismatch
  // and avoids generating new random values on every render
  const barHeights = useMemo(
    () => [1, 2, 3, 4].map(() => `${Math.floor(Math.random() * 65) + 35}%`),
    []
  );

  useEffect(() => {
    // Create ambient audio
    const audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    audio.loop = true;
    audio.volume = 0.1;
    ambientRef.current = audio;

    return () => {
      audio.pause();
    };
  }, []);

  const toggleMute = () => {
    if (!ambientRef.current) return;
    if (isMuted) {
      ambientRef.current.play().catch(e => console.log("Audio play blocked", e));
    } else {
      ambientRef.current.pause();
    }
    setIsMuted(!isMuted);
  };

  return (
    // z-[110] ensures this sits above the VintagePaperBackground overlay (z-[100])
    <div className="fixed bottom-8 right-8 z-[110] flex items-center gap-4">
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Turn sound on" : "Turn sound off"}
        className="group flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full hover:bg-accent/20 hover:border-accent/40 transition-all"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase text-accent/80 group-hover:text-accent">
          {isMuted ? "Sound Off" : "Sound On"}
        </span>
        <div className="flex gap-[2px] items-end h-3">
          {barHeights.map((height, i) => (
            <div
              key={i}
              className={`w-[2px] bg-accent transition-all duration-300 ${!isMuted ? "animate-pulse" : ""}`}
              style={{
                height: !isMuted ? height : "2px",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </button>
    </div>
  );
}
