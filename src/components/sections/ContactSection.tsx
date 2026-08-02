import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/Button";
import type { SiteContent } from "@/lib/types";

export function ContactSection({ site }: { site: SiteContent }) {
  return (
    <div className="mx-auto w-full max-w-[900px] mt-8 sm:mt-10">
      <Reveal className="mb-5 font-mono text-[11px] font-medium tracking-[0.14em] text-teal-500">
        CONTACT · PRINT COMPLETE
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="m-0 mb-4 font-display text-[clamp(30px,4.4vw,44px)] font-semibold leading-[1.08] tracking-[-0.02em] text-ink-100 text-pretty">
          Open to full-stack roles — remote or relocation.
        </h2>
      </Reveal>
      <Reveal delay={0.12} className="mb-8 max-w-[56ch] text-lg leading-[1.6] text-ink-300 text-pretty">
        Also taking freelance builds. Email goes straight to me — no form, nothing to lose your message.
      </Reveal>
      <Reveal delay={0.18} className="flex flex-wrap gap-3">
        <LinkButton variant="primary" href={`mailto:${site.email}`}>
          {site.email}
        </LinkButton>
        <LinkButton variant="secondary" href="/himel-ahmed-cv.pdf" download="Himel-Ahmed-CV.pdf">
          Download CV
        </LinkButton>
        <LinkButton variant="secondary" href={site.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </LinkButton>
        <LinkButton variant="secondary" href={site.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </LinkButton>
      </Reveal>
      <Reveal
        delay={0.24}
        className="mt-10 flex flex-wrap justify-between gap-x-8 gap-y-4 border-t border-ink-600 pt-[18px] font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400"
      >
        <span>
          {site.name.toUpperCase()} · {site.location.toUpperCase()}
        </span>
        <span>{site.phone}</span>
        <Link href="/frame" className="text-ink-400 hover:text-teal-500">
          Photography
        </Link>
        <span>07 LAYERS · Z 1.00 · PRINT COMPLETE</span>
      </Reveal>
    </div>
  );
}
