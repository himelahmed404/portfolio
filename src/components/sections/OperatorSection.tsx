"use client";

import { useRef, useCallback, type MouseEvent } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion, useMotionTemplate } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { ShotPlaceholder } from "@/components/ui/ShotPlaceholder";
import type { SiteContent } from "@/lib/types";

const STATS = [
  { num: "550+", label: "MUPI CLUB MEMBERS LED" },
  { num: "200+", label: "TECHFEST ATTENDEES" },
  { num: "130+", label: "STUDENTS TAUGHT" },
];

export function OperatorSection({ site }: { site: SiteContent }) {
  const photoRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 25 };
  const rotateX = useSpring(rawRotateX, springConfig);
  const rotateY = useSpring(rawRotateY, springConfig);
  const spotBg = useMotionTemplate`radial-gradient(280px circle at ${spotX}px ${spotY}px, rgba(79, 151, 163, 0.2), transparent 70%)`;

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (shouldReduceMotion || !photoRef.current) return;
      const rect = photoRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotX.set(x);
      spotY.set(y);
      const normX = x / rect.width - 0.5;
      const normY = y / rect.height - 0.5;
      rawRotateX.set(-normY * 8);
      rawRotateY.set(normX * 8);
    },
    [rawRotateX, rawRotateY, spotX, spotY, shouldReduceMotion]
  );

  const handleMouseLeave = useCallback(() => {
    rawRotateX.set(0);
    rawRotateY.set(0);
  }, [rawRotateX, rawRotateY]);

  return (
    <div className="mx-auto grid w-full max-w-275 mt-8 sm:mt-10 grid-cols-1 items-center gap-8 layout:grid-cols-[minmax(0,360px)_1fr] layout:gap-14">
      <Reveal className="w-full max-w-90 justify-self-start">
        <div style={{ perspective: 1000 }} className="relative z-10 overflow-visible">
          <motion.div
            ref={photoRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX: shouldReduceMotion ? 0 : rotateX,
              rotateY: shouldReduceMotion ? 0 : rotateY,
              transformStyle: "preserve-3d",
            }}
            whileHover={{ y: -4, zIndex: 20, transition: { type: "spring", stiffness: 350, damping: 24 } }}
            className="group relative overflow-hidden rounded-xl border border-ink-600 bg-ink-800 transition-[border-color,box-shadow] duration-300 hover:border-teal-500/60 hover:shadow-[0_16px_40px_rgba(0,0,0,0.45),0_0_24px_rgba(79,151,163,0.15)]"
          >
            {/* Dynamic specular light sheen */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px z-20 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: spotBg }}
            />

            <ShotPlaceholder
              src="/profile/Himel.png"
              alt={`Portrait of ${site.name}`}
              label="Add public/himel.png"
              aspect="4/5"
              rounded="lg"
            />
          </motion.div>
        </div>

        <div className="mt-2.5 flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-verified opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-verified" />
          </span>
          <span>{site.location.toUpperCase()} · GMT+6</span>
        </div>
      </Reveal>

      <div>
        <Reveal className="mb-4.5 flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.14em] text-teal-400">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(79,151,163,0.8)]" />
          <span>OPERATOR</span>
        </Reveal>
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
          <Link
            href="/frame"
            className="font-medium text-teal-400 underline decoration-teal-500/40 underline-offset-4 transition-colors hover:text-teal-200 hover:decoration-teal-400"
          >
            nature and macro
          </Link>{" "}
          when I&apos;m not at a keyboard.
        </Reveal>
        <Reveal delay={0.24} className="mt-6 flex flex-wrap gap-4 border-t border-ink-600/80 pt-5">
          {STATS.map((s) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -3, scale: 1.02 }}
              className="group/stat cursor-default rounded-lg border border-ink-700/60 bg-ink-800/60 px-4 py-3 transition-[border-color,box-shadow] duration-200 hover:border-teal-500/50 hover:bg-ink-700/60 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
            >
              <div className="font-mono text-[clamp(18px,2vw,22px)] font-semibold text-teal-400 tabular-nums transition-colors group-hover/stat:text-teal-300 group-hover/stat:drop-shadow-[0_0_8px_rgba(79,151,163,0.5)]">
                {s.num}
              </div>
              <div className="mt-1 font-mono text-[10px] font-medium tracking-[0.14em] text-ink-400 group-hover/stat:text-ink-300 transition-colors">
                {s.label}
              </div>
            </motion.div>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
