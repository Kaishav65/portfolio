"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

/**
 * Paragraphs start dim; scroll lights them up word by word, one continuous
 * sweep across all paragraphs in order.
 */
export function ScrollText({ paragraphs, className }: { paragraphs: string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.5"] });

  const words = paragraphs.map((p) => p.split(" "));
  const total = words.reduce((n, w) => n + w.length, 0);
  let k = 0;

  return (
    <div ref={ref} className={className}>
      {words.map((ws, i) => (
        <p key={i} className="text-body-lg text-text">
          {ws.map((w, j) => {
            const start = k++ / total;
            return (
              <span key={j}>
                {reduce ? w : <Word progress={scrollYProgress} range={[start, start + 1 / total]}>{w}</Word>}
                {j < ws.length - 1 && " "}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.3, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}
