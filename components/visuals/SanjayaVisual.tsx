"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ease } from "@/lib/motion";
import { Badge, Frame } from "./Frame";

// Deterministic mock data (NDA-safe, purely illustrative).
const LINE = [30, 42, 38, 55, 48, 62, 58, 70, 66, 78, 74, 86];
const BARS = [40, 65, 50, 80, 70, 92, 60];
const HEAT = Array.from({ length: 4 * 14 }, (_, i) => 0.15 + (((i * 37) % 11) / 11) * 0.85);

const linePath = LINE.map((v, i) => `${i === 0 ? "M" : "L"}${(i / (LINE.length - 1)) * 300},${100 - v}`).join(" ");
const areaPath = `${linePath} L300,100 L0,100 Z`;

const panel = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: ease.outExpo, delay: i * 0.08 } }),
};

function Panel({ i, className = "", children }: { i: number; className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      custom={i}
      variants={panel}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={`rounded-md border border-border bg-surface-2/60 p-2.5 sm:p-3 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Skeleton({ w = "60%" }: { w?: string }) {
  return <div className="h-3 animate-pulse rounded bg-border" style={{ width: w }} />;
}

export function SanjayaVisual({ step }: { step: number }) {
  const drawn = step >= 1;
  const live = step >= 2;

  // Live ticker for the trips KPI.
  const [trips, setTrips] = useState(1284);
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setTrips((t) => t + 1), 900);
    return () => clearInterval(id);
  }, [live]);

  const kpis = [
    { label: "Trips today", value: trips.toLocaleString("en-US") },
    { label: "Distance", value: "312 km" },
    { label: "Utilization", value: "87%" },
  ];

  return (
    <Frame url="sanjaya.analytics / fleet">
      <div className="absolute inset-0 grid grid-cols-1 gap-3 p-3 sm:grid-cols-[36px_1fr] sm:p-4">
        {/* Sidebar */}
        <Panel i={0} className="hidden flex-col items-center gap-3 !p-2 sm:flex">
          {[0, 1, 2, 3, 4].map((n) => (
            <span key={n} className={`size-5 rounded-md ${n === 0 ? "bg-(--accent)" : "bg-border"}`} />
          ))}
        </Panel>

        <div className="grid min-h-0 grid-rows-[auto_auto_1fr] gap-2.5 sm:grid-rows-[auto_auto_1fr_auto] sm:gap-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="font-serif text-lg leading-none sm:text-xl">Fleet overview</span>
            <AnimatePresence>
              {live && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-2 py-0.5 font-mono text-[10px] text-success"
                >
                  <span className="size-1.5 animate-ping rounded-full bg-success" /> LIVE
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {kpis.map((k, i) => (
              <Panel key={k.label} i={i + 1}>
                <p className="truncate font-mono text-[9px] text-subtle uppercase sm:text-[10px]">{k.label}</p>
                <div className="mt-1.5 h-5 sm:h-6">
                  {drawn ? (
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-serif text-base leading-none tabular-nums sm:text-xl"
                    >
                      {k.value}
                    </motion.p>
                  ) : (
                    <Skeleton />
                  )}
                </div>
              </Panel>
            ))}
          </div>

          {/* Charts */}
          <div className="grid min-h-0 grid-cols-[1.6fr_1fr] gap-2 sm:gap-3">
            <Panel i={4} className="flex min-h-0 flex-col">
              <p className="font-mono text-[9px] text-subtle uppercase sm:text-[10px]">Trips / hour</p>
              <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="mt-2 min-h-0 w-full flex-1 overflow-visible">
                <defs>
                  <linearGradient id="sj-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[25, 50, 75].map((y) => (
                  <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="var(--border)" strokeDasharray="3 4" />
                ))}
                <motion.path
                  d={areaPath}
                  fill="url(#sj-area)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: drawn ? 1 : 0 }}
                  transition={{ duration: 0.8, delay: drawn ? 0.6 : 0 }}
                />
                <motion.path
                  d={linePath}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: drawn ? 1 : 0, opacity: drawn ? 1 : 0 }}
                  transition={{ duration: 1.2, ease: ease.inOut }}
                />
              </svg>
            </Panel>

            <Panel i={5} className="flex min-h-0 flex-col">
              <p className="font-mono text-[9px] text-subtle uppercase sm:text-[10px]">By robot</p>
              <div className="mt-2 flex min-h-0 flex-1 items-end gap-1 sm:gap-1.5">
                {BARS.map((h, i) => (
                  <motion.span
                    key={i}
                    className="flex-1 origin-bottom rounded-t-sm"
                    style={{
                      height: `${h}%`,
                      background: "linear-gradient(to top, color-mix(in srgb, var(--accent) 30%, transparent), var(--accent))",
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: drawn ? 1 : 0.06 }}
                    transition={{ duration: 0.8, ease: ease.outExpo, delay: drawn ? 0.2 + i * 0.06 : 0 }}
                  />
                ))}
              </div>
            </Panel>
          </div>

          {/* Utilization heatmap */}
          <Panel i={6} className="hidden sm:block">
            <p className="mb-2 font-mono text-[10px] text-subtle uppercase">Utilization heatmap</p>
            <div className="grid grid-cols-14 gap-1">
              {HEAT.map((v, i) => (
                <motion.span
                  key={i}
                  className="h-2.5 rounded-[3px] bg-(--accent)"
                  initial={{ opacity: 0.06 }}
                  animate={{ opacity: drawn ? v : 0.06 }}
                  transition={{ duration: 0.4, delay: drawn ? 0.4 + (i % 14) * 0.03 + Math.floor(i / 14) * 0.05 : 0 }}
                />
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* Floating impact badges */}
      <div className="pointer-events-none absolute right-3 bottom-3 flex flex-col items-end gap-2 sm:right-5 sm:bottom-5">
        <AnimatePresence mode="popLayout">
          {step === 1 && <Badge key="load">⚡ Load time −40%</Badge>}
          {live && <Badge key="users">● 1000+ active users</Badge>}
          {live && <Badge key="up" delay={0.15}>99.9% uptime</Badge>}
        </AnimatePresence>
      </div>
    </Frame>
  );
}
