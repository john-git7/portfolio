import { useThree } from "@react-three/fiber";
import { useMemo } from "react";

export interface ResponsiveConfig {
  cameraPosition: [number, number, number];
  cameraFov: number;
  phonographScale: number;
  phonographPosition: [number, number, number];
  motionIntensity: number;
  lightIntensity: number;
}

export function useResponsiveScene(): ResponsiveConfig {
  const { size } = useThree();
  const isMobile = size.width < 768;

  return useMemo(() => {
    if (isMobile) {
      return {
        cameraPosition: [0, 0, 15],
        cameraFov: 40,
        phonographScale: 0.65,
        phonographPosition: [0, -0.2, 0],
        motionIntensity: 0.4,
        lightIntensity: 0.6,
      };
    }

    return {
      cameraPosition: [0, 0, 10],
      cameraFov: 45,
      phonographScale: 1.0,
      phonographPosition: [0.5, -0.5, 0],
      motionIntensity: 1.0,
      lightIntensity: 1.0,
    };
  }, [isMobile]);
}
