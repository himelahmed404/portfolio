"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
            className={`relative flex h-11 items-center whitespace-nowrap font-mono text-[11px] font-medium tracking-[0.14em] transition-colors duration-150 ${
              isActive ? "text-ink-100 font-semibold" : "text-ink-400 hover:text-ink-200"
            }`}
          >
            <span>{s.title.toUpperCase()}</span>
            {isActive && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-teal-400 shadow-[0_0_8px_rgba(79,151,163,0.8)]"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
