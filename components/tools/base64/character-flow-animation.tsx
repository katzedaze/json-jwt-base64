"use client";

import { motion, useReducedMotion } from "framer-motion";

const MAX_ANIMATED_CHARS = 100;

interface CharacterFlowAnimationProps {
  text: string;
  direction?: "encode" | "decode";
}

export function CharacterFlowAnimation({
  text,
  direction = "encode",
}: CharacterFlowAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <span className="font-mono break-all whitespace-pre-wrap">{text}</span>;
  }

  const animatedPart = text.slice(0, MAX_ANIMATED_CHARS);
  const remainingPart = text.slice(MAX_ANIMATED_CHARS);
  const xOffset = direction === "encode" ? -20 : 20;

  return (
    <motion.span
      className="font-mono break-all whitespace-pre-wrap"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.02,
          },
        },
      }}
    >
      {animatedPart.split("").map((char, i) => (
        <motion.span
          key={`${i}-${char}`}
          variants={{
            hidden: { opacity: 0, x: xOffset },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.15, ease: "easeOut" },
            },
          }}
        >
          {char}
        </motion.span>
      ))}
      {remainingPart && <span>{remainingPart}</span>}
    </motion.span>
  );
}
