import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/lib/types";
import { Heading } from "@/components/ui/Typography";
import { ShotPlaceholder } from "@/components/ui/ShotPlaceholder";
import { Lightbox, type LightboxImage } from "@/components/ui/Lightbox";

export function CaseStudyPanel({
  study,
  allStudies,
  onOpen,
}: {
  study: CaseStudy;
  allStudies: CaseStudy[];
  onOpen: (slug: string) => void;
}) {
  const i = allStudies.findIndex((s) => s.slug === study.slug);
  const prev = allStudies[(i - 1 + allStudies.length) % allStudies.length];
  const next = allStudies[(i + 1) % allStudies.length];
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  return (
    <article className="mx-auto max-w-[860px] px-6 pt-8 pb-24 sm:px-10 sm:pt-12">
      <div className="mb-4 font-mono text-[11px] font-medium tracking-[0.14em] text-teal-500">
        CASE STUDY {String(study.index).padStart(2, "0")} / {allStudies.length.toString().padStart(2, "0")}
      </div>
      <Heading as="h1" size="l" className="mb-3.5">
        {study.title}
      </Heading>
      <p className="m-0 mb-6 max-w-[52ch] text-lg leading-[1.6] text-ink-100 text-pretty">{study.claim}</p>

      <div className="mb-7 flex flex-wrap gap-x-6 gap-y-2.5 border-y border-ink-600 py-3 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">
        {study.meta.map((m) => (
          <span key={m}>{m}</span>
        ))}
        {study.rankLabel && <span className="text-brass-500">{study.rankLabel}</span>}
        {study.externalHref && (
          <a href={study.externalHref} target="_blank" rel="noopener noreferrer">
            {study.externalLabel} <ArrowUpRight className="inline h-3 w-3" />
          </a>
        )}
        <Link href={`/case-studies/${study.slug}`}>
          PERMALINK <ArrowUpRight className="inline h-3 w-3" />
        </Link>
      </div>

      <ShotPlaceholder
        src={study.heroImage ?? `/shots/${study.slug}-hero.png`}
        label={study.heroShotLabel}
        aspect="16/9"
        rounded="lg"
        className="mb-2"
        onClick={() =>
          setLightboxImage({
            src: study.heroImage ?? `/shots/${study.slug}-hero.png`,
            alt: study.heroShotLabel,
          })
        }
      />
      <p className="m-0 mb-8 text-sm leading-[1.5] text-ink-300">{study.heroCaption}</p>

      <div className="mb-2.5 font-mono text-[11px] font-medium tracking-[0.14em] text-teal-500">THE PROBLEM</div>
      {study.problem.map((p, idx) => (
        <p
          key={idx}
          className={`m-0 text-ink-300 text-pretty ${idx === 0 ? "text-lg leading-[1.6] text-ink-100" : "mt-3.5 text-base leading-[1.65]"} ${idx === study.problem.length - 1 ? "mb-8" : ""}`}
        >
          {p}
        </p>
      ))}

      <div className="mb-2.5 font-mono text-[11px] font-medium tracking-[0.14em] text-teal-500">WHAT I BUILT</div>
      {study.built.map((p, idx) => (
        <p
          key={idx}
          className={`m-0 text-base leading-[1.65] text-ink-300 text-pretty ${idx > 0 ? "mt-3.5" : ""} ${idx === study.built.length - 1 ? "mb-8" : ""}`}
        >
          {p}
        </p>
      ))}

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {study?.images?.map((img, idx) => {
          const src = img.src ?? `/shots/${study.slug}-${idx + 1}.png`;
          return (
            <figure key={img.shotLabel} className="m-0">
              <ShotPlaceholder
                src={src}
                label={img.shotLabel}
                aspect="16/10"
                onClick={() => setLightboxImage({ src, alt: img.shotLabel, caption: img.caption })}
              />
              <figcaption className="mt-2 text-sm leading-[1.5] text-ink-300">{img.caption}</figcaption>
            </figure>
          );
        })}
      </div>

      <div className="mb-2.5 font-mono text-[11px] font-medium tracking-[0.14em] text-teal-500">
        WHAT I&apos;D CHANGE
      </div>
      {study.change?.length ? (
        <>
          <div className="mb-2.5 font-mono text-[11px] font-medium tracking-[0.14em] text-teal-500">
            WHAT I&apos;D CHANGE
          </div>
          {study.change.map((p, idx, arr) => (
            <p
              key={idx}
              className={`m-0 text-base leading-[1.65] text-ink-300 text-pretty ${idx > 0 ? "mt-3.5" : ""} ${idx === arr.length - 1 ? "mb-9" : ""}`}
            >
              {p}
            </p>
          ))}
        </>
      ) : null}

      <nav className="flex items-center justify-between gap-4 border-t border-ink-600 pt-5 font-mono text-[11px] font-medium tracking-[0.14em]">
        <button
          onClick={() => onOpen(prev.slug)}
          className="cursor-pointer border-0 bg-transparent p-0 text-teal-500 hover:text-teal-300"
        >
          ← {prev.title.toUpperCase()}
        </button>
        <button
          onClick={() => onOpen(next.slug)}
          className="cursor-pointer border-0 bg-transparent p-0 text-teal-500 hover:text-teal-300"
        >
          {next.title.toUpperCase()} <ArrowRight className="inline h-3 w-3" />
        </button>
      </nav>

      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </article>
  );
}
