import type {
  ContentCta,
  ContentSection,
  ContentText,
  SeoContent,
} from "../types";

type StudyAbroadContent = {
  ready: boolean;
  seo: SeoContent;
  hero: {
    eyebrow: string;
    title: string;
    intro: ContentText[];
    note: ContentText;
  };
  support: {
    eyebrow: string;
    title: string;
    intro: ContentText[];
    items: Array<{ title: string; description: ContentText }>;
  };
  destinations: {
    eyebrow: string;
    title: string;
    intro: ContentText[];
  };
  guides: {
    eyebrow: string;
    title: string;
    intro: ContentText[];
  };
  sections: ContentSection[];
  profile: {
    eyebrow: string;
    title: string;
    intro: ContentText[];
    checklist: ContentText[];
  };
  mentor: {
    eyebrow: string;
    title: string;
    intro: ContentText[];
  };
  cta: ContentCta;
};

// PUBLIC CONTENT SLOT: keep confidential source material outside the repository.
export const studyAbroadContent: StudyAbroadContent = {
  ready: false,
  seo: { title: "", description: "" },
  hero: { eyebrow: "", title: "", intro: [], note: "" },
  support: { eyebrow: "", title: "", intro: [], items: [] },
  destinations: { eyebrow: "", title: "", intro: [] },
  guides: { eyebrow: "", title: "", intro: [] },
  sections: [],
  profile: { eyebrow: "", title: "", intro: [], checklist: [] },
  mentor: { eyebrow: "", title: "", intro: [] },
  cta: { eyebrow: "", title: "", text: "", links: [] },
};
