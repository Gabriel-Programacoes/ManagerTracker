"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ChalkboardRevealCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0, y: 8 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`group relative overflow-hidden tactical-panel ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <svg viewBox="0 0 300 140" className="h-full w-full">
            <motion.path
              d="M20 110 Q80 30 140 70 T280 45"
              stroke="#92dce5"
              strokeWidth="1.5"
              fill="none"
              initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
              whileHover={reduce ? undefined : { pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <motion.circle
              cx="78"
              cy="63"
              r="4"
              stroke="#52dee5"
              strokeWidth="1"
              fill="none"
              initial={reduce ? undefined : { scale: 0.8, opacity: 0 }}
              whileHover={reduce ? undefined : { scale: 1, opacity: 0.2 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
            <motion.path
              d="M185 96 L230 62"
              stroke="#92dce5"
              strokeWidth="1.5"
              fill="none"
              initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
              whileHover={reduce ? undefined : { pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            />
          </svg>
      </div>
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
