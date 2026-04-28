"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/appStore";

export default function AudioManager() {
  const { isEngaged } = useAppStore();
  const ambientRef = useRef<HTMLAudioElement | null>(null);

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

  useEffect(() => {
    if (!ambientRef.current) return;
    if (isEngaged) {
      ambientRef.current.play().catch(e => console.log("Audio play blocked", e));
    } else {
      ambientRef.current.pause();
    }
  }, [isEngaged]);

  // The UI is handled globally by the Bypass/Engage toggle in Navbar.
  return null;
}
