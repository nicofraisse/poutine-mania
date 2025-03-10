"use client";
import React, { useMemo, type JSX } from "react";
import { motion } from "motion/react";
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
  const MotionComponent = motion.create(
    Component as keyof JSX.IntrinsicElements
  );

  const dynamicSpread = useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Text shadow layer (positioned behind) */}
      <span
        className="absolute inset-0 z-0"
        style={{
          textShadow,
          color: "transparent", // Make the text itself transparent
        }}
        aria-hidden="true"
      >
        {children}
      </span>

      {/* Shimmer effect layer (in front) */}
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
