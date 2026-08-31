"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type FloatCardProps = {
  children: ReactNode;
  delay?: number;
  floatDuration?: number;
  className?: string;
};

export function FloatCard({
  children,
  delay = 0,
  floatDuration = 3.5,
  className,
}: FloatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: floatDuration,
          delay: delay + 0.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
