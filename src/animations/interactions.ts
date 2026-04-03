import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

/**
 * A custom hook to add a subtle "stop-motion" rotation to an object.
 * It strictly increments rotation at stepped intervals.
 */
export function useStopMotionRotation(
  ref: React.RefObject<THREE.Object3D | null>,
  axis: 'x' | 'y' | 'z' = 'y',
  speed: number = 0.08,
  interval: number = 0.15
) {
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    timeRef.current += delta;
    if (timeRef.current > interval) {
      if (axis === 'x') ref.current.rotation.x += speed;
      if (axis === 'y') ref.current.rotation.y += speed;
      if (axis === 'z') ref.current.rotation.z += speed;
      timeRef.current = 0;
    }
  });
}

/**
 * A custom hook to add a very slow global breathing/floating micro-motion to objects.
 */
export function useMicroMotion(
  ref: React.RefObject<THREE.Object3D | null>,
  intensity: number = 0.05,
  speed: number = 0.5
) {
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    // Base floating on sine waves
    ref.current.position.y = Math.sin(t * speed) * intensity;
    ref.current.rotation.x = Math.sin(t * speed * 0.5) * (intensity * 0.2);
    ref.current.rotation.z = Math.cos(t * speed * 0.3) * (intensity * 0.1);
  });
}

/**
 * A custom hook for premium hover interactions including slight scale 
 * and cursor-relative tilt.
 */
export function useCinematicHover(
  ref: React.RefObject<THREE.Object3D | null>,
  hovered: boolean,
  intensity: number = 0.05
) {
  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Scale responds to hover
    const targetScale = hovered ? 1.05 : 1.0;
    ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);

    // Subtle drift based on time for 'alive' feel
    if (hovered) {
      ref.current.rotation.y += Math.sin(state.clock.elapsedTime * 2) * 0.001;
      ref.current.rotation.x += Math.cos(state.clock.elapsedTime * 1.5) * 0.001;
    }
  });
}

/**
 * Common config parameters for spring physics.
 */
export const springConfig = { mass: 1, tension: 170, friction: 26 };

/**
 * A hook to get smoothed mouse coordinates (-1 to 1 range).
 */
export function useMousePosition(lerpFactor: number = 0.1) {
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useFrame((state) => {
    mouse.current.targetX = state.pointer.x;
    mouse.current.targetY = state.pointer.y;

    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, mouse.current.targetX, lerpFactor);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, mouse.current.targetY, lerpFactor);
  });

  return mouse.current;
}

/**
 * Applies a smooth tilt/parallax effect to a group based on mouse movement.
 */
export function useMouseInteraction(
  ref: React.RefObject<THREE.Group | null>,
  intensity: number = 0.5,
  lerpFactor: number = 0.05
) {
  const mouse = useMousePosition(lerpFactor);

  useFrame(() => {
    if (!ref.current) return;
    
    // Smooth tilt based on mouse position
    const targetRotationX = -mouse.y * 0.1 * intensity;
    const targetRotationY = mouse.x * 0.15 * intensity;

    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRotationX, 0.1);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotationY, 0.1);
  });
}

/**
 * A hook to create a magnetic effect for UI elements.
 */
export function useMagnetic(
  ref: React.RefObject<HTMLElement | null>,
  strength: number = 0.5
) {
  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();
      
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      
      gsap.to(el, {
        x: deltaX * strength,
        y: deltaY * strength,
        duration: 0.4,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)"
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength, ref]);
}
