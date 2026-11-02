import { isResourcePublished } from "../../resourceCatalog";
import type { CountryGuideContent } from "../types";

export const canadaGuide: CountryGuideContent = {
  ready: isResourcePublished("/programs/study-abroad/canada"),
  slug: "canada",
  country: "Canada",
  publishedAt: null,
  lastUpdated: "2026-10-30T20:29:43+05:30",
  effectiveAt: null,
  seo: {
    title: "Study in Canada: Complete Guide for Indian Students | College FAQs",
    description:
      "Explore studying in Canada: admissions, universities, student visas, budgets, accommodation and career considerations for Indian students.",
  },
  eyebrow: "Study Abroad • Destination Guide",
  title: "Study in Canada: Complete Guide for Indian Students",
  subtitle: "GIC, PGWP, Accommodation & Budgeting",
  heroImage: {
    src: "/editorial/canada-1.webp",
    alt: "Contemporary university building in Toronto with the CN Tower in the background",
    caption: "Modern campus architecture in Toronto",
    width: 783,
    height: 391,
  },
  intro: [
    "Canada remains a top choice for Indian students due to its high educational standards, diverse society, and structured post-study work opportunities. Navigating study permit applications, living expenses, and work authorization requires careful preparation.",
    "Here is a full breakdown of what you need to know before moving to Canada.",
  ],
  highlights: [
    "Proof of Funds & Financial Requirements",
    "Cost of Living & Budgeting Breakdown",
    "Accommodation Options",
  ],
  sections: [
    {
      id: "proof-of-funds-financial-requirements",
      title: "Proof of Funds & Financial Requirements",
      blocks: [
        {
          type: "paragraph",
          text: "Canada requires study permit applicants to show clear proof of living expenses in addition to first-year tuition fees.",
        },
        {
          type: "image",
          src: "/editorial/canada-2.webp",
          alt: "Rows of desks and bookshelves in a historic university reading room",
          caption: "University library reading room",
          width: 292,
          height: 342,
        },
        {
          type: "list",
          items: [
            "Updated Living Expense Threshold: The single-applicant living cost requirement stands at CAD $23,448 per year (outside Quebec) plus full tuition and travel expenses. For Quebec institutions, living requirements start at CAD $24,617.",
            "Guaranteed Investment Certificate (GIC): Depositing funds into a GIC with an approved Canadian financial institution (such as RBC, TD, BMO, or CIBC) serves as liquid proof of living expenses. Once in Canada, these funds are released in monthly installments.",
            "Provincial Attestation Letter (PAL): Most undergraduate and college diploma applicants must secure a PAL issued by the institution's province prior to submitting a study permit application. Exemptions and requirements vary by programme, qualification and application date; check current IRCC guidance.",
          ],
        },
      ],
    },
    {
      id: "cost-of-living-budgeting-breakdown",
      title: "Cost of Living & Budgeting Breakdown",
      blocks: [
        {
          type: "paragraph",
          text: "Living costs vary based on whether you choose major metropolitan centers like Toronto or Vancouver versus mid-sized regional cities.",
        },
        {
          type: "table",
          caption:
            "Indicative cost comparison from the source document; check current prices with your institution.",
          headers: [
            "Expense Category",
            "Major Cities (Toronto, Vancouver)",
            "Regional Cities (Calgary, Halifax, Winnipeg)",
          ],
          rows: [
            [
              "Annual Tuition (College Diploma)",
              "CAD $16,000 – $22,000",
              "CAD $13,000 – $18,000",
            ],
            [
              "Annual Tuition (University Degree)",
              "CAD $28,000 – $55,000",
              "CAD $20,000 – $38,000",
            ],
            ["Monthly Shared Rent", "CAD $800 – $1,400", "CAD $550 – $900"],
            ["Groceries & Food", "CAD $300 – $450", "CAD $250 – $350"],
            ["Public Transit Pass", "CAD $100 – $160", "CAD $80 – $110"],
          ],
        },
      ],
    },
    {
      id: "accommodation-options",
      title: "Accommodation Options",
      blocks: [
        {
          type: "paragraph",
          text: "Securing housing early helps ensure a smooth transition upon arrival.",
        },
        {
          type: "image",
          src: "/editorial/canada-3.webp",
          alt: "Student bedroom with a desk and window",
          caption: "Example of student accommodation",
          width: 678,
          height: 452,
        },
        {
          type: "list",
          items: [
            "On-Campus Residences: Ideal for first-year undergraduate students. Fully furnished with included utilities, though spaces are limited and fill early.",
            "Off-Campus Shared Apartments/Houses: A common choice for college and Master's students. Renting a room in a multi-bedroom basement suite or shared house reduces monthly overhead.",
            "Homestay Programs: Living with a host family includes meals and a private room, offering an immediate cultural integration option.",
          ],
        },
      ],
    },
    {
      id: "part-time-work-post-graduation-work-permit-pgwp",
      title: "Part-Time Work & Post-Graduation Work Permit (PGWP)",
      blocks: [
        {
          type: "paragraph",
          text: "Canada sets specific work authorization guidelines for students during and after their studies.",
        },
        {
          type: "image",
          src: "/editorial/canada-4.webp",
          alt: "Students in graduation gowns walking together outdoors",
          caption: "Graduates celebrating completion of their studies",
          width: 387,
          height: 258,
        },
        {
          type: "list",
          items: [
            "Off-Campus Part-Time Work: Eligible full-time international students can work up to 24 hours per week off-campus during regular academic terms and full-time during official scheduled breaks.",
            "PGWP Eligibility & Duration:",
            "Graduates of eligible programmes lasting at least two years, or of eligible master’s programmes lasting at least eight months, may qualify for a PGWP of up to three years, subject to current IRCC eligibility rules and passport validity.",
            "Other eligible programmes between eight months and two years may qualify for a PGWP up to the programme length, depending on the rules and individual circumstances.",
            "Field-of-Study Rules & Language Benchmark: College diploma graduates must ensure their program aligns with designated high-demand labor sectors (such as STEM, Healthcare, Trades, Agriculture, Transport, or Education) and meet a minimum Canadian Language Benchmark (CLB 5) for PGWP eligibility. University degree graduates are exempt from field-of-study rules but must meet a CLB 7 benchmark.",
          ],
        },
      ],
    },
    {
      id: "essential-points-to-keep-in-mind",
      title: "Essential Points to Keep in Mind",
      blocks: [
        {
          type: "list",
          items: [
            "Extreme Weather Preparation: Canadian winters involve freezing temperatures dropping to -15°C to -30°C. Allocate CAD $500–$800 for thermal layers, insulated coats, and waterproof winter boots after landing.",
            "Maintain Full-Time Status: Dropping below full-time enrollment status without official university authorization violates study permit conditions and jeopardizes future PGWP eligibility.",
            "Scams & Private Housing Risks: Avoid transferring rental deposits or booking fees to unverified private landlords online. Use official institutional housing boards or verified listing platforms.",
          ],
        },
        {
          type: "paragraph",
          text: "Healthcare Registration: Health insurance policies vary by province. Some provinces include international students under public health care (e.g., BC Services Card), while others require compulsory enrollment in private health plans through your institution.",
        },
      ],
    },
  ],
  notice:
    "Costs, scholarship eligibility and admission conditions vary by institution and intake. Cost estimates are illustrative, not current quotations; verify exchange rates, fees and immigration rules before making a decision.",
  verificationNotice: [
    {
      text: "For the latest student visa and immigration requirements, consult the ",
    },
    {
      text: "official government guidance",
      href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html",
    },
    {
      text: " before submitting an application.",
    },
  ],
  cta: {
    eyebrow: "Plan your next step",
    title: "Discuss your study-abroad options",
    text: "Review course fit, entry requirements and budgeting with a counsellor.",
    links: [
      {
        label: "Free profile evaluation",
        to: "/programs/study-abroad#profile-evaluation",
      },
      {
        label: "Talk to a mentor",
        to: "/programs/study-abroad#talk-to-mentor",
      },
    ],
  },
};
