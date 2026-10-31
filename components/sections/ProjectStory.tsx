"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import type { projects as Projects } from "@/content/data";
import { Chip } from "@/components/ui/Chip";
import { LlmVisual } from "@/components/visuals/LlmVisual";
import { MtsVisual } from "@/components/visuals/MtsVisual";
import { SanjayaVisual } from "@/components/visuals/SanjayaVisual";
import { ease } from "@/lib/motion";

type Project = (typeof Projects)[number];

const VISUALS = { sanjaya: SanjayaVisual, mts: MtsVisual, llm: LlmVisual };

/**
 * Scroll-pinned case study: the outer block is tall, the inner block is sticky.
 * Scroll progress through the outer block selects the active step, which drives
 * both the text highlight and the animated visual.
 */
export function ProjectStory({ project, total }: { project: Project; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const n = project.steps.length;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setStep(Math.min(n - 1, Math.max(0, Math.floor(p * n))));
  });

  const Visual = VISUALS[project.id];

  return (
    <div
      ref={ref}
      className="relative"
      style={{ height: `calc(${n} * 90vh + 100svh)`, ["--accent" as string]: `var(--${project.color})` }}
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden pt-16">
        <div className="container-page grid items-center gap-6 lg:grid-cols-12 lg:gap-16">
          {/* Text */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            <p className="label-mono flex items-center gap-3 text-subtle">
              <span className="whitespace-nowrap text-(--accent)">
                {project.index} / {String(total).padStart(2, "0")}
              </span>
              <span className="hidden h-px w-8 bg-border sm:block" />
              {project.kicker}
            </p>
            <h3 className="mt-3 font-serif text-display-md lg:mt-4">{project.title}</h3>
            <div className="mt-4 hidden flex-wrap gap-2 sm:flex">
              {project.stack.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>

            <ol className="mt-5 lg:mt-10">
              {project.steps.map((s, i) => {
                const on = i === step;
                return (
                  <li
                    key={s.title}
                    className={`relative border-l py-2 pl-5 transition-colors duration-500 lg:py-3 ${
                      on ? "border-(--accent)" : "hidden border-border lg:block"
                    }`}
                  >
                    <p
                      className={`flex items-baseline gap-3 font-medium transition-colors duration-500 ${on ? "text-text" : "text-subtle"}`}
                    >
                      <span className="font-mono text-xs text-(--accent)">0{i + 1}</span>
                      {s.title}
                    </p>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: ease.outExpo }}
                          className="overflow-hidden text-sm text-muted sm:text-base"
                        >
                          <span className="block pt-2">{s.body}</span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ol>

            {/* Step progress (mobile shows this instead of the full list) */}
            <div className="mt-5 flex gap-1.5 lg:mt-8">
              {project.steps.map((s, i) => (
                <span
                  key={s.title}
                  className={`h-1 rounded-full transition-all duration-500 ${i === step ? "w-8 bg-(--accent)" : "w-3 bg-border"}`}
                />
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <Visual step={step} />
          </div>
        </div>
      </div>
    </div>
  );
}
