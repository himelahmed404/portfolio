import { Reveal } from "@/components/ui/Reveal";
import { ShotPlaceholder } from "@/components/ui/ShotPlaceholder";
import type { SiteContent } from "@/lib/types";

const STATS = [
  { num: "550+", label: "MUPI CLUB MEMBERS LED" },
  { num: "200+", label: "TECHFEST ATTENDEES" },
  { num: "130+", label: "STUDENTS TAUGHT" },
];

export function OperatorSection({ site }: { site: SiteContent }) {
  return (
    <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 items-center gap-8 layout:grid-cols-[minmax(0,360px)_1fr] layout:gap-14">
      <Reveal className="w-full max-w-[360px] justify-self-start">
        <ShotPlaceholder src="/himel.png" alt={`Portrait of ${site.name}`} label="Add public/himel.png" aspect="4/5" rounded="lg" />
        <div className="mt-2.5 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">
          {site.location.toUpperCase()} · GMT+6
        </div>
      </Reveal>
      <div>
        <Reveal className="mb-[18px] font-mono text-[11px] font-medium tracking-[0.14em] text-teal-500">OPERATOR</Reveal>
        <Reveal delay={0.06} className="mb-3.5 text-lg leading-[1.6] text-ink-100 text-pretty">
          I&apos;m in Dhaka, partway through a diploma in Computer Science &amp; Technology at Munshiganj Polytechnic
          Institute. I build the product and then I try to break it — the same instinct that shipped Toolify3D&apos;s
          quoting engine is the one that found an OTP sitting in someone else&apos;s registration response.
        </Reveal>
        <Reveal delay={0.12} className="mb-3.5 text-base leading-[1.65] text-ink-300 text-pretty">
          I&apos;m vice president of the MUPI Computer Club — 550+ members, CTF and security training for 70+ students
          across three sessions, and an inter-polytechnic TechFest with 200+ attendees. At NBA Cyber-Cell I&apos;m lead
          developer on the harassment reporting platform and I speak on digital hygiene to school groups; 130+
          students so far.
        </Reveal>
        <Reveal delay={0.18} className="text-base leading-[1.65] text-ink-300 text-pretty">
          What I want next: a full-stack role where security review is part of shipping, not a separate team&apos;s
          ticket.
        </Reveal>
        <Reveal delay={0.24} className="mt-6 flex flex-wrap gap-6 border-t border-ink-600 pt-5">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-mono text-[clamp(18px,2vw,22px)] font-medium text-ink-100">{s.num}</div>
              <div className="mt-1 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">{s.label}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
