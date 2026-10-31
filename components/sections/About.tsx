import { metrics, profile } from "@/content/data";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function About() {
  const { education: edu } = profile;

  return (
    <section id="about" className="container-page py-[clamp(6rem,15vh,12rem)]">
      <SectionHeader index="01" label="About" before="Engineering that makes" accent="robots" after=" legible." />

      <div className="grid gap-12 md:grid-cols-12">
        <div className="space-y-6 md:col-span-7">
          {profile.about.map((p, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <p className={`text-body-lg ${i === 0 ? "text-text" : "text-muted"}`}>{p}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="md:col-span-4 md:col-start-9">
          <div className="glass rounded-lg p-6">
            <p className="label-mono mb-4 text-subtle">Education</p>
            <p className="font-serif text-2xl leading-tight">{edu.school}</p>
            <p className="mt-2 text-muted">{edu.degree}</p>
            <div className="mt-6 flex justify-between border-t border-border pt-4 font-mono text-sm text-muted">
              <span>{edu.period}</span>
              <span className="text-gradient">{edu.grade}</span>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-20 grid grid-cols-2 gap-4 md:mt-28 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <Reveal key={m.label} delay={i * 0.08}>
            <div className="glass group relative h-full overflow-hidden rounded-lg p-6 md:p-8">
              {/* Hover glow */}
              <div className="absolute -right-10 -bottom-10 size-32 rounded-full bg-[image:var(--gradient-brand)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40" />
              <Counter
                value={m.value}
                decimals={m.decimals}
                suffix={m.suffix}
                className="text-gradient block font-serif text-display-md"
              />
              <p className="label-mono mt-4 text-subtle">{m.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
