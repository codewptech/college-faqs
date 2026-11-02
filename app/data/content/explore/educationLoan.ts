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

type EducationLoanContent = {
  publishedAt?: string | null;
  lastUpdated?: string | null;
  effectiveAt?: string | null;
  ready: boolean;
  seo: SeoContent;
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: ContentText[];
  costs: SectionCollection;
  guidance: SectionCollection;
  documents: {
    eyebrow: string;
    title: string;
    intro: ContentText[];
    items: ContentText[];
  };
  notice: ContentText;
  sections: ContentSection[];
  cta: ContentCta;
};

export const educationLoanContent: EducationLoanContent = {
  ready: isResourcePublished("/explore/education-loan"),
  publishedAt: null,
  lastUpdated: "2026-10-30T20:29:43+05:30",
  effectiveAt: null,
  seo: {
    title: "Education Loan Guide | Plan Your Study Financing",
    description:
      "Understand education loan coverage, basic eligibility, common documents, lender comparisons and the loan application process.",
  },
  eyebrow: "Financial planning",
  title: "Education Loan",
  subtitle: "Make Your Education More Affordable",
  intro: [
    "Financing your higher education should not stop you from choosing the right college. We help students understand their education loan options, eligibility and documentation requirements so they can plan their education expenses with greater clarity.",
  ],
  costs: {
    eyebrow: "What is covered",
    title: "What can an education loan cover?",
    intro: [
      "Depending on the lender and course, eligible financing may cover:",
    ],
    items: [
      {
        id: "potential-education-expenses",
        title: "Potential education expenses",
        blocks: [
          {
            type: "list",
            items: [
              "Tuition and academic fees",
              "Hostel and accommodation expenses",
              "Examination and other institutional charges",
              "Books, equipment and study materials",
              "Travel expenses for eligible overseas programmes",
              "Other approved education-related expenses",
            ],
          },
        ],
      },
    ],
  },
  guidance: {
    eyebrow: "How we help",
    title: "Understand your loan options",
    intro: [
      "We help you understand available options and prepare for the lender’s assessment.",
    ],
    items: [
      {
        id: "understand-your-loan-options-explore-suitable-loan-options-based-on-your-course-college-admission-status-and-estimated-education-cost",
        title: "Understand Your Loan Options",
        blocks: [
          {
            type: "paragraph",
            text: "Explore suitable loan options based on your course, college, admission status and estimated education cost.",
          },
        ],
      },
      {
        id: "check-basic-eligibility-understand-common-requirements-such-as-academic-records-admission-confirmation-co-applicant-details-and-applicable-lender-criteria",
        title: "Check Basic Eligibility",
        blocks: [
          {
            type: "paragraph",
            text: "Understand common requirements such as academic records, admission confirmation, co-applicant details and applicable lender criteria.",
          },
        ],
      },
      {
        id: "prepare-your-documents-get-guidance-on-commonly-required-documents-such-as-admission-letter-fee-structure-academic-certificates-identity-address-proof-and-income-documents",
        title: "Prepare Your Documents",
        blocks: [
          {
            type: "paragraph",
            text: "Get guidance on commonly required documents such as admission letter, fee structure, academic certificates, identity/address proof and income documents.",
          },
        ],
      },
      {
        id: "understand-the-process-get-clarity-on-application-document-submission-verification-sanction-and-disbursement-stages",
        title: "Understand the Process",
        blocks: [
          {
            type: "paragraph",
            text: "Get clarity on application, document submission, verification, sanction and disbursement stages.",
          },
        ],
      },
      {
        id: "compare-before-you-decide-understand-key-factors-such-as-interest-rate-processing-charges-collateral-requirements-repayment-period-moratorium-period-and-applicable-terms-before-selecting-a-lender",
        title: "Compare Before You Decide",
        blocks: [
          {
            type: "paragraph",
            text: "Understand key factors such as interest rate, processing charges, collateral requirements, repayment period, moratorium period and applicable terms before selecting a lender.",
          },
        ],
      },
    ],
  },
  documents: {
    eyebrow: "Prepare your application",
    title: "Common documents required",
    intro: [
      "Requirements vary by lender, loan amount and applicant circumstances.",
    ],
    items: [
      "Admission letter",
      "Fee structure",
      "Academic certificates",
      "Identity and address proof",
      "Income documents",
      "Bank statements",
      "Co-applicant documents",
      "Collateral documents, where applicable",
    ],
  },
  notice:
    "Education loan approval is solely at the discretion of the concerned bank or financial institution and depends on its eligibility criteria, credit assessment and applicable policies. Loan approval or disbursement cannot be guaranteed by collegefaqs.com.",
  sections: [
    {
      id: "compare-before-choosing-a-lender",
      title: "Compare before choosing a lender",
      blocks: [
        {
          type: "paragraph",
          text: "Consider the interest rate, processing charges, collateral requirements, repayment period, moratorium and applicable terms. Always review the lender’s full offer before accepting.",
        },
      ],
    },
  ],
  cta: {
    eyebrow: "More information",
    title: "Take the next step with confidence",
    text: "Explore your course options and prepare the details needed for an education financing discussion.",
    links: [
      {
        label: "Explore programmes",
        to: "/#programs",
      },
      {
        label: "Admission guide",
        to: "/explore/admission-guide",
      },
    ],
  },
};
