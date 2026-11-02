import { isResourcePublished } from "../../resourceCatalog";
import type {
  ContentCta,
  ContentSection,
  ContentText,
  SeoContent,
} from "../types";

type SectionCollection = {
  eyebrow: string;
  title: string;
  intro: ContentText[];
  items: ContentSection[];
};

type AdmissionGuideContent = {
  publishedAt?: string | null;
  lastUpdated?: string | null;
  effectiveAt?: string | null;
  ready: boolean;
  seo: SeoContent;
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: ContentText[];
  process: {
    eyebrow: string;
    title: string;
    intro: ContentText[];
    steps: ContentSection[];
  };
  shortlist: {
    eyebrow: string;
    title: string;
    intro: ContentText[];
    listTitle: string;
    items: ContentText[];
  };
  readiness: SectionCollection;
  sections: ContentSection[];
  cta: ContentCta;
};

export const admissionGuideContent: AdmissionGuideContent = {
  ready: isResourcePublished("/explore/admission-guide"),
  publishedAt: null,
  lastUpdated: "2026-10-30T20:29:43+05:30",
  effectiveAt: null,
  seo: {
    title: "College Admission Guide | Eligibility, Exams and Applications",
    description:
      "Follow the admission journey from shortlisting and eligibility checks to entrance examinations, documentation, fees and financial assistance.",
  },
  eyebrow: "Admission planning",
  title: "Admission Guide",
  subtitle:
    "A practical overview of college admissions, from choosing a course to preparing your documents.",
  intro: [
    "Explore courses and institutions that suit your goals, then check the exact admission and eligibility requirements before applying.",
  ],
  process: {
    eyebrow: "Step by step",
    title: "Your admission journey",
    intro: [
      "The exact process may vary by institution, programme and admission route.",
    ],
    steps: [
      {
        id: "explore",
        title: "Explore",
        blocks: [
          {
            type: "paragraph",
            text: "Identify your course and institution preferences.",
          },
        ],
      },
      {
        id: "shortlist-and-check-eligibility",
        title: "Shortlist and check eligibility",
        blocks: [
          {
            type: "paragraph",
            text: "Compare academic criteria, entrance scores, location and costs.",
          },
        ],
      },
      {
        id: "apply-and-participate-in-selection",
        title: "Apply and participate in selection",
        blocks: [
          {
            type: "paragraph",
            text: "Submit the application and complete any entrance examination, counselling or selection stage.",
          },
        ],
      },
      {
        id: "verify-documents-and-confirm-admission",
        title: "Verify documents and confirm admission",
        blocks: [
          {
            type: "paragraph",
            text: "Complete verification and the prescribed fee-payment process.",
          },
        ],
      },
    ],
  },
  shortlist: {
    eyebrow: "Before applying",
    title: "What to check when shortlisting",
    intro: ["Assess admission suitability before committing to applications."],
    listTitle: "Shortlisting checklist",
    items: [
      "Course and specialisation match",
      "Academic eligibility and entrance exam requirements",
      "Budget, location, accommodation and fees",
      "Scholarships, placement information and official admission deadlines",
    ],
  },
  readiness: {
    eyebrow: "Get ready",
    title: "Eligibility and documents",
    intro: [
      "Keep your academic documents accessible and verify the specific requirements of each institution.",
    ],
    items: [
      {
        id: "eligibility",
        title: "Eligibility",
        blocks: [
          {
            type: "paragraph",
            text: "Before applying, check whether you meet the required criteria. Eligibility may depend on:",
          },
          {
            type: "list",
            items: [
              "Academic Qualification and Minimum Marks",
              "Required Subjects / Branch / Specialisation",
              "Entrance Exam Score / Rank Cutoff",
              "Age Criteria (where applicable)",
              "Category and Domicile Requirements",
            ],
          },
          {
            type: "paragraph",
            text: "Always verify the final eligibility criteria with the concerned institution.",
          },
        ],
      },
      {
        id: "documents-required",
        title: "Documents Required",
        blocks: [
          {
            type: "paragraph",
            text: "Commonly required documents may include:",
          },
          {
            type: "list",
            items: [
              "10th, 12th and Graduation Mark Sheets/Certificates",
              "Entrance Exam Scorecard",
              "ID Proof",
              "Passport-Size Photographs",
              "Category Certificate",
              "Domicile Certificate",
              "Migration/Transfer Certificate",
            ],
          },
          {
            type: "paragraph",
            text: "Additional documents may be required depending on the college, course and admission category.",
          },
          {
            type: "paragraph",
            text: "Keep both originals and required copies/digital documents ready during the admission process.",
          },
        ],
      },
    ],
  },
  sections: [
    {
      id: "entrance-examinations",
      title: "Entrance Examinations",
      blocks: [
        {
          type: "paragraph",
          text: "Many professional and higher-education programs require an entrance examination.",
        },
        {
          type: "paragraph",
          text: "The applicable examination depends on your course, college and admission route.",
        },
        {
          type: "image",
          src: "/editorial/admission-1.webp",
          alt: "Quick reference chart grouping Indian courses and entrance tests: engineering (JEE Main, JEE Advanced, GATE), management (CAT, MAT, CMAT, XAT), medicine (NEET), law (CLAT, AILET), arts and science (CUET), and design or architecture (NID DAT, NIFT, UCEED, NATA)",
          caption: "Illustrative course and examination reference chart",
          width: 1160,
          height: 633,
        },
      ],
    },
    {
      id: "admission-routes",
      title: "Admission Routes",
      blocks: [
        {
          type: "paragraph",
          text: "Students may enter a college through different admission routes, including:",
        },
        {
          type: "list",
          items: [
            "Entrance-Based Admission — Selection based on an entrance exam.",
            "Merit-Based Admission — Selection based primarily on academic performance.",
            "Centralised Counselling — Seats allocated through a central/state counselling process.",
            "Institute/University-Level Admission — Admission handled directly by the institution.",
            "NRI/International Admission — Specific routes and criteria for eligible students.",
          ],
        },
        {
          type: "paragraph",
          text: "The available route depends on the course, institution and applicable regulations.",
        },
      ],
    },
    {
      id: "fees-and-financial-assistance",
      title: "Fees and Financial Assistance",
      blocks: [
        {
          type: "paragraph",
          text: "Before taking admission, understand the complete cost of education, including:",
        },
        {
          type: "list",
          items: [
            "Tuition fees",
            "Hostel and accommodation",
            "Examination and other institutional charges",
            "Transportation or other applicable expenses",
          ],
        },
        {
          type: "paragraph",
          text: "Students may also explore institutes / college / university:",
        },
        {
          type: "list",
          items: [
            "Scholarships",
            "Education Loans",
            "Merit-Based Financial Assistance",
            "Category/Institution-Specific Benefits",
          ],
        },
        {
          type: "paragraph",
          text: "Always check the latest fee structure, scholarship conditions and refund policy directly with the institution.",
        },
        {
          type: "paragraph",
          text: "Not sure which admission route is right for you? Get personalised guidance based on your rank, eligibility, course and college preferences. [Talk to a Counsellor]",
        },
      ],
    },
  ],
  cta: {
    eyebrow: "Need guidance?",
    title: "Discuss your admission options",
    text: "Get personalised guidance based on your rank, eligibility, course interests and college preferences.",
    links: [
      {
        label: "Talk to a counsellor",
        to: "/programs/mba/talk-to-mentor",
      },
      {
        label: "Explore education loans",
        to: "/explore/education-loan",
      },
    ],
  },
};
