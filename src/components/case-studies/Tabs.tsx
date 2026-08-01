"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import caseStudiesData from "@/content/caseStudies.json";
import type { CaseStudy } from "@/lib/types";

const studies = caseStudiesData as CaseStudy[];

export function Tabs() {
  const pathname = usePathname();
  return (
    <nav
      className="ml-auto flex h-11 items-center gap-4 overflow-x-auto sm:gap-6"
      aria-label="Case studies"
      style={{ scrollbarWidth: "none" }}
    >
      {studies.map((s) => {
        const href = `/case-studies/${s.slug}`;
        const isActive = pathname === href;
        return (
          <Link
            key={s.slug}
            href={href}
            className={`flex h-11 items-center whitespace-nowrap border-b-2 font-mono text-[11px] font-medium tracking-[0.14em] ${
              isActive ? "border-teal-500 text-ink-100" : "border-transparent text-ink-400 hover:text-ink-300"
            }`}
          >
            {s.title.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
