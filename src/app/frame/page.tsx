import type { Metadata } from "next";
import Link from "next/link";
import frameData from "@/content/frame.json";
import siteData from "@/content/site.json";
import type { FramePhoto, FrameRowData, SiteContent } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { FrameGallery } from "@/components/frame/FrameGallery";

const { photos, rows } = frameData as { photos: FramePhoto[]; rows: FrameRowData[] };
const site = siteData as SiteContent;

export const metadata: Metadata = {
  title: "Frame — Himel Ahmed",
  description: "Nature and macro photography by Himel Ahmed.",
};

export default function FramePage() {
  return (
    <div className="mx-auto w-full max-w-300 px-3 pt-6 pb-24 md:px-6 md:pt-10 md:pb-40">
      <Reveal>
        <Link href="/#operator" scroll={false} className="text-sm leading-normal text-ink-100 hover:text-teal-500">
          ← back
        </Link>
      </Reveal>

      <div className="mt-10 md:mt-20">
        <Reveal delay={0.06}>
          <h1 className="m-0 font-display text-[44px] font-semibold leading-[1.08] text-ink-100">Frame</h1>
        </Reveal>
        <Reveal delay={0.1} className="mt-4 h-px w-60 bg-ink-600" />
        <Reveal delay={0.14} className="mt-4 max-w-[56ch] text-lg leading-[1.6] text-ink-300 text-pretty">
          Nature and macro. Shot when I&apos;m not building.
        </Reveal>
      </div>

      <div className="mt-10">
        <FrameGallery rows={rows} photos={photos} />
      </div>

      <Reveal className="mt-10 flex flex-wrap items-center justify-between gap-4 md:mt-16">
        <Link href="/#operator" scroll={false} className="text-sm leading-normal text-ink-100 hover:text-teal-500">
          ← Back to work
        </Link>
        <a href={`mailto:${site.email}`} className="text-sm leading-normal text-ink-100 hover:text-teal-500">
          Email
        </a>
      </Reveal>
    </div>
  );
}
