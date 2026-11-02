import { isResourcePublished } from "../../resourceCatalog";
import type { CountryGuideContent } from "../types";

export const uaeGuide: CountryGuideContent = {
  ready: isResourcePublished("/programs/study-abroad/uae"),
  slug: "uae",
  country: "United Arab Emirates",
  publishedAt: null,
  lastUpdated: "2026-10-30T20:29:43+05:30",
  effectiveAt: null,
  seo: {
    title:
      "Study in the UAE: Complete Guide for Indian Students | College FAQs",
    description:
      "Explore studying in the United Arab Emirates: admissions, universities, student visas, budgets, accommodation and career considerations for Indian students.",
  },
  eyebrow: "Study Abroad • Destination Guide",
  title: "Study in the UAE: Complete Guide for Indian Students",
  subtitle: "Campus Options, Admissions, Visa, Housing & Career Opportunities",
  heroImage: {
    src: "/editorial/uae-1.webp",
    alt: "Burj Khalifa and illuminated Dubai skyline at night",
    caption: "Dubai skyline",
    width: 715,
    height: 429,
  },
  intro: [
    "Dubai skyline and world-class academic infrastructure offer Indian students a vibrant international learning destination.",
    "The United Arab Emirates (UAE) has transformed into a major global education destination for Indian students. Combining globally recognized degrees, zero income tax, high quality of life, and safety, the UAE offers a compelling alternative to Western countries—all within a short 3- to 4-hour flight from India.",
    "Here is a full, step-by-step pictorial guide covering everything you need to know before moving to the UAE for higher education.",
  ],
  highlights: [
    "University & Campus Options",
    "Admission & Student Visa Process",
    "Tuition & Cost of Living Breakdown",
  ],
  sections: [
    {
      id: "university-campus-options",
      title: "University & Campus Options",
      blocks: [
        {
          type: "image",
          src: "/editorial/uae-2.webp",
          alt: "Modern curved university campus architecture",
          caption: "Contemporary campus facilities",
          width: 594,
          height: 386,
        },
        {
          type: "paragraph",
          text: "The UAE features a diverse higher education ecosystem comprising premier national research universities, international branch campuses, and well-known Indian university off-campuses.",
        },
        {
          type: "paragraph",
          text: "Modern academic facilities across UAE educational hubs like Dubai International Academic City (DIAC) and University City Sharjah.",
        },
        {
          type: "list",
          items: [
            "Top Global Branch Campuses: Premier international universities—such as Heriot-Watt University Dubai, University of Wollongong in Dubai (UOWD), Middlesex University Dubai, and Rochester Institute of Technology (RIT) Dubai—issue identical degrees to their home campuses in the UK, Australia, and the US.",
            "Established Indian Campuses: Institutions like BITS Pilani Dubai Campus, Manipal Academy of Higher Education (MAHE) Dubai, and Amity University Dubai provide familiar academic structures with strong regional alumni networks.",
            "Leading Public & Research Universities: High-ranking federal and regional universities, including Khalifa University, UAE University (UAEU), and American University of Sharjah (AUS), offer generous STEM research grants and state-of-the-art facilities.",
          ],
        },
      ],
    },
    {
      id: "admission-student-visa-process",
      title: "Admission & Student Visa Process",
      blocks: [
        {
          type: "paragraph",
          text: "Admission processes in the UAE are streamlined, with primary intakes in September (Fall) and secondary intakes in January (Spring).",
        },
        {
          type: "paragraph",
          text: "Thorough document verification and MEA attestation are essential steps for UAE student visa processing.",
        },
        {
          type: "paragraph",
          text: "Certificate Attestation Pipeline",
        },
        {
          type: "paragraph",
          text: "To complete university enrollment and visa issuance, Indian academic certificates (Grade 10/12 marksheets or Bachelor's degrees) must undergo a three-tier attestation process:",
        },
        {
          type: "list",
          items: [
            "State Level: Attestation by the State Education Department / HRD in India.",
            "National Level: Attestation by the Ministry of External Affairs (MEA) in New Delhi.",
            "UAE Diplomatic Level: Final attestation by the UAE Embassy in New Delhi or the UAE Consulate in Mumbai/Chennai.",
          ],
        },
        {
          type: "paragraph",
          text: "Residence Visa & Emirates ID",
        },
        {
          type: "list",
          items: [
            "University Sponsorship: Most full-time international students receive an annual renewable Student Residence Visa sponsored directly by their university.",
            "Medical Fitness & Biometrics: Upon entry into the UAE, students complete a routine medical screening (blood test & chest X-ray) and biometric registration to receive their official Emirates ID card.",
          ],
        },
        {
          type: "paragraph",
          text: "The UAE Golden Visa for High Achievers",
        },
        {
          type: "paragraph",
          text: "The UAE offers long-term residence options that eliminate the need for standard university or employer sponsorship:",
        },
        {
          type: "list",
          items: [
            "5-Year Student Golden Visa: Available to high school graduates who secure 95% or higher in Grade 12 board examinations (CBSE, ICSE, or State Boards).",
            "10-Year University Golden Visa: Awarded to university graduates maintaining a cumulative GPA of 3.5 to 3.8+ (depending on institution ranking) or graduates from top 100 global universities.",
          ],
        },
      ],
    },
    {
      id: "tuition-cost-of-living-breakdown",
      title: "Tuition & Cost of Living Breakdown",
      blocks: [
        {
          type: "paragraph",
          text: "Financial planning requires accounting for annual tuition fees alongside monthly accommodation, transport, and daily living expenses.",
        },
        {
          type: "paragraph",
          text: "Dedicated quiet study halls and modern digital libraries support students throughout their academic term.",
        },
        {
          type: "paragraph",
          text: "Structured monthly budgeting helps manage accommodation, food, and urban transit pass costs.",
        },
        {
          type: "table",
          caption:
            "Indicative cost comparison from the source document; check current prices with your institution.",
          headers: [
            "Expense Category",
            "Annual / Monthly Cost (AED)",
            "Equivalent Cost in INR (Approx.)",
          ],
          rows: [
            [
              "Undergraduate Tuition (Indian Campuses)",
              "AED 30,000 – AED 60,000 / year",
              "₹6.8 Lakhs – ₹13.6 Lakhs / year",
            ],
            [
              "Undergraduate Tuition (Western Campuses)",
              "AED 45,000 – AED 85,000 / year",
              "₹10.2 Lakhs – ₹19.3 Lakhs / year",
            ],
            [
              "Postgraduate / MBA Tuition",
              "AED 50,000 – AED 110,000 / year",
              "₹11.3 Lakhs – ₹25.0 Lakhs / year",
            ],
            [
              "Shared Apartment Rent (Off-Campus)",
              "AED 1,500 – AED 2,800 / month",
              "₹34,000 – ₹63,000 / month",
            ],
            [
              "On-Campus Hostel Room",
              "AED 2,000 – AED 3,800 / month",
              "₹45,000 – ₹86,000 / month",
            ],
            [
              "Groceries & Food Expenses",
              "AED 800 – AED 1,200 / month",
              "₹18,000 – ₹27,000 / month",
            ],
            [
              "Public Transport (Dubai Nol Metro Pass)",
              "AED 150 – AED 350 / month",
              "₹3,400 – ₹7,900 / month",
            ],
            [
              "Mandatory Student Health Insurance",
              "AED 600 – AED 2,200 / year",
              "₹13,600 – ₹50,000 / year",
            ],
          ],
        },
      ],
    },
    {
      id: "accommodation-student-housing",
      title: "Accommodation & Student Housing",
      blocks: [
        {
          type: "image",
          src: "/editorial/uae-3.webp",
          alt: "Compact student room with a blue accent wall, desk and bed",
          caption: "Example of student accommodation",
          width: 596,
          height: 335,
        },
        {
          type: "paragraph",
          text: "Choosing the right housing arrangement depends on budget, university location, and lifestyle preferences.",
        },
        {
          type: "paragraph",
          text: "Modern, fully furnished student residences provide comfortable private study quarters and utility access.",
        },
        {
          type: "list",
          items: [
            "On-Campus Dormitories: Available in dedicated education hubs like Dubai International Academic City (DIAC) and University City Sharjah. These include furnished single or double rooms, utilities, high-speed Wi-Fi, 24/7 security, and campus shuttle services.",
            "Off-Campus Shared Apartments: Popular among senior students who group together to rent 2- or 3-bedroom apartments in well-connected areas such as Dubai Silicon Oasis (DSO), International City, Al Nahda, or Sports City.",
            "Purpose-Built Private Residences: Residences like KSK Homes or Uninest Student Residences offer modern private or shared en-suite rooms with shared gym facilities, study lounges, game rooms, and daily transport shuttles.",
          ],
        },
      ],
    },
    {
      id: "part-time-work-internships-post-graduation-careers",
      title: "Part-Time Work, Internships & Post-Graduation Careers",
      blocks: [
        {
          type: "paragraph",
          text: "The UAE's expanding economy provides students with practical industrial exposure and tax-free career opportunities.",
        },
        {
          type: "paragraph",
          text: "Graduating from an accredited UAE campus provides pathways into regional and international corporate roles.",
        },
        {
          type: "paragraph",
          text: "Commercial centers in Dubai and Abu Dhabi host regional headquarters for Fortune 500 multinationals.",
        },
        {
          type: "paragraph",
          text: "Work Rules & Internship Opportunities",
        },
        {
          type: "list",
          items: [
            "Part-Time Work Authorization: Part-time work depends on the appropriate student training or employment permit, residency status and applicable employer and emirate rules. Confirm permission and permitted hours with the relevant UAE authority before taking up employment.",
            "Corporate Free Zone Internships: Universities maintain active internship hubs with corporate partners in major free zones like Dubai Internet City (DIC), Dubai International Financial Centre (DIFC), and Abu Dhabi Global Market (ADGM).",
          ],
        },
        {
          type: "paragraph",
          text: "Post-Graduation Career Transition",
        },
        {
          type: "list",
          items: [
            "0% Personal Tax: Salaries in the UAE attract zero personal income tax, allowing entry-level professionals to build savings quickly.",
            "Work Visa Transition: Upon securing a graduate job offer, employers handle the transition from a university student visa to a standard 2-year Employment Residence Visa.",
            "Green Visa for Skilled Professionals: Graduates earning above designated monthly salary thresholds can apply for a 5-Year Green Visa, providing self-sponsored residency without employer dependence.",
          ],
        },
      ],
    },
    {
      id: "essential-checklist-for-indian-students",
      title: "Essential Checklist for Indian Students",
      blocks: [
        {
          type: "list",
          items: [
            "Select Program & Institution: Evaluate global branch vs. Indian off-campus options.",
            "Attest Academic Documents: Complete State HRD, MEA, and UAE Embassy attestation in India.",
            "Secure Housing Early: Reserve university dorms or verified private student residences.",
            "Complete Medical Tests: Undergo local medical fitness tests in the UAE for your Emirates ID.",
            "Confirm Health Insurance: Ensure continuous health insurance coverage throughout your stay.",
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
      href: "https://u.ae/en/information-and-services/education/higher-education",
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
