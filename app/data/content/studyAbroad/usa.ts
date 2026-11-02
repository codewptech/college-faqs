import { isResourcePublished } from "../../resourceCatalog";
import type { CountryGuideContent } from "../types";

export const usaGuide: CountryGuideContent = {
  ready: isResourcePublished("/programs/study-abroad/usa"),
  slug: "usa",
  country: "United States",
  publishedAt: null,
  lastUpdated: "2026-10-30T20:29:43+05:30",
  effectiveAt: null,
  seo: {
    title:
      "Study in the USA: Complete Guide for Indian Students | College FAQs",
    description:
      "Explore studying in the United States: admissions, universities, student visas, budgets, accommodation and career considerations for Indian students.",
  },
  eyebrow: "Study Abroad • Destination Guide",
  title: "Study in the USA: Complete Guide for Indian Students",
  subtitle: "Costs, OPT, Scholarships & Living",
  heroImage: {
    src: "/editorial/usa-1.webp",
    alt: "Red-brick university building with windows along a pedestrian path",
    caption: "University campus architecture",
    width: 387,
    height: 258,
  },
  intro: [
    "The United States continues to be the a leading study-abroad destination for Indian international students. Renowned for academic flexibility, cutting-edge research facilities, and post-study practical training options, America offers wide-ranging global opportunities.",
    "However, navigating the multi-tiered application process, high financial commitments, and complex visa rules requires strategic preparation. Here is everything you need to know about pursuing your education in the US.",
  ],
  highlights: [
    "Scholarships & Financial Assistance",
    "Budgeting & Financial Realities",
    "Accommodation: On-Campus Dorms vs. Off-Campus Apartments",
  ],
  sections: [
    {
      id: "scholarships-financial-assistance",
      title: "Scholarships & Financial Assistance",
      blocks: [
        {
          type: "paragraph",
          text: "While tuition in the United States is among the highest globally, US institutions also offer substantial financial aid options for high-performing students.",
        },
        {
          type: "image",
          src: "/editorial/usa-2.webp",
          alt: "Two university students reading and writing in a library",
          caption: "Students studying in a university library",
          width: 739,
          height: 415,
        },
        {
          type: "paragraph",
          text: "Academic libraries offer quiet spaces for research and coursework.",
        },
        {
          type: "list",
          items: [
            "Fulbright-Nehru Fellowships: Eligible Indian applicants to specified master’s and research programmes can explore Fulbright-Nehru opportunities; award coverage and eligibility depend on the particular fellowship.",
            "Graduate Assistantships (TA/RA): Master's and PhD students can apply for Teaching Assistantships (TA) or Research Assistantships (RA). These typically grant a tuition waiver plus a monthly stipend in exchange for 15–20 hours of work per week.",
            "Merit Scholarships: Most private and public universities evaluate applicants automatically for merit-based tuition discounts ranging from $5,000 to full tuition during the standard admissions review.",
          ],
        },
      ],
    },
    {
      id: "budgeting-financial-realities",
      title: "Budgeting & Financial Realities",
      blocks: [
        {
          type: "paragraph",
          text: "Your university and US consular process may require evidence that you can cover the estimated cost of attendance. The school uses financial documentation when issuing Form I-20; the consular officer independently assesses your F-1 visa application.",
        },
        {
          type: "table",
          caption:
            "Indicative cost comparison from the source document; check current prices with your institution.",
          headers: [
            "Expense Category",
            "High-Cost Cities (NY, SF, Boston)",
            "Mid/Low-Cost Cities (Texas, Midwest)",
          ],
          rows: [
            [
              "Annual Tuition (Average)",
              "$30,000 – $65,000",
              "$18,000 – $38,000",
            ],
            ["Monthly Rent & Utilities", "$1,200 – $2,200", "$500 – $950"],
            ["Groceries & Food", "$300 – $500", "$200 – $350"],
            ["Health Insurance (Annual)", "$1,500 – $3,500", "$1,200 – $2,500"],
          ],
        },
        {
          type: "list",
          items: [
            "Form I-20 & Financial Proof: You must show liquid funds (savings, fixed deposits, or approved education loans) equal to or exceeding the total estimated cost listed on your university's I-20 form.",
            "Mandatory Health Insurance: Healthcare in the US is extremely expensive. University health insurance plans are compulsory unless you obtain an approved waiver with an equivalent private policy.",
          ],
        },
      ],
    },
    {
      id: "accommodation-on-campus-dorms-vs-off-campus-apartments",
      title: "Accommodation: On-Campus Dorms vs. Off-Campus Apartments",
      blocks: [
        {
          type: "paragraph",
          text: "Where you live depends heavily on your budget and academic level.",
        },
        {
          type: "image",
          src: "/editorial/usa-3.webp",
          alt: "Furnished student studio apartment with a bed, desk and kitchenette",
          caption: "Example of student accommodation",
          width: 856,
          height: 358,
        },
        {
          type: "list",
          items: [
            "On-Campus Housing (Dorms): Common for undergraduate freshmen. It includes meal plans, high-speed Wi-Fi, and utilities, though it generally costs more per semester than sharing an apartment off-campus.",
            "Off-Campus Shared Apartments: Preferred by Master’s and PhD students. Renting an apartment or house with 2–4 roommates drastically cuts monthly expenses.",
            "Lease Agreements: Expect to pay a 1-month security deposit upfront. Many leasing offices require a US social security number (SSN) or a guarantor; without one, you may need to pay an extra security deposit.",
          ],
        },
      ],
    },
    {
      id: "career-opportunities-cpt-opt-pathways",
      title: "Career Opportunities, CPT & OPT Pathways",
      blocks: [
        {
          type: "paragraph",
          text: "The primary draw for international students in the US is the clear practical training pathway following graduation.",
        },
        {
          type: "image",
          src: "/editorial/usa-4.webp",
          alt: "Graduates celebrating outdoors in academic gowns and mortarboards",
          caption: "Graduation celebration",
          width: 678,
          height: 452,
        },
        {
          type: "list",
          items: [
            "On-Campus Jobs (F-1 Rules): F-1 visa holders can work up to 20 hours per week on campus during academic semesters and up to 40 hours during official summer/winter breaks. Off-campus employment without explicit authorization is strictly illegal.",
            "Curricular Practical Training (CPT): Allows you to take paid off-campus internships directly related to your major while still completing your degree.",
            "Optional Practical Training (OPT): Grants 1 year of full-time work authorization post-graduation.",
            "STEM OPT Extension: Graduates in Science, Technology, Engineering, and Math (STEM) fields qualify for an additional 24-month extension, giving them a total of 3 years (36 months) to work in the US without needing an H-1B visa immediately.",
          ],
        },
      ],
    },
    {
      id: "points-to-be-careful-of",
      title: "Points to Be Careful Of",
      blocks: [
        {
          type: "list",
          items: [
            "F-1 Visa Interview Rigor: Unlike point-based visa systems, the US F-1 visa depends on a 2-to-3-minute in-person consular interview. You must convincingly demonstrate non-immigrant intent (ties to India) and clear financial capability.",
            'Unauthorized Off-Campus Work: Working illegally ("under the table") at off-campus stores or restaurants violates F-1 status and will result in immediate visa termination and deportation.',
            "Credit Score Culture: Credit cards drive the US financial system. Apply for a student credit card (like Discover it Student or Deserve) early to build credit history, which is vital for securing rentals, phone plans, and car loans later.",
            "GPA Requirements: Graduate programs typically enforce a strict minimum 3.0 GPA requirement. Dropping below this threshold can put you on academic probation or jeopardize your F-1 status.",
          ],
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
      href: "https://studyinthestates.dhs.gov/students",
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
