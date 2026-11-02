import { isResourcePublished } from "../../resourceCatalog";
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
  publishedAt?: string | null;
  lastUpdated?: string | null;
  effectiveAt?: string | null;
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

export const faqContent: FaqContent = {
  ready: isResourcePublished("/explore/faqs"),
  publishedAt: null,
  lastUpdated: "2026-10-30T20:29:43+05:30",
  effectiveAt: null,
  seo: {
    title: "FAQs | College Admissions and Counselling Questions",
    description:
      "Answers to common questions about admissions, eligibility, selecting colleges, scholarships, fees, counselling and studying abroad.",
  },
  eyebrow: "Student questions",
  title: "Frequently Asked Questions",
  subtitle:
    "Practical answers to your questions about colleges, admissions and education guidance.",
  introTitle: "Find the information you need",
  intro: [
    "These answers explain College FAQs services and general admission considerations. Exact eligibility and policies vary by institution.",
  ],
  items: [
    {
      question: "How does CollegeFAQs.com help students with admissions?",
      answer: [
        {
          type: "paragraph",
          text: "CollegeFAQs.com provides personalised guidance for choosing the right college and course based on your academic profile, entrance score, eligibility, preferences and budget. We also assist students through the admission process and related formalities.",
        },
      ],
    },
    {
      question: "How does the counselling process work?",
      answer: [
        {
          type: "paragraph",
          text: "Our counsellors understand your academic profile, career goals and preferences, then help you explore suitable colleges and courses. Based on your requirements, we guide you through available admission options and the next steps.",
        },
      ],
    },
    {
      question: "Can you help me choose a college based on my rank or score?",
      answer: [
        {
          type: "paragraph",
          text: "Yes. We can help you identify suitable college and course options based on your entrance exam score/rank, eligibility, category, preferred location and other relevant factors.",
        },
      ],
    },
    {
      question: "How do I know which colleges I am eligible for?",
      answer: [
        {
          type: "paragraph",
          text: "Eligibility depends on factors such as your academic qualifications, entrance exam score/rank, category, domicile and the admission route. Our counsellors can help you understand your eligibility and identify relevant options.",
        },
      ],
    },
    {
      question: "How should I choose the right college and course?",
      answer: [
        {
          type: "paragraph",
          text: "Consider factors such as curriculum, accreditation, fees, location, infrastructure, faculty, placements, career opportunities and your own interests and goals. Our counsellors can help you evaluate these factors before making your decision.",
        },
      ],
    },
    {
      question: "Can you help me compare different colleges?",
      answer: [
        {
          type: "paragraph",
          text: "Yes. We can help you compare colleges on important parameters such as courses, fees, location, eligibility, placements, infrastructure and admission process, so you can make a more informed decision.",
        },
      ],
    },
  ],
  groups: [
    {
      id: "admissions-and-documents",
      title: "Admissions and support",
      items: [
        {
          question: "What documents are generally required for admission?",
          answer: [
            {
              type: "paragraph",
              text: "Documents usually include academic mark sheets/certificates, entrance exam scorecard, identity proof, photographs and category/domicile certificates where applicable. Exact requirements vary by college, course and admission route.",
            },
          ],
        },
        {
          question: "Are scholarships or education loans available?",
          answer: [
            {
              type: "paragraph",
              text: "Many colleges offer scholarships based on academic performance, entrance scores or other eligibility criteria. Education loans may also be available through banks and financial institutions. We can guide you on the available options and process.",
            },
          ],
        },
        {
          question: "Do you help with the complete admission process?",
          answer: [
            {
              type: "paragraph",
              text: "We provide guidance throughout the admission journey, from understanding your options and selecting colleges to application and admission-related support. The exact support available may vary depending on the college and admission route.",
            },
          ],
        },
        {
          question: "How can I speak to a CollegeFAQs counsellor?",
          answer: [
            {
              type: "paragraph",
              text: "Simply submit an enquiry through our website with your basic academic and course preferences. Our counselling team will get in touch with you to understand your requirements and provide relevant guidance.",
            },
          ],
        },
        {
          question: "Is there a counselling/admission support fee?",
          answer: [
            {
              type: "paragraph",
              text: "Initial counselling and guidance are generally provided free of charge. If any specific service involves a fee, we will clearly inform you about the charges before proceeding.",
            },
          ],
        },
        {
          question: "Do you provide counselling for admissions across India?",
          answer: [
            {
              type: "paragraph",
              text: "Yes. CollegeFAQs.com provides counselling and admission guidance for students exploring colleges and courses across different states and admission routes in India.",
            },
          ],
        },
      ],
    },
    {
      id: "international-studies",
      title: "Studying abroad",
      items: [
        {
          question: "Do you provide guidance for studying abroad?",
          answer: [
            {
              type: "paragraph",
              text: "Yes. CollegeFAQs.com can provide guidance on suitable courses, universities, admission requirements and the overall application process for students planning to study abroad.",
            },
          ],
        },
        {
          question: "Which countries can I explore for higher education?",
          answer: [
            {
              type: "paragraph",
              text: "We can help you explore study options across popular international destinations based on your course preference, academic profile, budget and career goals. Availability of guidance may vary by country, university and program.",
            },
          ],
        },
      ],
    },
  ],
  cta: {
    eyebrow: "Still have a question?",
    title: "Talk to a counsellor",
    text: "Tell us about your academic profile and course preferences.",
    links: [
      {
        label: "Talk to a mentor",
        to: "/programs/mba/talk-to-mentor",
      },
      {
        label: "Admission Guide",
        to: "/explore/admission-guide",
      },
    ],
  },
};
