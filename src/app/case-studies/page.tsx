import { redirect } from "next/navigation";
import caseStudiesData from "@/content/caseStudies.json";
import type { CaseStudy } from "@/lib/types";

const studies = caseStudiesData as CaseStudy[];

export default function CaseStudiesIndexPage() {
  redirect(`/case-studies/${studies[0].slug}`);
}
