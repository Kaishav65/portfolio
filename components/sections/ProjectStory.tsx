"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import type { projects as Projects } from "@/content/data";
import { Chip } from "@/components/ui/Chip";
import { LlmVisual } from "@/components/visuals/LlmVisual";
import { MtsVisual } from "@/components/visuals/MtsVisual";
import { SanjayaVisual } from "@/components/visuals/SanjayaVisual";
import { ease } from "@/lib/motion";

type Project = (typeof Projects)[number];

const VISUALS = { sanjaya: SanjayaVisual, mts: MtsVisual, llm: LlmVisual };
const AUTOPLAY_MS = 3000;
const TICK_MS = 250;

/**
 * Scroll-pinned case study: the outer block is tall, the inner block is sticky.
 * Scroll progress through the outer block selects the active step, which drives
 * both the text highlight and the animated visual.
 */
export function ProjectStory({ project, total }: { project: Project; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const n = project.steps.length;

  const idle = useRef(0); // ms the user has been idle while this story is pinned
  const scrollStep = useRef(0); // step implied by the current scroll position
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    idle.current = 0;
    // Only take over when scroll crosses into another step's range, so tiny layout-induced
    // scroll shifts (e.g. scroll anchoring when step text reflows on small screens) don't reset autoplay.
    const s = Math.min(n - 1, Math.max(0, Math.floor(p * n)));
    if (s === scrollStep.current) return;
    scrollStep.current = s;
    setStep(s);
  });

  // Autoplay: while the story is pinned and the user is idle, cycle steps 1 → 2 → 3 → 1.
  // Only the displayed step changes (no page movement); any scroll or click takes back control.
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      const r = ref.current?.getBoundingClientRect();
      const pinned = r && r.top <= 1 && r.bottom >= window.innerHeight - 1;
      idle.current = pinned ? idle.current + TICK_MS : 0;
      if (idle.current < AUTOPLAY_MS) return;
      idle.current = 0;
      setStep((s) => (s + 1) % n);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [n, reduce]);

  // Clicking a step scrolls to the middle of its scroll range, so scroll stays the single source of truth.
  const lenis = useLenis();
  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    idle.current = 0;
    setStep(i);
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + (el.offsetHeight - window.innerHeight) * ((i + 0.5) / n);
    if (lenis) lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

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
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={on ? "step" : undefined}
                      className={`flex w-full cursor-pointer items-baseline gap-3 text-left font-medium transition-colors duration-500 ${on ? "text-text" : "text-subtle hover:text-muted"}`}
                    >
                      <span className="font-mono text-xs text-(--accent)">0{i + 1}</span>
                      {s.title}
                    </button>
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
