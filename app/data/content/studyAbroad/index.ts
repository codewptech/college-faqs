import { isResourcePublished } from "../../resourceCatalog";
import type {
  ContentCta,
  ContentSection,
  ContentText,
  SeoContent,
} from "../types";

type StudyAbroadContent = {
  publishedAt?: string | null;
  lastUpdated?: string | null;
  effectiveAt?: string | null;
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

export const studyAbroadContent: StudyAbroadContent = {
  ready: isResourcePublished("/programs/study-abroad"),
  publishedAt: null,
  lastUpdated: null,
  effectiveAt: null,
  seo: {
    title: "Study Abroad | Explore 9 Destinations and Get Guidance",
    description:
      "Explore study options in the USA, UK, Canada, Australia, France, Germany, Malaysia, UAE and Georgia, with practical guides and profile evaluation.",
  },
  hero: {
    eyebrow: "Study abroad",
    title: "Plan your international education journey",
    intro: [
      "Choosing where to study involves much more than selecting a country. Compare courses, entry requirements, tuition, living costs, accommodation and career pathways before applying.",
    ],
    note: "Rules and fees change. Always check current official sources and the institution’s requirements.",
  },
  support: {
    eyebrow: "Planning support",
    title: "Make decisions with more clarity",
    intro: [
      "Explore practical areas described in the client’s destination guides.",
    ],
    items: [
      {
        title: "Course and university fit",
        description:
          "Compare programmes and institutions against your academic background and goals.",
      },
      {
        title: "Admissions and documents",
        description:
          "Understand application steps, language requirements and supporting paperwork.",
      },
      {
        title: "Budgeting and accommodation",
        description:
          "Plan for tuition, housing, health insurance and everyday costs.",
      },
      {
        title: "Work and career considerations",
        description:
          "Research applicable student permissions and post-study pathways from official sources.",
      },
    ],
  },
  destinations: {
    eyebrow: "Compare destinations",
    title: "Explore nine destinations",
    intro: [
      "Select a country to discover its educational environment and major considerations.",
    ],
  },
  guides: {
    eyebrow: "Country resources",
    title: "Destination guides",
    intro: [
      "Read detailed client-supplied guides covering admission requirements, budgets, housing and student life.",
    ],
  },
  sections: [
    {
      id: "before-you-choose-a-destination",
      title: "Before you choose a destination",
      blocks: [
        {
          type: "list",
          items: [
            "Check programme eligibility, accreditation and course content.",
            "Estimate the complete education and living budget.",
            "Verify visa, residence and work conditions through the official government authority.",
            "Compare accommodation options and safety considerations.",
            "Prepare a realistic application timeline and document checklist.",
          ],
        },
      ],
    },
  ],
  profile: {
    eyebrow: "Your profile",
    title: "Free profile evaluation",
    intro: [
      "Share your academic background, destination interests and goals for a personalised discussion.",
    ],
    checklist: [
      "Current qualification and performance",
      "Preferred course, destination and intake",
      "Available budget and questions",
    ],
  },
  mentor: {
    eyebrow: "Get guidance",
    title: "Talk to a mentor",
    intro: [
      "Request a conversation to discuss your study-abroad plans and next steps.",
    ],
  },
  cta: {
    eyebrow: "Explore more",
    title: "Start with a clear plan",
    text: "Review destinations and use our free profile evaluation to discuss the next step.",
    links: [
      {
        label: "Explore the admission guide",
        to: "/explore/admission-guide",
      },
    ],
  },
};
