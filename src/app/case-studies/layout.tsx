import Link from "next/link";
import { Tabs } from "@/components/case-studies/Tabs";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

export default function CaseStudiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-900 pb-16 sm:pb-24">
      <ScrollProgress />
      <header className="sticky top-0 z-20 border-b border-ink-600 bg-ink-800/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.4)]">
        <div className="mx-auto flex h-11 max-w-[1200px] items-center gap-6 px-4 sm:px-6">
          <Link
            href="/"
            className="flex-none font-mono text-[11px] font-medium tracking-[0.14em] text-ink-300 transition-colors hover:text-teal-400"
          >
            ← HIMELAHMED.DEV
          </Link>
          <Tabs />
        </div>
      </header>
      {children}
    </div>
  );
}
