"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import React from "react";

export default function SmoothScrolling({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.05, 
        wheelMultiplier: 1,
        // Removed syncTouch to prevent interference with mobile's native momentum scrolling
      }}
    >
      {children}
    </ReactLenis>
  );
}