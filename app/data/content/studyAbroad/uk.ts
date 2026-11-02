import { isResourcePublished } from "../../resourceCatalog";
import type { CountryGuideContent } from "../types";

export const ukGuide: CountryGuideContent = {
  ready: isResourcePublished("/programs/study-abroad/uk"),
  slug: "uk",
  country: "United Kingdom",
  publishedAt: null,
  lastUpdated: "2026-10-30T20:29:43+05:30",
  effectiveAt: null,
  seo: {
    title: "Study in the UK: Complete Guide for Indian Students | College FAQs",
    description:
      "Explore studying in the United Kingdom: admissions, universities, student visas, budgets, accommodation and career considerations for Indian students.",
  },
  eyebrow: "Study Abroad • Destination Guide",
  title: "Study in the UK: Complete Guide for Indian Students",
  subtitle: "Costs, Scholarships, Accommodation & Careers",
  heroImage: {
    src: "/editorial/uk-1.webp",
    alt: "Historic red-brick university building with a lawn under a blue sky",
    caption: "Historic university architecture",
    width: 362,
    height: 276,
  },
  intro: [
    "Studying in the UK remains a popular higher-education option for Indian students. World-class universities, accelerated 1-year Master's degrees, and rich international exposure make it a compelling destination. However, planning the transition carefully can make applications and student life more manageable.",
    "Whether you are targeting Russell Group universities or looking at specialized regional institutions, here is a complete breakdown of everything you need to know before making the move.",
  ],
  highlights: [
    "Scholarships & Funding Your Education",
    "Budgeting & Financial Realities",
    "Accommodation: Halls vs. Private Rentals",
  ],
  sections: [
    {
      id: "scholarships-funding-your-education",
      title: "Scholarships & Funding Your Education",
      blocks: [
        {
          type: "paragraph",
          text: "The cost of studying in the UK can be steep, but early planning opens doors to significant financial aid.",
        },
        {
          type: "image",
          src: "/editorial/uk-2.webp",
          alt: "Students working at desks in a traditional university library",
          caption: "University library study spaces",
          width: 410,
          height: 243,
        },
        {
          type: "list",
          items: [
            "Prestigious Government Scholarships:",
            "Chevening Scholarship: Fully funded award covering tuition, living expenses, and flights for outstanding 1-year Master’s candidates with at least 2 years of work experience.",
            "GREAT Scholarships: Offers at least £10,000 toward tuition fees for various 1-year postgraduate courses across participating UK universities.",
            "Commonwealth Scholarships: Aimed at students from Commonwealth nations with strong academic records who demonstrate leadership potential.",
            "University-Specific Bursaries: Almost every UK university offers automatic international student discounts ranging from £1,000 to £5,000 based on undergraduate academic performance.",
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
          text: "Managing finances goes beyond paying tuition. You must also satisfy the UK Home Office's strict proof-of-funds (maintenance) requirement to secure your student visa.",
        },
        {
          type: "table",
          caption:
            "Indicative cost comparison from the source document; check current prices with your institution.",
          headers: ["Expense Category", "Inside London", "Outside London"],
          rows: [
            [
              "Visa Living Funds Required",
              "£1,529/month (up to 9 months)",
              "£1,171/month (up to 9 months)",
            ],
            ["Average Rent (Monthly)", "£700 – £1,200", "£450 – £850"],
            ["Groceries & Food", "£180 – £250", "£140 – £200"],
            ["Transport & Utilities", "£120 – £180", "£60 – £100"],
          ],
        },
        {
          type: "list",
          items: [
            "The 28-Day Rule: Required maintenance funds must sit in your or your parents' bank account for at least 28 consecutive days without dropping below the minimum threshold for even a single day.",
            "Upfront Visa Costs: Factor in the Student Visa fee (£558) and the compulsory Immigration Health Surcharge (IHS) of £776 per year, which grants full access to the UK's National Health Service (NHS).",
          ],
        },
      ],
    },
    {
      id: "accommodation-halls-vs-private-rentals",
      title: "Accommodation: Halls vs. Private Rentals",
      blocks: [
        {
          type: "paragraph",
          text: "Where you live directly shapes your daily university experience.",
        },
        {
          type: "image",
          src: "/editorial/uk-3.webp",
          alt: "Bright furnished student bedroom with a desk and shelving",
          caption: "Example of purpose-built student accommodation",
          width: 421,
          height: 237,
        },
        {
          type: "list",
          items: [
            "University Accommodation (Halls of Residence): Highly recommended for first-year Indian students. Utility bills (Wi-Fi, electricity, water, heating) are included, security is on-site 24/7, and it makes building a social circle straightforward.",
            "Private Purpose-Built Student Accommodation (PBSA): Managed by private companies (like Student Roost or AmberStudent). Modern and equipped with study lounges or gyms, though often pricier.",
            "Private Houses/Flats: Shared houses with flatmates are usually the cheapest option long-term. However, private landlords typically require a UK-based guarantor or up to 6 months of rent paid in advance if you have no UK credit history.",
          ],
        },
      ],
    },
    {
      id: "career-opportunities-post-study-work",
      title: "Career Opportunities & Post-Study Work",
      blocks: [
        {
          type: "list",
          items: [
            "Part-Time Work: Your Student Visa permits you to work up to 20 hours per week during term time and full-time during official course breaks. On-campus roles (student union, library assistant, campus ambassador) offer high flexibility around study schedules.",
            "The Graduate Route (PSW): Eligible graduates may apply for the Graduate visa after completing their studies. For bachelor’s and master’s graduates, the standard duration is two years for applications made by 31 December 2026 and 18 months for applications made on or after 1 January 2027; eligible doctoral graduates may receive three years. Check the current rules before making plans.",
            "In-Demand Fields: Data science, software engineering, finance, healthcare, renewable energy, and supply chain management currently show strong hiring appetite for international talent.",
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
            "Avoid Over-Reliance on Part-Time Jobs: Part-time earnings are meant to supplement personal pocket money, not cover your entire tuition fee or primary rent. 1-year Master's programs are academically intense.",
            "Scams & Deposit Fraud: Never transfer rental deposits or booking fees to private landlords before verifying the property or using a trusted listing service.",
            "Pre-CAS Credibility Interviews: Universities conduct strict credibility interviews to test your course knowledge, rationale for choosing the university, and financial authenticity. Treat this with the same seriousness as a job interview.",
            "Climate & Mental Health: UK winters involve short, dark days with 4:00 PM sunsets. Combined with academic pressure, this can trigger seasonal blues or homesickness. Stay connected with the university's Indian Society and utilize campus health services whenever needed.",
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
      href: "https://www.gov.uk/student-visa",
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
