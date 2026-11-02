import { isResourcePublished } from "../resourceCatalog";
import type {
  ContentCta,
  ContentLink,
  ContentSection,
  ContentText,
  SeoContent,
} from "./types";

export type AboutCard = {
  title: string;
  description?: ContentText;
};

type AboutCollection = {
  eyebrow: string;
  title: string;
  intro?: ContentText;
  items: AboutCard[];
};

type AboutStatistics = {
  title: string;
  items: Array<{ value: string; label: string }>;
};

type AboutContent = {
  publishedAt?: string | null;
  lastUpdated?: string | null;
  effectiveAt?: string | null;
  ready: boolean;
  seo: SeoContent;
  eyebrow: string;
  title: string;
  intro: ContentText[];
  heroLinks: ContentLink[];
  sections: ContentSection[];
  principles: AboutCollection;
  features: AboutCollection;
  journey: AboutCollection;
  statistics: AboutStatistics;
  mission: ContentCta;
};

export const aboutContent: AboutContent = {
  ready: isResourcePublished("/about"),
  publishedAt: null,
  lastUpdated: null,
  effectiveAt: null,
  seo: {
    title: "About College FAQs | Student-Focused Education Guidance",
    description:
      "College FAQs, a venture of Octans Edu Services Pvt. Ltd., supports students exploring colleges, courses, admissions and education finance in India and abroad.",
  },
  eyebrow: "Who we are",
  title: "About College FAQs",
  intro: [
    "CollegeFAQs.com, a venture of Octans Edu Services Pvt. Ltd., is a student-focused education platform helping students make informed decisions about colleges, courses and career opportunities in India and abroad.",
    "With 10+ years of experience in education counselling, we have helped thousands of students navigate the complex process of choosing the right course and college.",
  ],
  heroLinks: [
    {
      label: "Explore programmes",
      to: "/#programs",
    },
    {
      label: "Talk to a mentor",
      to: "/programs/mba/talk-to-mentor",
    },
  ],
  sections: [
    {
      id: "what-we-do",
      title: "What we do",
      blocks: [
        {
          type: "paragraph",
          text: "From college and course selection to admission guidance and education loan assistance, we provide students with end-to-end support throughout their education journey.",
        },
        {
          type: "paragraph",
          text: "Our experts help students explore and compare colleges based on their academic profile, entrance exam performance, career goals, preferred location and budget.",
        },
        {
          type: "paragraph",
          text: "We provide information about courses and specialisations, eligibility, admissions, fees, placements, rankings, scholarships, reviews, career opportunities and education loans.",
        },
      ],
    },
  ],
  principles: {
    eyebrow: "Our approach",
    title: "Why students choose College FAQs",
    intro:
      "Education decisions are personal. Our team helps students compare options with relevant information and practical guidance.",
    items: [
      {
        title: "Student-First Guidance",
        description:
          "Every student's goals, academic profile and circumstances are different. Our guidance is personalised to help you explore options that are relevant to you.",
      },
      {
        title: "Transparent Information",
        description:
          "We focus on providing relevant, transparent and verified information so students can compare their options with greater clarity.",
      },
      {
        title: "Experienced Counsellors",
        description:
          "With more than a decade of experience in education counselling, our experts understand the challenges students and parents face while making college decisions.",
      },
      {
        title: "Extensive College & Course Repository",
        description:
          "Our experts have access to information covering 1,000+ colleges, universities and institutions and 50+ courses across multiple educational streams.",
      },
    ],
  },
  features: {
    eyebrow: "Our services",
    title: "Guidance through your education journey",
    intro:
      "Our team provides practical guidance at different stages of the education journey.",
    items: [
      {
        title: "College and course selection",
        description:
          "Compare courses and institutions against your interests, goals, entrance scores, preferred location and budget.",
      },
      {
        title: "Admission guidance",
        description:
          "Understand eligibility, routes, documentation and application steps.",
      },
      {
        title: "Education loan assistance",
        description:
          "Understand common financing options and lender requirements.",
      },
      {
        title: "Study-abroad guidance",
        description:
          "Consider course, institution and destination options beyond India.",
      },
    ],
  },
  journey: {
    eyebrow: "Our approach",
    title: "Explore. Compare. Decide.",
    intro: "Move from initial options to a better-informed education decision.",
    items: [
      {
        title: "Explore",
        description:
          "Identify courses and institutions relevant to your profile.",
      },
      {
        title: "Compare",
        description: "Review eligibility, costs, location and opportunities.",
      },
      {
        title: "Decide",
        description: "Take the next admission step with greater clarity.",
      },
    ],
  },
  statistics: {
    title: "College FAQs at a glance",
    items: [
      {
        value: "10+",
        label: "Years in education counselling",
      },
      {
        value: "1,000+",
        label: "Institutions covered by the team’s information",
      },
      {
        value: "50+",
        label: "Courses and specialisations",
      },
      {
        value: "10+",
        label: "Education streams",
      },
      {
        value: "Thousands",
        label: "Students guided",
      },
    ],
  },
  mission: {
    eyebrow: "Our mission",
    title: "Make education choices simpler and more transparent",
    text: "Our mission is simple — to make the college selection and admission journey simpler, more transparent and more informed for every student. We believe that the right information at the right time can help students make better education decisions and take a confident step towards their career goals.",
    links: [
      {
        label: "Talk to a mentor",
        to: "/programs/mba/talk-to-mentor",
      },
    ],
  },
};
