import { isResourcePublished } from "../../resourceCatalog";
import type { CountryGuideContent } from "../types";

export const franceGuide: CountryGuideContent = {
  ready: isResourcePublished("/programs/study-abroad/france"),
  slug: "france",
  country: "France",
  publishedAt: null,
  lastUpdated: "2026-10-30T20:29:43+05:30",
  effectiveAt: null,
  seo: {
    title: "Study in France: Complete Guide for Indian Students | College FAQs",
    description:
      "Explore studying in France: admissions, universities, student visas, budgets, accommodation and career considerations for Indian students.",
  },
  eyebrow: "Study Abroad • Destination Guide",
  title: "Study in France: Complete Guide for Indian Students",
  subtitle:
    "Campus France, Visa, Housing Subsidies (CAF), Budget & Career Options",
  heroImage: {
    src: "/editorial/france-1.webp",
    alt: "Les Invalides building and its gold-domed roof in Paris",
    caption: "Parisian architecture and student life",
    width: 547,
    height: 365,
  },
  intro: [
    "France offers Indian students established academic institutions, vibrant culture, and subsidized living costs across Europe.",
    "France has established itself as one of Europe's premier study destinations for Indian students. Known for world-class public universities, prestigious Grandes Écoles, generous housing subsidies, and thousands of English-taught programs, France provides top-ranked education at an accessible price point.",
    "Here is a full breakdown of what you need to know before moving to France for your higher education.",
  ],
  highlights: [
    "Key University & Program Options",
    "Admission, Campus France & VLS-TS Visa Process",
    "Budgeting & Living Cost Breakdown",
  ],
  sections: [
    {
      id: "key-university-program-options",
      title: "Key University & Program Options",
      blocks: [
        {
          type: "paragraph",
          text: "Higher education in France is broadly divided into public research universities, specialized schools, and elite management institutions.",
        },
        {
          type: "paragraph",
          text: "French educational hubs combine rich academic heritage with modern, specialized facilities.",
        },
        {
          type: "list",
          items: [
            "Public Universities: Institutions such as Sorbonne University, Université Paris-Saclay, and PSL University offer world-renowned degree programs with heavily government-subsidized tuition fees.",
            "Grandes Écoles & Business Schools: Elite, highly selective institutions known for exceptional employment outcomes, including HEC Paris, INSEAD, ESSEC, EDHEC, ESCP, and NEOMA Business School.",
            "Engineering Schools: Top institutes like École Polytechnique, CentraleSupélec, and INSA Lyon excel in technology, computer science, and engineering fields.",
            "English-Taught Programs: Over 1,700 degree programs across business, engineering, management, and humanities are taught entirely in English.",
          ],
        },
      ],
    },
    {
      id: "admission-campus-france-vls-ts-visa-process",
      title: "Admission, Campus France & VLS-TS Visa Process",
      blocks: [
        {
          type: "paragraph",
          text: "Applying to French universities involves a mandatory centralized procedure through Campus France India.",
        },
        {
          type: "paragraph",
          text: "Navigating the Campus France portal and visa paperwork is key to securing your study permit.",
        },
        {
          type: "list",
          items: [
            "Études en France (EEF) Portal: Most Indian students must register and complete the online application process via the Campus France India portal.",
            "Campus France Interview: After submitting your academic transcripts and university offer letter, attend an interview with a Campus France advisor to validate your academic background and motivation.",
            "Long-Stay Student Visa (VLS-TS):",
            "Proof of Financial Means: Applicants must demonstrate liquid funds of at least €877.50 per month (or ~€10,530 per year) for living expenses, in addition to tuition coverage.",
            "OFII Validation: Upon arrival in France, validate your VLS-TS visa online through the official immigration portal to register as a legal resident.",
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
          text: "While private business schools charge higher fees, public universities and government subsidies make overall expenses in France manageable compared to the US or UK.",
        },
        {
          type: "paragraph",
          text: "Quiet university libraries and municipal study halls support student research and coursework.",
        },
        {
          type: "paragraph",
          text: "Planning your budget helps balance living costs, monthly transit passes, and food expenses.",
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
            [
              "UG Tuition (Public Universities)",
              "€2,895 / year",
              "₹2.6 Lakhs / year",
            ],
            [
              "PG Tuition (Public Universities)",
              "€3,941 / year",
              "₹3.5 Lakhs / year",
            ],
            [
              "Business / Engineering Schools",
              "€11,000 – 24,000 / year",
              "₹10.0 – 21.5 Lakhs / year",
            ],
            [
              "Shared Apartment Rent (Paris)",
              "€650 – 1,100 / month",
              "₹58,000 – 98,000 / month",
            ],
            [
              "Shared Rent (Regions: Lyon, Toulouse)",
              "€400 – 700 / month",
              "₹35,000 – 62,000 / month",
            ],
            [
              "CROUS University Dormitory",
              "€250 – 450 / month",
              "₹22,000 – 40,000 / month",
            ],
            [
              "Food & Groceries",
              "€200 – 350 / month",
              "₹18,000 – 31,000 / month",
            ],
            [
              "Public Transit Pass (Navigo / Regional)",
              "€35 – 85 / month",
              "₹3,100 – 7,600 / month",
            ],
          ],
        },
      ],
    },
    {
      id: "accommodation-housing-allowance-caf",
      title: "Accommodation & Housing Allowance (CAF)",
      blocks: [
        {
          type: "image",
          src: "/editorial/france-2.webp",
          alt: "Student room with a bed and writing desk",
          caption: "Example of student accommodation in France",
          width: 680,
          height: 451,
        },
        {
          type: "paragraph",
          text: "France provides a unique financial support mechanism for international students through government housing subsidies.",
        },
        {
          type: "paragraph",
          text: "Student dormitories and private studio apartments qualify for monthly housing assistance.",
        },
        {
          type: "list",
          items: [
            "CROUS Public Housing: University-managed student residences offering affordable single rooms and studio apartments. Demand is high, so early application via the CROUS portal is essential.",
            "Private Student Residences & Apartments: Private platforms (like Studapart, Adele, or SeLoger) offer private studios or shared flatshares (colocation).",
            "CAF Housing Assistance (APL): International students in France can apply for CAF (Caisse d'Allocations Familiales) housing aid. Eligible students may apply for housing support through CAF, with the amount calculated individually; assistance and payment methods are not guaranteed.",
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
          text: "France offers clear pathways for international students to work during their studies and build careers after graduation.",
        },
        {
          type: "paragraph",
          text: "Graduating from French institutions grants access to career networks across the European Union.",
        },
        {
          type: "paragraph",
          text: "Major corporate districts like La Défense host global headquarters in consulting, tech, and luxury.",
        },
        {
          type: "list",
          items: [
            "Part-Time Work Allowance: International students holding a VLS-TS visa are legally allowed to work up to 964 hours per year (60% of full-time annual hours), earning at least the national legal minimum wage (SMIC).",
            "Mandatory Paid Internships (Stage): Most Master’s degree programs require a 4 to 6-month paid internship, providing invaluable hands-on corporate experience.",
            "Post-Study Work Permit (APS / RECE):",
            "Master’s graduates can apply for a 2-year Post-Study Work Permit (RECE) to seek employment or start a business.",
            "Securing a job paying at least 1.5 times the minimum wage allows conversion to a professional Talent Passport or employee residence permit.",
            "Schengen Mobility: A French student visa grants visa-free travel across all 29 Schengen area countries.",
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
            "Learn Conversational French: While your academic program may be in English, learning basic French (A2/B1 level) is vital for daily life, social integration, and local job placements.",
            "Health Insurance (Sécurité Sociale): International students register for French social security for free, covering approximately 70% of medical costs (often supplemented by student mutuelle insurance).",
            "Guarantor Requirements (Visale): Landlords typically require a financial guarantor. Overseas students can use Visale, a free government scheme that acts as a rental guarantor for young adults.",
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
      href: "https://www.campusfrance.org/en",
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
