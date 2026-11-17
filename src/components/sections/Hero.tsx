"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { TicTacToe } from "@/components/sections/TicTacToe";
import type { SiteContent } from "@/lib/types";

export function Hero({ site }: { site: SiteContent }) {
  const shouldReduceMotion = useReducedMotion();
  const fadeDelay = (ms: number) => (shouldReduceMotion ? 0 : ms / 1000);

  return (
    <div className="mx-auto grid w-full max-w-300 mt-10 md:mt-16 grid-cols-1 items-center gap-10 layout:grid-cols-2 layout:gap-16">
      <div>
        <Reveal delay={0.1} className="mb-5">
          <div className="flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.14em] text-teal-400">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(79,151,163,0.8)]" />
            <span>LAYER 00 · BASE</span>
          </div>
        </Reveal>
        <Reveal delay={0.18}>
          <h1 className="m-0 font-display text-[clamp(40px,6.4vw,72px)] font-semibold leading-[1.02] tracking-[-0.02em] text-ink-100">
            {site.name.toUpperCase()}
          </h1>
        </Reveal>
        <Reveal delay={0.26} className="my-5 h-[2px] w-32 bg-gradient-to-r from-teal-500 to-teal-300 shadow-[0_0_10px_rgba(79,151,163,0.5)] rounded-full" />
        <Reveal delay={0.32}>
          <p className="m-0 max-w-[34ch] text-lg leading-[1.6] text-ink-100 text-pretty">
            Full-stack developer who builds the product and then tries to break it.
          </p>
        </Reveal>
        <Reveal delay={0.38} className="mt-3.5">
          <p className="m-0 text-sm leading-normal text-ink-300">{site.location} — available remote.</p>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: fadeDelay(460) }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <LinkButton variant="primary" href={`mailto:${site.email}`}>
            Email me
          </LinkButton>
          <LinkButton variant="secondary" href="/himel-ahmed-cv.pdf" download="Himel-Ahmed-CV.pdf">
            Download CV
          </LinkButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: fadeDelay(540) }}
          className="mt-7.5 max-w-[38ch]"
        >
          <div className="border-t border-ink-600/80 pt-4.5">
            <span className="font-mono text-2xl font-semibold text-brass-500 drop-shadow-[0_0_8px_rgba(194,161,101,0.25)]">
              Receipts, not claims
            </span>
            <div className="mt-2 text-sm leading-[1.55] text-ink-400 text-pretty">
              Every project below has a case study; every finding has a writeup. Nothing on this page asks to be taken
              on trust.
            </div>
          </div>
        </motion.div>
      </div>

      <Reveal delay={0.4} className="flex min-h-70 flex-col justify-center">
        <TicTacToe />
      </Reveal>
    </div>
  );
}
