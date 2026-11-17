import Link from "next/link";
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
    <div className="mx-auto grid w-full max-w-275 mt-8 sm:mt-10 grid-cols-1 items-center gap-8 layout:grid-cols-[minmax(0,360px)_1fr] layout:gap-14">
      <Reveal className="w-full max-w-90 justify-self-start">
        <div className="group overflow-hidden rounded-xl border border-ink-600 bg-ink-800 transition-[border-color,box-shadow] duration-300 hover:border-teal-500/50 hover:shadow-[0_12px_36px_rgba(0,0,0,0.4),0_0_20px_rgba(79,151,163,0.1)]">
          <ShotPlaceholder
            src="/profile/Himel.png"
            alt={`Portrait of ${site.name}`}
            label="Add public/himel.png"
            aspect="4/5"
            rounded="lg"
          />
        </div>
        <div className="mt-2.5 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">
          {site.location.toUpperCase()} · GMT+6
        </div>
      </Reveal>
      <div>
        <Reveal className="mb-4.5 font-mono text-[11px] font-medium tracking-[0.14em] text-teal-500">OPERATOR</Reveal>
        <Reveal delay={0.06} className="mb-3.5 text-lg leading-[1.6] text-ink-100 text-pretty">
          I&apos;m a full-stack developer in Dhaka. I build the product, then I try to break it. That second
          habit is how I found a verification code sitting in a registration response, where anyone watching
          could read it.
        </Reveal>
        <Reveal delay={0.12} className="mb-3.5 text-base leading-[1.65] text-ink-300 text-pretty">
          I&apos;m vice president of the MUPI Computer Club, which has over 550 members. I have run CTF and
          security training for 70+ students across three sessions, and an inter-polytechnic TechFest that
          drew over 200 people. At NBA Cyber-Cell I&apos;m lead developer on the harassment reporting
          platform, and I speak to college groups about digital safety — 130+ students so far.
        </Reveal>
        <Reveal delay={0.18} className="text-base leading-[1.65] text-ink-300 text-pretty">
          What I want next is a full-stack role where security review is part of shipping, not another
          team&apos;s ticket. I&apos;m partway through a diploma in Computer Science, though most of what I
          know came from building things and then testing them. I shoot{" "}
          <Link href="/frame" className="font-medium text-teal-400 underline decoration-teal-500/40 underline-offset-4 transition-colors hover:text-teal-200 hover:decoration-teal-400">
            nature and macro
          </Link>{" "}
          when I&apos;m not at a keyboard.
        </Reveal>
        <Reveal delay={0.24} className="mt-6 flex flex-wrap gap-4 border-t border-ink-600/80 pt-5">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="group/stat rounded-lg border border-ink-700/60 bg-ink-800/60 px-4 py-3 transition-[border-color,transform] duration-200 hover:border-teal-500/40 hover:-translate-y-0.5"
            >
              <div className="font-mono text-[clamp(18px,2vw,22px)] font-semibold text-teal-400 tabular-nums transition-colors group-hover/stat:text-teal-300">
                {s.num}
              </div>
              <div className="mt-1 font-mono text-[10px] font-medium tracking-[0.14em] text-ink-400">
                {s.label}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
