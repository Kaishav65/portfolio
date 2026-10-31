"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/data";

const fmt = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

/** Live Bengaluru time; renders a placeholder on the server to avoid hydration mismatch. */
function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(fmt.format(new Date()));
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  return <span className="tabular-nums">{time ?? "--:--"}</span>;
}

export function Footer() {
  return (
    <footer className="container-page flex flex-col gap-3 border-t border-border py-8 font-mono text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
      <span>
        © {profile.firstName} {profile.lastName}
      </span>
      <span>Built with Next.js, Tailwind & Motion</span>
      <span>
        Bengaluru · <LocalTime /> IST
      </span>
    </footer>
  );
}
