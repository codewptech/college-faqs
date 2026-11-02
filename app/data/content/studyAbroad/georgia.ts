import { isResourcePublished } from "../../resourceCatalog";
import type { CountryGuideContent } from "../types";

export const georgiaGuide: CountryGuideContent = {
  ready: isResourcePublished("/programs/study-abroad/georgia"),
  slug: "georgia",
  country: "Georgia",
  publishedAt: null,
  lastUpdated: "2026-10-30T20:29:43+05:30",
  effectiveAt: null,
  seo: {
    title:
      "Study in Georgia: Complete Guide for Indian Students | College FAQs",
    description:
      "Explore studying in Georgia: admissions, universities, student visas, budgets, accommodation and career considerations for Indian students.",
  },
  eyebrow: "Study Abroad • Destination Guide",
  title: "Study in Georgia: Complete Guide for Indian Students",
  subtitle: "D3 Visa, TRP, Cost of Living, Top Universities & Career Pathways",
  heroImage: {
    src: "/editorial/georgia-3.webp",
    alt: "Multi-storey student housing buildings around a courtyard at dusk",
    caption: "Example of student residential buildings",
    width: 1160,
    height: 773,
  },
  intro: [
    "Located at the intersection of Eastern Europe and Western Asia, Georgia offers high-quality, European-standard education at comparatively affordable costs.",
    "Georgia has rapidly emerged as one of the most sought-after international study hubs for Indian students—particularly those pursuing MBBS/MD (Medicine), IT, and Business Administration. With European-aligned curricula, English-taught programmes at selected universities, affordable living, and high global accreditation, Georgia provides an attractive alternative to traditional destinations.",
    "Here is a comprehensive breakdown of everything you need to know before moving to Georgia for your higher studies.",
  ],
  highlights: [
    "Key University & Program Options",
    "Admission, D3 Visa Process & Temporary Residence Permit (TRP)",
    "Budgeting & Living Cost Breakdown",
  ],
  sections: [
    {
      id: "key-university-program-options",
      title: "Key University & Program Options",
      blocks: [
        {
          type: "paragraph",
          text: "Georgia’s education system follows the European Higher Education Area (EHEA) and Bologna process standards.",
        },
        {
          type: "paragraph",
          text: "Georgian universities offer modern infrastructure, clinical skills labs, and internationally recognized faculties.",
        },
        {
          type: "list",
          items: [
            "Top Medical Universities (MBBS / MD Physician): The client guide lists Tbilisi State Medical University, Georgian National University SEU, David Tvildiani Medical University, University of Georgia, New Vision University and European University. Independently verify the institution, the specific medical programme and compliance with India’s current NMC foreign medical graduate regulations before applying. Listing in an international directory does not itself establish recognition for Indian medical registration.",
            "Business, IT & Engineering Hubs: Universities like Ilia State University, Caucasus University, and Tbilisi State University (TSU) offer well-regarded undergraduate and master's degrees in Computer Science, Data Science, International Business, and Management.",
            "No IELTS Mandatory: Many Georgian universities waive formal English proficiency tests (like IELTS/TOEFL) if your medium of instruction during high school or previous study was English.",
          ],
        },
      ],
    },
    {
      id: "admission-d3-visa-process-temporary-residence-permit-trp",
      title: "Admission, D3 Visa Process & Temporary Residence Permit (TRP)",
      blocks: [
        {
          type: "paragraph",
          text: "The admission and visa pathway for Georgia is straightforward and direct.",
        },
        {
          type: "paragraph",
          text: "Apostilled certificates and university invitation letters are essential for your Georgian D3 visa.",
        },
        {
          type: "list",
          items: [
            "Document Legalization (Apostille): Your Class 10 and 12 mark sheets (and degree transcripts, if applicable) must be apostilled by the Ministry of External Affairs (MEA) in India.",
            "Ministry Order & University Invitation Letter: Once documents are verified and processed through the Ministry of Education and Science of Georgia, the university issues a formal admission order and invitation letter.",
            "D3 Immigration Visa:",
            "Confirm the appropriate D3 student visa application channel with Georgia’s official consular service before applying.",
            "Required proof of funds generally involves showing a bank statement covering one year's fees and basic living costs.",
            "Temporary Residence Permit (TRP): Upon arriving in Georgia, students must apply for a TRP card via the Public Service Hall in Tbilisi (or their local university center) within the applicable statutory deadline. The TRP permits legal stay throughout your study program.",
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
          text: "Georgia offers one of the lowest living budgets among European-style study destinations.",
        },
        {
          type: "paragraph",
          text: "Modern study spaces and digital libraries provide quiet learning environments across campuses.",
        },
        {
          type: "paragraph",
          text: "Transparent tuition structures and low monthly expenses simplify financial planning.",
        },
        {
          type: "table",
          caption:
            "Indicative cost comparison from the source document; check current prices with your institution.",
          headers: [
            "Expense Category",
            "Annual / Monthly Cost (USD / GEL)",
            "Annual / Monthly Cost (INR Approx.)",
          ],
          rows: [
            [
              "MBBS / MD Tuition",
              "$4,000 – $8,000 / year",
              "₹3.3 – ₹6.7 Lakhs / year",
            ],
            [
              "Bachelor's / Master's Tuition (IT/Business)",
              "$2,500 – $7,000 / year",
              "₹2.1 – ₹5.8 Lakhs / year",
            ],
            [
              "University Hostel Room",
              "$100 – $250 / month",
              "₹8,300 – ₹20,800 / month",
            ],
            [
              "Shared Off-Campus Apartment",
              "$150 – $350 / month",
              "₹12,500 – ₹29,000 / month",
            ],
            [
              "Food & Groceries",
              "$100 – $200 / month",
              "₹8,300 – ₹16,600 / month",
            ],
            [
              "Public Transit Pass (Metro/Bus)",
              "GEL 30 – 40 / month",
              "₹900 – ₹1,200 / month",
            ],
            [
              "Mandatory Health Insurance",
              "$100 – $300 / year",
              "₹8,300 – ₹25,000 / year",
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
          type: "paragraph",
          text: "Finding comfortable and budget-friendly student housing in Tbilisi, Batumi, or Kutaisi is simple.",
        },
        {
          type: "paragraph",
          text: "Off-campus rental apartments and university-managed dormitories offer safe, convenient housing.",
        },
        {
          type: "list",
          items: [
            "University Hostels: Many private and public institutions offer dormitory-style housing equipped with Wi-Fi, laundry facilities, shared kitchens, and security.",
            "Private Rented Apartments: Many Indian students opt to rent 2- or 3-bedroom flats together in Tbilisi (popular areas include Saburtalo, Vake, and Didube).",
            "Indian Mess & Grocery Stores: Due to the large population of Indian medical students, numerous Indian restaurants, mess catering services, and specialty stores stocking lentils, spices, and ingredients operate near major campuses.",
          ],
        },
      ],
    },
    {
      id: "part-time-work-career-trajectory",
      title: "Part-Time Work & Career Trajectory",
      blocks: [
        {
          type: "paragraph",
          text: "Understanding work rules and post-graduation pathways is important for long-term planning.",
        },
        {
          type: "paragraph",
          text: "Graduating with a European-accredited degree prepares students for global medical and corporate licensure.",
        },
        {
          type: "paragraph",
          text: "Tbilisi’s expanding IT and commercial sectors provide practical internship avenues.",
        },
        {
          type: "list",
          items: [
            "Part-Time Work Regulations: Students holding a valid TRP can legally take up part-time employment; however, full-time study (especially in intensive 6-year MBBS programs) leaves limited time for work. Most job options require basic proficiency in Georgian or Russian.",
            "Clinical Rotations & Internships: For medical students, 6-year programs incorporate integrated clinical rotations in university-affiliated hospitals.",
            "Medical Licensure Pathways (FMGE / NExT & USMLE):",
            "India: Indian citizens seeking to practise medicine in India after studying abroad must satisfy the NMC’s applicable foreign medical graduate eligibility, programme and licensing requirements. An overseas degree does not itself guarantee Indian registration.",
            "USA / Europe: Institutions following US-aligned curricula (e.g., DTMU) train students specifically for USMLE Step exams or European licensing pathways.",
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
            "Currency: The national currency is the Georgian Lari (GEL), though university tuition fees are billed in USD.",
            "Weather: Georgia experiences mild winters and warm summers (ranging from 0°C in winter to 30°C in summer), requiring basic winter clothing for the colder months.",
            "Safety & Hospitality: Georgia consistently ranks among the safest countries in Europe, with a welcoming local culture and vibrant international student community.",
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
      href: "https://www.geoconsul.gov.ge/en",
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
