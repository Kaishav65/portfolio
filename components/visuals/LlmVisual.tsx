"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { ease } from "@/lib/motion";
import { Badge, Frame, TypeText } from "./Frame";

const NODES = [
  { label: "Prompt", icon: "✎" },
  { label: "LLM Agent", icon: "✦" },
  { label: "MCP Validate", icon: "◈" },
  { label: "Deliver", icon: "➤" },
];
// Which nodes are active / done at each step.
const ACTIVE = [[0, 1], [1, 2], [3]];

const PROMPT = "Weekly robot utilization by site for the last 30 days — top 5 sites.";
const SQL = `SELECT s.name, AVG(t.utilization) AS util
FROM trips t JOIN sites s ON s.id = t.site_id
WHERE t.started_at > now() - interval '30 days'
GROUP BY s.name ORDER BY util DESC LIMIT 5;`;

function Connector({ live }: { live: boolean }) {
  return (
    <div className="relative h-px flex-1 overflow-hidden bg-border">
      {live && (
        <motion.span
          className="absolute inset-y-0 w-1/3 bg-(--accent)"
          style={{ boxShadow: "0 0 8px var(--accent)" }}
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}

function PromptPanel() {
  return (
    <div className="space-y-3">
      <div className="rounded-md border border-border bg-surface-2/70 p-3">
        <p className="mb-1.5 font-mono text-[9px] text-subtle uppercase sm:text-[10px]">User · natural language</p>
        <p className="text-xs leading-relaxed sm:text-base">
          <TypeText text={PROMPT} delay={300} />
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4 }}
        className="flex flex-wrap items-center gap-2 font-mono text-[9px] text-muted sm:text-[10px]"
      >
        <span className="rounded-full border border-(--accent)/50 px-2 py-0.5 text-(--accent)">memory</span>
        recalled schema: trips, sites · prior report prefs
      </motion.div>
    </div>
  );
}

const LOG = [
  { at: 2600, tone: "text-danger", text: '✕ ERROR column "site" does not exist' },
  { at: 3400, tone: "text-muted", text: "↻ self-heal: retry with schema context…" },
  { at: 4300, tone: "text-success", text: "✓ valid · 5 rows · 84 ms" },
];

function SqlPanel() {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const ids = LOG.map((l, i) => setTimeout(() => setShown(i + 1), l.at));
    return () => ids.forEach(clearTimeout);
  }, [reduce]);

  const count = reduce ? LOG.length : shown;
  return (
    <div className="space-y-2">
      <pre className="overflow-hidden rounded-md border border-border bg-surface-2/70 p-3 font-mono text-[8.5px] leading-relaxed whitespace-pre-wrap text-muted sm:text-[12px]">
        <TypeText text={SQL} speed={12} delay={200} />
      </pre>
      <ul className="min-h-[4.5em] space-y-1 font-mono text-[9px] sm:text-[11.5px]">
        {LOG.slice(0, count).map((l) => (
          <motion.li key={l.text} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className={l.tone}>
            {l.text}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

const CHANNELS = ["Email", "Webhook", "Chat"];

function DeliverPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
      <div className="space-y-2">
        <span className="inline-block rounded-full border border-border px-2 py-0.5 font-mono text-[9px] text-muted sm:text-[10px]">
          ⏰ cron · Mon 09:00
        </span>
        <div className="rounded-md border border-border bg-surface-2/70 p-2.5 sm:p-3">
          <p className="mb-2 font-mono text-[9px] text-subtle uppercase sm:text-[10px]">Utilization report</p>
          {[92, 81, 74, 66, 58].map((w, i) => (
            <motion.div
              key={i}
              className="mb-1 h-1.5 origin-left rounded-full bg-(--accent) sm:h-2"
              style={{ width: `${w}%`, opacity: 1 - i * 0.13 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: ease.outExpo, delay: 0.2 + i * 0.07 }}
            />
          ))}
        </div>
      </div>

      {/* Fan-out lines */}
      <svg viewBox="0 0 40 90" className="h-24 w-8 sm:h-28 sm:w-10">
        {[15, 45, 75].map((y, i) => (
          <motion.path
            key={y}
            d={`M0,45 C20,45 20,${y} 40,${y}`}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
          />
        ))}
      </svg>

      <div className="space-y-2">
        {CHANNELS.map((c, i) => (
          <motion.div
            key={c}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + i * 0.15 }}
            className="flex items-center justify-between rounded-md border border-border bg-surface-2/70 px-2.5 py-1.5 text-[10px] sm:text-xs"
          >
            {c}
            <motion.span
              className="text-success"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3 + i * 0.2, type: "spring", stiffness: 400, damping: 15 }}
            >
              ✓
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function LlmVisual({ step }: { step: number }) {
  const active = ACTIVE[step];
  const done = (i: number) => i < Math.min(...active);

  return (
    <Frame url="n8n / reporting-agent">
      <div
        className="absolute inset-0 flex flex-col gap-4 p-3 sm:gap-6 sm:p-5"
        style={{ backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
      >
        {/* Workflow graph */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {NODES.map((n, i) => {
            const on = active.includes(i);
            return (
              <div key={n.label} className="contents">
                <motion.div
                  initial={false}
                  animate={{
                    borderColor: on ? "var(--accent)" : "var(--border)",
                    boxShadow: on ? "0 0 24px -6px var(--accent)" : "0 0 0 0 transparent",
                  }}
                  className="flex shrink-0 flex-col items-center gap-1 rounded-md border bg-surface-2/80 px-1.5 py-1.5 sm:px-3 sm:py-2"
                >
                  <span className={`text-sm sm:text-base ${on ? "text-(--accent)" : done(i) ? "text-success" : "text-subtle"}`}>
                    {done(i) ? "✓" : n.icon}
                  </span>
                  <span className="font-mono text-[8px] whitespace-nowrap text-muted sm:text-[10px]">{n.label}</span>
                </motion.div>
                {i < NODES.length - 1 && <Connector live={on && active.includes(i + 1)} />}
              </div>
            );
          })}
        </div>

        {/* Step detail */}
        <div className="relative flex min-h-0 flex-1 flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: ease.outExpo }}
            >
              {step === 0 && <PromptPanel />}
              {step === 1 && <SqlPanel />}
              {step === 2 && <DeliverPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="pointer-events-none absolute right-3 bottom-3 flex flex-col items-end gap-2 sm:right-5 sm:bottom-5">
        <AnimatePresence mode="popLayout">
          {step === 1 && <Badge key="s">95% query success</Badge>}
          {step === 2 && <Badge key="u">100+ users</Badge>}
          {step === 2 && <Badge key="e" delay={0.15}>−65% query errors</Badge>}
        </AnimatePresence>
      </div>
    </Frame>
  );
}
