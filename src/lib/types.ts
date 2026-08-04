export type ProjectStatus = "live" | "shipped" | "wip";

export interface StackTag {
  label: string;
}

export interface ProjectSummary {
  slug: string;
  title: string;
  claim: string;
  role: string;
  shotLabel: string;
  image?: string;
  externalLabel?: string;
  externalHref?: string;
  statusLabel: string;
  status: ProjectStatus;
  stack: string[];
}

export interface CaseStudyImage {
  shotLabel: string;
  caption: string;
  src?: string;
}

export interface CaseStudy {
  slug: string;
  index: number;
  title: string;
  claim: string;
  meta: string[];
  externalHref?: string;
  externalLabel?: string;
  statusLabel: string;
  rankLabel?: string;
  heroShotLabel: string;
  heroCaption: string;
  heroImage?: string;
  problem: string[];
  built: string[];
  images: CaseStudyImage[];
  change: string[];
}

export interface Writeup {
  slug: string;
  index: number;
  tag: string;
  readTime: string;
  badge?: string;
  rank?: string;
  title: string;
  dek: string;
  body: string[];
}

export interface RecordRow {
  rank: string;
  name: string;
  tag: string;
}

export interface StackGroup {
  label: string;
  items: string[];
}

export interface ExperienceItem {
  title: string;
  date: string;
  description: string;
}

export interface SiteContent {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  domain: string;
}

export interface FramePhoto {
  src: string;
  w: number;
  h: number;
  alt: string;
  blur: string;
}

export type FrameRowType = "full" | "pair" | "trio" | "solo";

export interface FrameRowData {
  type: FrameRowType;
  items: number[];
  align?: "left" | "right";
}
