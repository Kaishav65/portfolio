"use client";

import { motion, useReducedMotion, type TargetAndTransition, type Transition } from "motion/react";

// Code chips that float up from the laptop while typing.
const CHIPS = [
  { label: "tsx", x: 214, color: "var(--violet)", delay: 0 },
  { label: "sql", x: 246, color: "var(--blue)", delay: 1.1 },
  { label: "py", x: 222, color: "var(--cyan)", delay: 2.2 },
  { label: "</>", x: 250, color: "var(--violet)", delay: 3.3 },
];

const SKIN = "#f1c7a3";
const HAIR = "#1c1a2e";

/** Stylised "engineer at a standing desk" — brand-tinted SVG, theme-aware, idle-looping. */
export function HeroVisual() {
  const reduce = useReducedMotion();
  // Looping animations switch off entirely under reduced motion.
  const loop = (animate: TargetAndTransition, transition: Transition) =>
    reduce ? {} : { animate, transition: { repeat: Infinity, ...transition } };

  return (
    <svg viewBox="0 0 320 340" className="size-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="hero-hoodie" x1="110" y1="90" x2="210" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--violet)" />
          <stop offset="1" stopColor="var(--blue)" />
        </linearGradient>
        <radialGradient id="hero-halo">
          <stop offset="0" stopColor="var(--violet)" stopOpacity="0.35" />
          <stop offset="0.55" stopColor="var(--cyan)" stopOpacity="0.12" />
          <stop offset="1" stopColor="var(--cyan)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glow behind the figure instead of a background */}
      <motion.circle cx="160" cy="150" r="150" fill="url(#hero-halo)" {...loop({ scale: [1, 1.06, 1] }, { duration: 6, ease: "easeInOut" })} />
      <ellipse cx="160" cy="322" rx="135" ry="7" fill="var(--text)" opacity="0.07" />

      {/* Floating code chips */}
      {!reduce &&
        CHIPS.map((c) => (
          <motion.g
            key={c.label}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 1, 0], y: [0, -40, -75, -100] }}
            transition={{ duration: 4.4, repeat: Infinity, delay: c.delay, ease: "easeOut" }}
          >
            <rect x={c.x - 15} y="102" width="30" height="16" rx="8" fill="var(--surface)" stroke={c.color} strokeWidth="1" />
            <text x={c.x} y="113" textAnchor="middle" fill={c.color} fontSize="8" fontFamily="var(--font-mono)">
              {c.label}
            </text>
          </motion.g>
        ))}

      {/* Legs + shoes (behind desk) */}
      <rect x="133" y="180" width="22" height="130" rx="8" fill="var(--surface-2)" stroke="var(--text-subtle)" strokeOpacity="0.5" />
      <rect x="159" y="180" width="22" height="130" rx="8" fill="var(--surface-2)" stroke="var(--text-subtle)" strokeOpacity="0.5" />
      <rect x="124" y="304" width="33" height="13" rx="6.5" fill="var(--text)" />
      <rect x="157" y="304" width="33" height="13" rx="6.5" fill="var(--text)" />

      {/* Upper body breathes */}
      <motion.g {...loop({ y: [0, -1.5, 0] }, { duration: 3.2, ease: "easeInOut" })}>
        {/* Torso */}
        <path d="M118,112 Q121,92 157,90 Q193,92 196,112 L200,188 L114,188 Z" fill="url(#hero-hoodie)" />
        <path d="M140,92 Q157,104 174,92" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="2" />
        <line x1="151" y1="100" x2="150" y2="126" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="163" y1="100" x2="164" y2="126" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" />

        {/* Upper arms */}
        <path d="M124,108 L128,154" stroke="var(--bg)" strokeOpacity="0.35" strokeWidth="20" strokeLinecap="round" />
        <path d="M124,108 L128,154" stroke="url(#hero-hoodie)" strokeWidth="17" strokeLinecap="round" />
        <path d="M190,108 L198,150" stroke="var(--bg)" strokeOpacity="0.35" strokeWidth="20" strokeLinecap="round" />
        <path d="M190,108 L198,150" stroke="url(#hero-hoodie)" strokeWidth="17" strokeLinecap="round" />

        {/* Forearms + hands typing, alternating */}
        <motion.g {...loop({ y: [0, -3, 0] }, { duration: 0.32, ease: "easeInOut" })}>
          <path d="M128,154 L172,170" stroke="var(--bg)" strokeOpacity="0.35" strokeWidth="18" strokeLinecap="round" />
          <path d="M128,154 L172,170" stroke="url(#hero-hoodie)" strokeWidth="15" strokeLinecap="round" />
          <circle cx="176" cy="172" r="6" fill={SKIN} />
        </motion.g>
        <motion.g {...loop({ y: [0, -3, 0] }, { duration: 0.32, ease: "easeInOut", delay: 0.16 })}>
          <path d="M198,150 L200,166" stroke="var(--bg)" strokeOpacity="0.35" strokeWidth="18" strokeLinecap="round" />
          <path d="M198,150 L200,166" stroke="url(#hero-hoodie)" strokeWidth="15" strokeLinecap="round" />
          <circle cx="200" cy="171" r="6" fill={SKIN} />
        </motion.g>

        {/* Neck + head */}
        <rect x="150" y="80" width="14" height="14" rx="4" fill={SKIN} />
        <motion.g {...loop({ rotate: [0, 2.5, 0] }, { duration: 4, ease: "easeInOut" })}>
          <circle cx="137" cy="66" r="5" fill={SKIN} />
          <ellipse cx="157" cy="63" rx="20" ry="23" fill={SKIN} />
          <path
            d="M135,64 Q130,36 156,34 Q184,33 181,62 Q177,50 166,48 Q158,54 148,50 Q140,52 138,64 Z"
            fill={HAIR}
          />
          {[150, 166].map((cx) => (
            <motion.ellipse
              key={cx}
              cx={cx}
              cy="67"
              rx="2"
              ry="2.6"
              fill={HAIR}
              {...loop({ scaleY: [1, 1, 0.1, 1] }, { duration: 4.5, times: [0, 0.92, 0.96, 1] })}
            />
          ))}
          <path d="M152,77 Q158,81 164,77" fill="none" stroke="#b5735a" strokeWidth="1.6" strokeLinecap="round" />
        </motion.g>
      </motion.g>

      {/* Laptop (back of the screen faces us) */}
      <rect x="166" y="175" width="102" height="5" rx="2" fill="var(--text-subtle)" />
      <path d="M194,177 L204,122 L272,122 L264,177 Z" fill="var(--text-muted)" />
      <motion.circle
        cx="234"
        cy="149"
        r="4.5"
        fill="var(--cyan)"
        style={{ filter: "drop-shadow(0 0 6px var(--cyan))" }}
        {...loop({ opacity: [0.6, 1, 0.6] }, { duration: 2.4, ease: "easeInOut" })}
      />

      {/* Plant + pen cup */}
      <motion.g
        style={{ originX: "50%", originY: "100%" }}
        {...loop({ rotate: [-3, 3, -3] }, { duration: 5, ease: "easeInOut" })}
      >
        <path d="M74,160 Q58,150 56,134 Q70,138 74,160 Z" fill="var(--success)" opacity="0.85" />
        <path d="M74,160 Q90,148 94,132 Q78,138 74,160 Z" fill="var(--cyan)" opacity="0.9" />
        <path d="M74,160 Q72,140 76,124 Q84,142 74,160 Z" fill="var(--success)" />
      </motion.g>
      <rect x="63" y="158" width="22" height="22" rx="4" fill="var(--surface)" stroke="var(--text-subtle)" />
      <line x1="102" y1="166" x2="99" y2="150" stroke="var(--violet)" strokeWidth="2" strokeLinecap="round" />
      <line x1="106" y1="166" x2="109" y2="152" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" />
      <rect x="96" y="162" width="16" height="18" rx="3" fill="var(--text-subtle)" />

      {/* Standing desk */}
      <rect x="28" y="180" width="264" height="10" rx="4" fill="var(--surface-2)" stroke="var(--text-subtle)" />
      <rect x="48" y="190" width="224" height="6" fill="var(--text-subtle)" opacity="0.6" />
      <rect x="58" y="190" width="9" height="128" rx="2" fill="var(--text-subtle)" />
      <rect x="253" y="190" width="9" height="128" rx="2" fill="var(--text-subtle)" />
      <rect x="42" y="315" width="41" height="5" rx="2.5" fill="var(--text-subtle)" />
      <rect x="237" y="315" width="41" height="5" rx="2.5" fill="var(--text-subtle)" />
    </svg>
  );
}
