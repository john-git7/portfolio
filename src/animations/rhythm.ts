import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

/**
 * A custom hook that provides a deterministic, BPM-driven timing engine.
 * All values are derived from a shared beat accumulator to ensure synchronization
 * across all components even when the BPM transitions.
 */
export function useDeterministicRhythm(targetBPM: number = 72) {
  const bpmRef = useRef(targetBPM);
  const beatAccumulator = useRef(0);
  const lastTime = useRef(0);

  // Derived utility values stored in refs for consumption
  const rhythm = useRef({
    bpm: targetBPM,
    beatPhase: 0,    // 0 -> 1 loop per beat
    fullCycle: 0,    // Continuous beat count
    smoothPulse: 0,  // sin based pulse
    sharpPulse: 0,   // pow(sin) based kick
    drift: 0,        // slow multi-beat oscillation
    secondsPerBeat: 60 / targetBPM
  });

  useFrame((state, delta) => {
    // 1. Smoothly lerp BPM towards target (State transition)
    bpmRef.current = THREE.MathUtils.lerp(bpmRef.current, targetBPM, delta * 2);
    const currentBPM = bpmRef.current;
    
    // 2. Accumulate beats based on current BPM to avoid jumps
    beatAccumulator.current += delta * (currentBPM / 60);
    
    const fullCycle = beatAccumulator.current;
    const beatPhase = fullCycle % 1;
    
    // 3. Compute deterministic utility curves
    const smoothPulse = Math.sin(beatPhase * Math.PI);
    const sharpPulse = Math.pow(Math.sin(beatPhase * Math.PI), 3);
    const drift = Math.sin(fullCycle * 0.1);

    // 4. Update the rhythm object
    rhythm.current.bpm = currentBPM;
    rhythm.current.beatPhase = beatPhase;
    rhythm.current.fullCycle = fullCycle;
    rhythm.current.smoothPulse = smoothPulse;
    rhythm.current.sharpPulse = sharpPulse;
    rhythm.current.drift = drift;
    rhythm.current.secondsPerBeat = 60 / currentBPM;
  });

  return rhythm.current;
}
