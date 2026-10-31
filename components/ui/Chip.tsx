export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="label-mono inline-flex items-center rounded-full border border-border bg-surface/40 px-3 py-1.5 text-[11px] tracking-[0.08em] text-muted normal-case transition-[color,border-color,box-shadow] duration-300 hover:border-violet/60 hover:text-text hover:shadow-[0_0_24px_-6px_var(--violet)]">
      {children}
    </span>
  );
}
