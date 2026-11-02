import { isResourcePublished } from "../../resourceCatalog";
import type { CountryGuideContent } from "../types";

export const germanyGuide: CountryGuideContent = {
  ready: isResourcePublished("/programs/study-abroad/germany"),
  slug: "germany",
  country: "Germany",
  publishedAt: null,
  lastUpdated: "2026-10-30T20:29:43+05:30",
  effectiveAt: null,
  seo: {
    title:
      "Study in Germany: Complete Guide for Indian Students | College FAQs",
    description:
      "Explore studying in Germany: admissions, universities, student visas, budgets, accommodation and career considerations for Indian students.",
  },
  eyebrow: "Study Abroad • Destination Guide",
  title: "Study in Germany: Complete Guide for Indian Students",
  subtitle:
    "APS Certificate, Blocked Account, Tuition-Free Universities & 18-Month Job Visa",
  heroImage: {
    src: "/editorial/germany-1.webp",
    alt: "Reichstag building in Berlin under a blue sky with German flags",
    caption: "Berlin city architecture",
    width: 690,
    height: 409,
  },
  intro: [
    "Germany offers world-class, tuition-free higher education combined with exceptional post-graduation career opportunities in Europe's largest economy.",
    "Germany stands out as one of the premier global study destinations for Indian students. Renowned for its engineering prowess, cutting-edge research facilities, tuition-free public universities, and structured post-study work avenues, Germany offers an wide-ranging return on investment for international students.",
    "Here is a comprehensive breakdown of everything you need to know before moving to Germany for your higher studies.",
  ],
  highlights: [
    "Key University Options & Academic Pathways",
    "Mandatory Verification (APS), Blocked Account & Visa Process",
    "Budgeting & Living Cost Breakdown",
  ],
  sections: [
    {
      id: "key-university-options-academic-pathways",
      title: "Key University Options & Academic Pathways",
      blocks: [
        {
          type: "image",
          src: "/editorial/germany-2.webp",
          alt: "Modern glass-fronted university building",
          caption: "Example of contemporary academic facilities",
          width: 679,
          height: 451,
        },
        {
          type: "paragraph",
          text: "Germany’s higher education landscape distinguishes between research-focused public universities and application-oriented institutions.",
        },
        {
          type: "paragraph",
          text: "German universities combine rigorous technical education with modern industrial partnerships.",
        },
        {
          type: "list",
          items: [
            "Public University Tuition Policies: Renowned research hubs like TU Munich (TUM), LMU Munich, RWTH Aachen, TU Berlin, and Heidelberg University often charge no tuition for many courses, although some universities, states, and categories of international students have tuition fees. Semester contributions and exceptions must be checked institution by institution.",
            "Universities of Applied Sciences (Fachhochschulen): Institutions like TH Köln or Munich UAS focus heavily on practical application, industry projects, and direct corporate internships.",
            "Studienkolleg Pathway: Indian high school graduates (Class 12) directly entering a bachelor's program may need a 1-year preparatory foundation course (Studienkolleg) unless meeting direct university admission thresholds.",
            "English-Taught Master's Degrees: Over 2,000 Master's programs across Data Science, Automotive Engineering, Renewable Energy, Business, and Management are taught completely in English.",
          ],
        },
      ],
    },
    {
      id: "mandatory-verification-aps-blocked-account-visa-process",
      title: "Mandatory Verification (APS), Blocked Account & Visa Process",
      blocks: [
        {
          type: "paragraph",
          text: "Studying in Germany requires navigating specific mandatory regulatory steps.",
        },
        {
          type: "paragraph",
          text: "Securing your APS certificate and blocked account are mandatory prerequisites for the German student visa.",
        },
        {
          type: "list",
          items: [
            "APS Certificate (Akademische Prüfstelle):",
            "Mandatory document verification for all Indian degree/certificate holders before applying for a university slot or student visa.",
            "Costs ₹18,000 and issues a lifetime-valid digital PDF verifying your Indian academic credentials.",
            "German Blocked Account (Sperrkonto):",
            "Proof of financial resources required for your visa application.",
            "You must deposit €11,904 per year (€992 per month) into an approved provider (such as Expatrio, Coracle, or Fintiba). Once in Germany, you withdraw up to €992 monthly to cover basic living costs.",
            "National Student Visa (Category D):",
            "Apply through VFS Global upon obtaining your university admission letter, APS certificate, and Blocked Account confirmation.",
          ],
        },
      ],
    },
    {
      id: "budgeting-living-cost-breakdown",
      title: "Budgeting & Living Cost Breakdown",
      blocks: [
        {
          type: "paragraph",
          text: "While public universities eliminate tuition expenses, managing personal living costs is central to student budgeting.",
        },
        {
          type: "paragraph",
          text: "Effective budgeting helps manage monthly housing, groceries, transit, and health insurance.",
        },
        {
          type: "paragraph",
          text: "Public university libraries provide free research resources and study halls.",
        },
        {
          type: "table",
          caption:
            "Indicative cost comparison from the source document; check current prices with your institution.",
          headers: [
            "Expense Category",
            "Annual / Monthly Cost (€ - EUR)",
            "Annual / Monthly Cost (INR Approx.)",
          ],
          rows: [
            ["Public University Tuition", "€0 (Free)", "₹0"],
            [
              "Semester Contribution (Semesterbeitrag)",
              "€150 – €400 / semester",
              "₹13,500 – ₹36,000 / semester",
            ],
            [
              "Private University Tuition",
              "€9,000 – €16,000 / year",
              "₹8.1 – ₹14.4 Lakhs / year",
            ],
            [
              "Public Student Dorm (Studentenwerk)",
              "€250 – €400 / month",
              "₹22,000 – ₹36,000 / month",
            ],
            [
              "Shared Flat (WG - Wohngemeinschaft)",
              "€400 – €700 / month",
              "₹36,000 – ₹63,000 / month",
            ],
            [
              "Public Health Insurance (Mandatory)",
              "€120 – €130 / month",
              "₹10,800 – ₹11,700 / month",
            ],
            [
              "Groceries & Utilities",
              "€200 – €300 / month",
              "₹18,000 – ₹27,000 / month",
            ],
            [
              "Public Transit Pass",
              "Often included in Semester Fee",
              "Covered by Student Pass",
            ],
          ],
        },
      ],
    },
    {
      id: "accommodation-options",
      title: "Accommodation Options",
      blocks: [
        {
          type: "image",
          src: "/editorial/germany-3.webp",
          alt: "Compact student studio with a bed, kitchenette and desk",
          caption: "Student housing example",
          width: 679,
          height: 452,
        },
        {
          type: "paragraph",
          text: "Finding student housing in Germany requires early preparation, as demand in major cities is high.",
        },
        {
          type: "paragraph",
          text: "Living in a shared apartment (WG) or public student dormitory is the standard housing choice.",
        },
        {
          type: "list",
          items: [
            "Studentenwerk Dormitories: Publicly subsidized dorms offering the most affordable rooms. Apply as soon as you receive your university admission letter due to waiting lists.",
            "Shared Apartments (WG - Wohngemeinschaft): The most common living arrangement for international students in Germany. Rooms are searched via portals like WG-Gesucht.",
            "Private Student Residences: Fully furnished modern studios managed by private providers, offering places at higher monthly rents.",
          ],
        },
      ],
    },
    {
      id: "part-time-work-rules-post-study-career-prospects",
      title: "Part-Time Work Rules & Post-Study Career Prospects",
      blocks: [
        {
          type: "paragraph",
          text: "Germany grants generous work rights during your studies and an extended job-search period after graduation.",
        },
        {
          type: "paragraph",
          text: "Earning a degree from a German public university provides direct entry into the European job market.",
        },
        {
          type: "paragraph",
          text: "Industrial regions around Munich, Stuttgart, Frankfurt, and Berlin offer massive hiring demand.",
        },
        {
          type: "list",
          items: [
            "Part-Time Work Rights: International students can work up to 140 full days or 280 half days per calendar year (or 20 hours per week during working semesters).",
            "Working Student Jobs (Werkstudent): High-value corporate positions related to your field of study, offering competitive wages (€14–€20/hour) and relevant industry experience.",
            "18-Month Post-Study Work Visa:",
            "After graduation, international students qualify for an 18-month Job Seeking Visa (Aufenthaltserlaubnis zur Arbeitsplatzsuche).",
            "Securing a full-time position matching your qualifications leads directly to an EU Blue Card or a standard German Employment Residence Permit.",
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
            "German Language Requirement: While your courses may be in English, learning German to at least B1/B2 level is indispensable for securing internships, navigating local administration, and landing full-time corporate jobs.",
            "Plan APS Early: Apply for your APS certificate 4 to 6 months in advance of university admission deadlines to avoid visa delays.",
            "Health Insurance Coverage: Mandatory statutory health insurance (AOK, TK, or Barmer) guarantees comprehensive, low-cost medical care across Germany.",
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
      href: "https://www.make-it-in-germany.com/en/visa-recognition/visa-types/studying",
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
