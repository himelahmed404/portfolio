import type { Metadata } from "next";
import { notFound } from "next/navigation";
import caseStudiesData from "@/content/caseStudies.json";
import type { CaseStudy } from "@/lib/types";
import { CaseStudyFull } from "@/components/case-studies/CaseStudyFull";

const studies = caseStudiesData as CaseStudy[];

export function generateStaticParams() {
  return studies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = studies.find((s) => s.slug === slug);
  if (!study) return {};
  return {
    title: `${study.title} — Case study — Himel Ahmed`,
    description: study.claim,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = studies.find((s) => s.slug === slug);
  if (!study) notFound();
  return <CaseStudyFull study={study} allStudies={studies} />;
}
