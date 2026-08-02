import stackData from "@/content/stack.json";
import experienceData from "@/content/experience.json";
import type { ExperienceItem, StackGroup } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { Chip } from "@/components/ui/Chip";

const stackGroups = stackData as StackGroup[];
const { items: experience, certifications } = experienceData as {
  items: ExperienceItem[];
  certifications: string[];
};

export function StackSection() {
  return (
    <div className="mx-auto grid max-w-[1200px] mt-8 sm:mt-10 grid-cols-1 items-start gap-8 layout:grid-cols-2 layout:gap-14">
      <div>
        <Reveal className="mb-[18px] font-mono text-[11px] font-medium tracking-[0.14em] text-teal-500">STACK</Reveal>
        <div className="flex flex-col gap-4">
          {stackGroups.map((group, i) => (
            <Reveal key={group.label} delay={0.06 + i * 0.06}>
              <div className="mb-2 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">
                {group.label}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div>
        <Reveal className="mb-[18px] font-mono text-[11px] font-medium tracking-[0.14em] text-teal-500">
          EXPERIENCE
        </Reveal>
        <div className="flex flex-col">
          {experience.map((item, i) => (
            <Reveal
              key={item.title}
              delay={0.06 + i * 0.06}
              className={`border-b border-ink-600 py-4 ${i === 0 ? "pt-0" : ""}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h4 className="m-0 font-display text-[21px] font-medium leading-[1.3] text-ink-100">{item.title}</h4>
                <span className="flex-none font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">
                  {item.date}
                </span>
              </div>
              <p className="m-0 mt-1.5 text-base leading-[1.6] text-ink-300 text-pretty">{item.description}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.06 + experience.length * 0.06} className="mt-5">
          <div className="mb-2.5 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">
            CERTIFICATIONS
          </div>
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {certifications.map((c) => (
              <li key={c} className="text-sm leading-[1.5] text-ink-300">
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}
