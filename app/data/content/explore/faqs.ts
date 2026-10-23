import type {
  ContentBlock,
  ContentCta,
  ContentText,
  SeoContent,
} from "../types";

export type FaqItem = {
  question: string;
  answer: ContentBlock[];
};

export type FaqGroup = {
  id?: string;
  title: string;
  items: FaqItem[];
};

type FaqContent = {
  ready: boolean;
  seo: SeoContent;
  eyebrow: string;
  title: string;
  subtitle: string;
  introTitle: string;
  intro: ContentText[];
  items: FaqItem[];
  groups: FaqGroup[];
  cta: ContentCta;
};

// PUBLIC CONTENT SLOT: add only publication-approved questions and answers here.
export const faqContent: FaqContent = {
  ready: false,
  seo: { title: "", description: "" },
  eyebrow: "",
  title: "FAQs",
  subtitle: "",
  introTitle: "",
  intro: [],
  items: [],
  groups: [],
  cta: { eyebrow: "", title: "", text: "", links: [] },
};
