"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  x?: number;
  y?: number;
  className?: string;
};

export function FadeIn({
  children,
  delay = 0,
  x = 0,
  y = 24,
  className,
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
