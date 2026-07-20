// Shared scroll state — written by Lenis, read by 3D scene and camera.
// Plain object (not Zustand) for zero-overhead reads inside useFrame.
export const globalScrollState = {
  scroll:         0,
  progress:       0,
  velocity:       0,   // raw px/frame delta — set by Lenis, reset by AmbientScene
  smoothVelocity: 0,   // exponentially smoothed — read by all consumers
  prevScroll:     0,   // previous scroll position for delta computation
};
