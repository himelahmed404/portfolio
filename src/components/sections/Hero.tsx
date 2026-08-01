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
    <div className="mx-auto grid w-full max-w-[1200px] mt-10 md:mt-16 grid-cols-1 items-center gap-10 layout:grid-cols-2 layout:gap-16">
      <div>
        <Reveal delay={0.56} className="mb-5">
          <div className="font-mono text-[11px] font-medium tracking-[0.14em] text-teal-500">LAYER 00 · BASE</div>
        </Reveal>
        <Reveal delay={0.62}>
          <h1 className="m-0 font-display text-[clamp(40px,6.4vw,72px)] font-semibold leading-[1.02] tracking-[-0.02em] text-ink-100">
            {site.name.toUpperCase()}
          </h1>
        </Reveal>
        <Reveal delay={0.7} className="my-5 h-px w-[120px] bg-teal-500" />
        <Reveal delay={0.76}>
          <p className="m-0 max-w-[34ch] text-lg leading-[1.6] text-ink-100 text-pretty">
            Full-stack developer who builds the product and then tries to break it.
          </p>
        </Reveal>
        <Reveal delay={0.82} className="mt-3.5">
          <p className="m-0 text-sm leading-[1.5] text-ink-300">{site.location} — available remote.</p>
        </Reveal>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3, delay: fadeDelay(1400) }}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3, delay: fadeDelay(1500) }}
          className="mt-[30px] max-w-[38ch]"
        >
          <div className="border-t border-ink-600 pt-[18px]">
            <span className="font-mono text-2xl font-semibold text-brass-500">Receipts, not claims</span>
            <div className="mt-2 text-sm leading-[1.55] text-ink-400 text-pretty">
              Every project below has a case study; every finding has a writeup. Nothing on this page asks to be taken
              on trust.
            </div>
          </div>
        </motion.div>
      </div>

      <Reveal delay={0.9} className="flex min-h-[280px] flex-col justify-center">
        <TicTacToe />
      </Reveal>
    </div>
  );
}
