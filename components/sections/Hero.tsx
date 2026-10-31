"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/data";
import { dur, ease, stagger } from "@/lib/motion";
/** One word split into letters that slide up from a mask, then lift on hover. */
function KineticWord({
  word,
  delay,
  className = "",
}: {
  word: string;
  delay: number;
  className?: string;
}) {
  return (
    // Padding gives descenders (y) and italic overhang room inside the mask; negative margin keeps line spacing.
    <span className={`-mb-[0.18em] inline-flex overflow-hidden pr-[0.1em] pb-[0.18em] ${className}`} aria-hidden>
      {word.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block will-change-transform"
          initial={{ y: "110%", rotate: 8 }}
          animate={{ y: "0%", rotate: 0 }}
          transition={{ duration: dur.hero, ease: ease.outExpo, delay: delay + i * stagger.letters }}
          whileHover={{ y: "-8%", rotate: -4, transition: { type: "spring", stiffness: 400, damping: 12 } }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

function RotatingLine() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % profile.rotatingLines.length), 2800);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <p className="text-body-lg text-muted sm:text-2xl">
      I{" "}
      <span className="relative inline-grid overflow-hidden align-bottom">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={i}
            className="text-gradient col-start-1 row-start-1 font-medium whitespace-nowrap"
            initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-100%", opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.7, ease: ease.outExpo }}
          >
            {profile.rotatingLines[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Name drifts up and fades as you scroll away.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const fade = (d: number) => ({
    initial: { opacity: 0, y: 24, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: dur.slow, ease: ease.outExpo, delay: d },
  });

  return (
    <section ref={ref} id="top" className="relative flex min-h-svh flex-col justify-center pt-28 pb-16">
      <motion.div style={{ y, opacity }} className="container-page">
        <motion.p {...fade(0.1)} className="label-mono mb-8 flex items-center gap-3 text-muted">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          {profile.role} — {profile.location}
        </motion.p>

        <div className="flex items-center justify-between gap-8">
          <h1 className="font-serif text-display-xl" aria-label={`${profile.firstName} ${profile.lastName}`}>
            <KineticWord word={profile.firstName} delay={0.2} />
            <br />
            <KineticWord word={profile.lastName} delay={0.45} className="text-gradient italic" />
          </h1>

          <motion.div
            {...fade(0.7)}
            className="relative hidden aspect-[32/34] w-[clamp(240px,28vw,360px)] shrink-0 lg:block"
          >
            {/* Dark theme only: brand glow behind the figure so the dark hoodie/desk read against the bg */}
            <div
              aria-hidden
              className="absolute inset-[-15%] -z-10 hidden bg-[radial-gradient(ellipse_at_40%_35%,color-mix(in_srgb,var(--violet)_45%,transparent),transparent_60%),radial-gradient(ellipse_at_65%_75%,color-mix(in_srgb,var(--cyan)_30%,transparent),transparent_60%)] blur-2xl dark:block"
            />
            {/* Animated illustration (background removed); dark theme adds a thin rim light */}
            <Image
              src="/coder.webp"
              alt=""
              width={299}
              height={370}
              unoptimized
              fetchPriority="high"
              className="size-full object-contain dark:[filter:drop-shadow(0_0_1px_rgb(210_200_255/0.7))_drop-shadow(0_0_10px_rgb(124_58_237/0.35))]"
            />
          </motion.div>
        </div>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:items-end">
          <motion.div {...fade(0.9)} className="md:col-span-7">
            <RotatingLine />
          </motion.div>

          <motion.div {...fade(1.05)} className="md:col-span-5 md:justify-self-end">
            <p className="max-w-sm text-muted">{profile.intro}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#work"
                className="rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-medium text-white shadow-[0_0_60px_-15px_var(--violet)] transition-transform hover:scale-[1.04]"
              >
                View my work
              </a>
              <a
                href={profile.resumeUrl}
                download
                className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-text"
              >
                Download résumé
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to About"
        className="label-mono absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-subtle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-border">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-[image:var(--gradient-brand)]"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
