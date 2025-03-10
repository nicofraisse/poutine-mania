"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion"; // Fixed import path
import { cn } from "../../lib/utils";

export type TextShimmerProps = {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number;
  waitDuration?: number;
  textShadow?: string;
  baseColor?: string;
  shimmerColor?: string;
};

export function TextShimmer({
  children,
  as: Component = "span",
  className,
  duration = 2,
  spread = 2,
  waitDuration = 0,
  textShadow = "none",
  baseColor = "#a1a1aa",
  shimmerColor = "#ffffff",
}: TextShimmerProps) {
  const MotionComponent = motion(Component as React.ElementType);

  const dynamicSpread = useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  return (
    <div className={cn("relative inline-block", className)}>
      <span
        className="absolute inset-0 z-0"
        style={{
          textShadow,
          color: "transparent",
        }}
        aria-hidden="true"
      >
        {children}
      </span>

      <MotionComponent
        className="relative z-10 inline-block bg-clip-text text-transparent"
        initial={{ backgroundPosition: "100% 0%" }}
        animate={{ backgroundPosition: "0% 0%" }}
        transition={{
          repeat: Infinity,
          duration,
          repeatDelay: waitDuration,
          ease: "linear",
        }}
        style={{
          backgroundSize: "250% 100%",
          backgroundImage: `linear-gradient(90deg,
            ${baseColor} 0%,
            ${baseColor} calc(50% - ${dynamicSpread}px),
            ${shimmerColor} 50%,
            ${baseColor} calc(50% + ${dynamicSpread}px),
            ${baseColor} 100%)`,
        }}
      >
        {children}
      </MotionComponent>
    </div>
  );
}
