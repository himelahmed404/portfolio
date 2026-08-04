"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/lib/types";
import { Heading } from "@/components/ui/Typography";
import { ShotPlaceholder } from "@/components/ui/ShotPlaceholder";
import { Reveal } from "@/components/ui/Reveal";
import { Lightbox, type LightboxImage } from "@/components/ui/Lightbox";

export function CaseStudyFull({ study, allStudies }: { study: CaseStudy; allStudies: CaseStudy[] }) {
  const i = allStudies.findIndex((s) => s.slug === study.slug);
  const prev = i > 0 ? allStudies[i - 1] : null;
  const next = i < allStudies.length - 1 ? allStudies[i + 1] : null;
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  return (
    <article className="mx-auto max-w-300 px-4 pt-8 sm:px-6 sm:pt-14">
      <Reveal className="mb-4 font-mono text-[11px] font-medium tracking-[0.14em] text-teal-500">
        CASE STUDY {String(study.index).padStart(2, "0")} / {allStudies.length.toString().padStart(2, "0")}
      </Reveal>
      <Reveal delay={0.06}>
        <Heading as="h1" size="m" className="max-w-[20ch]">
          {study.title}
        </Heading>
      </Reveal>
      <Reveal delay={0.12} className="mt-3 max-w-[44ch] text-lg leading-[1.6] text-ink-100 text-pretty">
        {study.claim}
      </Reveal>
      <Reveal
        delay={0.18}
        className="my-7 flex flex-wrap gap-x-7 gap-y-2 border-y border-ink-600 py-4 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400"
      >
        {study.meta.map((m) => (
          <span key={m}>{m}</span>
        ))}
        {study.rankLabel && <span className="text-brass-500">{study.rankLabel}</span>}
        {study.externalHref && (
          <a href={study.externalHref} target="_blank" rel="noopener noreferrer">
            {study.externalLabel} <ArrowUpRight className="inline h-3 w-3" />
          </a>
        )}
        <span className="ml-auto text-ink-300">{study.statusLabel}</span>
      </Reveal>

      <Reveal delay={0.24} className="mb-12">
        <ShotPlaceholder
          src={study.heroImage ?? `/shots/${study.slug}-hero.png`}
          label={study.heroShotLabel}
          aspect="16/9"
          rounded="lg"
          onClick={() =>
            setLightboxImage({
              src: study.heroImage ?? `/shots/${study.slug}-hero.png`,
              alt: study.heroShotLabel,
            })
          }
        />
      </Reveal>

      <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2 sm:gap-12">
        <section>
          <Reveal className="mb-3 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">
            THE PROBLEM
          </Reveal>
          {study.problem.map((p, idx) => (
            <Reveal
              key={idx}
              delay={0.06 * (idx + 1)}
              className={`text-ink-300 text-pretty ${idx === 0 ? "text-lg leading-[1.6] text-ink-100" : "mt-3 text-base leading-[1.65]"}`}
            >
              {p}
            </Reveal>
          ))}
        </section>
        <section>
          <Reveal className="mb-3 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">
            WHAT I BUILT
          </Reveal>
          {study.built.map((p, idx) => (
            <Reveal
              key={idx}
              delay={0.06 * (idx + 1)}
              className={`text-base leading-[1.65] text-ink-300 text-pretty ${idx > 0 ? "mt-3.5" : ""}`}
            >
              {p}
            </Reveal>
          ))}
        </section>
      </div>

      <div className="mt-12">
        <Reveal className="mb-4 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">SCREENSHOTS</Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {study.images.map((img, idx) => {
            const src = img.src ?? `/shots/${study.slug}-${idx + 1}.png`;
            return (
              <Reveal key={img.shotLabel} delay={idx * 0.06}>
                <figure className="m-0">
                  <ShotPlaceholder
                    src={src}
                    label={img.shotLabel}
                    aspect="16/10"
                    rounded="lg"
                    onClick={() => setLightboxImage({ src, alt: img.shotLabel, caption: img.caption })}
                  />
                  <figcaption className="mt-2.5 text-sm leading-normal text-ink-300">{img.caption}</figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>

      <Reveal className="mt-12 max-w-[70ch] rounded-xl border border-ink-600 bg-ink-700 p-6">
        <div className="mb-3 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">
          WHAT I&apos;D CHANGE
        </div>
        {study.change.map((p, idx) => (
          <p
            key={idx}
            className={`m-0 text-base leading-[1.65] text-pretty ${idx > 0 ? "mt-3" : ""} ${idx === 0 ? "text-ink-100" : "text-ink-300"}`}
          >
            {p}
          </p>
        ))}
      </Reveal>

      <Reveal
        className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-ink-600 pt-5 font-mono text-[11px] font-medium tracking-[0.14em]"
      >
        {prev ? (
          <Link href={`/case-studies/${prev.slug}`} className="text-teal-500 hover:text-teal-300">
            ← PREVIOUS — {prev.title.toUpperCase()}
          </Link>
        ) : (
          <span className="text-ink-600">← FIRST CASE STUDY</span>
        )}
        {next ? (
          <Link href={`/case-studies/${next.slug}`} className="text-teal-500 hover:text-teal-300">
            NEXT — {next.title.toUpperCase()} →
          </Link>
        ) : (
          <Link href="/" className="text-teal-500 hover:text-teal-300">
            BACK TO THE PRINT →
          </Link>
        )}
      </Reveal>

      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </article>
  );
}
