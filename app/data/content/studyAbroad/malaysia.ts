import { isResourcePublished } from "../../resourceCatalog";
import type { CountryGuideContent } from "../types";

export const malaysiaGuide: CountryGuideContent = {
  ready: isResourcePublished("/programs/study-abroad/malaysia"),
  slug: "malaysia",
  country: "Malaysia",
  publishedAt: null,
  lastUpdated: "2026-10-30T20:29:43+05:30",
  effectiveAt: null,
  seo: {
    title:
      "Study in Malaysia: Complete Guide for Indian Students | College FAQs",
    description:
      "Explore studying in Malaysia: admissions, universities, student visas, budgets, accommodation and career considerations for Indian students.",
  },
  eyebrow: "Study Abroad • Destination Guide",
  title: "Study in Malaysia: Complete Guide for Indian Students",
  subtitle:
    "Student Pass (EMGS), Top Universities, Cost of Living, Accommodation & Career Path",
  heroImage: {
    src: "/editorial/malaysia-1.webp",
    alt: "Petronas Twin Towers and Kuala Lumpur skyline at sunset",
    caption: "Kuala Lumpur city skyline",
    width: 547,
    height: 365,
  },
  intro: [
    "Kuala Lumpur's vibrant skyline and modern infrastructure offer Indian students an affordable, world-class international education hub in Southeast Asia.",
    "Malaysia has rapidly become one of the most attractive study destinations for Indian students. Offering a blend of top-ranked local universities, global foreign branch campuses (UK and Australian degrees at a fraction of the cost), low tuition fees, and a comfortable multicultural environment, Malaysia provides high-quality education right in Asia.",
    "Here is a comprehensive breakdown of everything you need to know before moving to Malaysia for your higher studies.",
  ],
  highlights: [
    "Key University & Program Options",
    "Admission, EMGS Process & Visa Requirements",
    "Budgeting & Living Cost Breakdown",
  ],
  sections: [
    {
      id: "key-university-program-options",
      title: "Key University & Program Options",
      blocks: [
        {
          type: "image",
          src: "/editorial/malaysia-2.webp",
          alt: "Modern university campus building and pedestrian bridge",
          caption: "Example of university facilities in Malaysia",
          width: 690,
          height: 435,
        },
        {
          type: "paragraph",
          text: "Malaysia's higher education system is famous for providing dual-degree programs, foreign branch campuses, and top-tier research universities.",
        },
        {
          type: "paragraph",
          text: "Modern university facilities across Malaysian educational hubs provide state-of-the-art learning and research environments.",
        },
        {
          type: "list",
          items: [
            "Top Public Research Universities: Institutions like Universiti Malaya (UM), Universiti Sains Malaysia (USM), and Universiti Kebangsaan Malaysia (UKM) rank among the top universities globally and offer highly subsidized tuition.",
            "Premier Private Universities: Taylor’s University, Sunway University, Asia Pacific University (APU), and Management and Science University (MSU) excel in Engineering, IT, Hospitality, Business, and Computer Science.",
            "Global Foreign Branch Campuses: Earn accredited UK and Australian degrees in Malaysia:",
            "Monash University Malaysia (Australia)",
            "University of Nottingham Malaysia (UK)",
            "Heriot-Watt University Malaysia (UK)",
            "Curtin University Malaysia (Australia)",
            "Twinning & Dual-Degree Programs (3+0 / 2+1): Many Malaysian private institutions allow students to complete 1–2 years in Malaysia and finish their final year at partner universities in the UK, USA, Australia, or Canada.",
          ],
        },
      ],
    },
    {
      id: "admission-emgs-process-visa-requirements",
      title: "Admission, EMGS Process & Visa Requirements",
      blocks: [
        {
          type: "paragraph",
          text: "Applying to Malaysian universities involves a centralized visa processing system managed by Education Malaysia Global Services (EMGS).",
        },
        {
          type: "paragraph",
          text: "Proper document verification and EMGS approval are crucial for securing a Malaysian Student Pass.",
        },
        {
          type: "list",
          items: [
            "Application Intakes: Major intakes occur in February/March, July/August, and October.",
            "EMGS Approval & Visa Approval Letter (VAL):",
            "Once accepted by an institution, apply for your Visa Approval Letter (VAL) online via the official EMGS portal.",
            "Requirements include academic transcripts, passport copy, offer letter, and a medical health declaration.",
            "Processing typically takes 14 to 30 working days.",
            "Single Entry Visa (SEV) & Student Pass:",
            "Once the VAL is issued, Indian students must apply for a Single Entry Visa (SEV) online (eVisa) or through the Malaysian Representative Office in India.",
            "Upon landing in Malaysia, complete a mandatory post-arrival medical checkup. Your passport will then be stamped with the official Student Pass (renewed annually).",
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
          text: "Malaysia offers one of the most cost-effective study destinations globally, combining affordable tuition fees with low monthly living costs.",
        },
        {
          type: "paragraph",
          text: "Modern university libraries and dedicated study halls support intensive academic coursework.",
        },
        {
          type: "paragraph",
          text: "Clear financial budgeting helps students manage tuition fees, accommodation, and monthly expenses easily.",
        },
        {
          type: "table",
          caption:
            "Indicative cost comparison from the source document; check current prices with your institution.",
          headers: [
            "Expense Category",
            "Annual / Monthly Cost (MYR - RM)",
            "Annual / Monthly Cost (INR Approx.)",
          ],
          rows: [
            [
              "UG Tuition (Public Universities)",
              "RM 10,000 – 22,000 / year",
              "₹1.8 – 4.0 Lakhs / year",
            ],
            [
              "UG Tuition (Private Universities)",
              "RM 25,000 – 45,000 / year",
              "₹4.5 – 8.2 Lakhs / year",
            ],
            [
              "UG Tuition (Branch Campuses)",
              "RM 40,000 – 70,000 / year",
              "₹7.3 – 12.8 Lakhs / year",
            ],
            [
              "On-Campus Hostel Room",
              "RM 500 – 1,200 / month",
              "₹9,000 – 22,000 / month",
            ],
            [
              "Off-Campus Shared Room",
              "RM 600 – 1,500 / month",
              "₹11,000 – 27,000 / month",
            ],
            [
              "Groceries & Food",
              "RM 600 – 1,000 / month",
              "₹11,000 – 18,000 / month",
            ],
            [
              "Public Transit Pass (LRT/MRT/Bus)",
              "RM 100 – 200 / month",
              "₹1,800 – 3,600 / month",
            ],
            [
              "Mandatory Medical Insurance",
              "RM 500 – 800 / year",
              "₹9,000 – 14,500 / year",
            ],
          ],
        },
      ],
    },
    {
      id: "accommodation-hostel-options",
      title: "Accommodation & Hostel Options",
      blocks: [
        {
          type: "image",
          src: "/editorial/malaysia-3.webp",
          alt: "Student bedroom with a desk and window",
          caption: "Example of student accommodation",
          width: 701,
          height: 438,
        },
        {
          type: "paragraph",
          text: "Securing student accommodation in Malaysia is straightforward, with options ranging from university halls to modern high-rise condominiums.",
        },
        {
          type: "paragraph",
          text: "Well-equipped student dormitories and rented condominium rooms give students comfortable private living spaces.",
        },
        {
          type: "list",
          items: [
            "On-Campus Student Hostels: Most public and private universities provide fully furnished air-conditioned dormitories with 24/7 security, Wi-Fi, and laundry facilities.",
            "Off-Campus Condominium Rentals: Popular areas in Greater Kuala Lumpur (such as Subang Jaya, Sunway, Cyberjaya, and Mont Kiara) feature modern residential condominiums equipped with swimming pools, gyms, and tight security. Sharing a 3-bedroom unit with fellow students keeps individual rent low.",
            "Food & Lifestyle Accessibility: Halal, vegetarian, and authentic Indian food options are widely available across Malaysia, making the transition easy for Indian students.",
          ],
        },
      ],
    },
    {
      id: "part-time-work-rules-post-graduation-career-path",
      title: "Part-Time Work Rules & Post-Graduation Career Path",
      blocks: [
        {
          type: "paragraph",
          text: "Understanding immigration policies regarding student work rights is essential for career planning.",
        },
        {
          type: "paragraph",
          text: "Graduating with an internationally recognized degree opens doors to regional and global career tracks.",
        },
        {
          type: "paragraph",
          text: "Major tech and financial centers across Kuala Lumpur, Cyberjaya, and Penang host regional MNC headquarters.",
        },
        {
          type: "list",
          items: [
            "Part-Time Work Regulations:",
            "International students can work part-time for up to 20 hours per week only during semester breaks or holidays exceeding 7 days.",
            "Work is restricted to specific sectors: restaurants, petrol kiosks, mini-markets, and hotels (individual job roles and employers are subject to immigration restrictions).",
            "Internship Opportunities: Industrial training and internships integrated into degree programs are mandatory for most degrees, enabling students to gain industry experience with regional multinationals.",
            "Transitioning to Employment:",
            "Upon graduation, students securing job offers from companies in Malaysia can transition onto an Employment Pass (EP) or Professional Visit Pass.",
            "Key hiring sectors include Information Technology, Data Analytics, Biotechnology, Finance, Supply Chain Logistics, and Electrical Engineering (notably in Penang’s semiconductor hub).",
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
            "Closer Proximity to India: Flight times between major Indian cities (Chennai, Tiruchirappalli, Kochi, Mumbai, Delhi) and Kuala Lumpur range from just 3.5 to 5 hours, making travel back home convenient.",
            "Cultural Familiarity: Malaysia has a rich multicultural society with a significant Indian diaspora. Tamil is widely spoken alongside Malay and English.",
            "Climatic Conditions: Malaysia has a tropical, warm, and humid climate year-round (24°C to 32°C), eliminating the need for expensive winter gear.",
            "Medical Fitness Standards: EMGS strictly enforces health standards; ensure all medical history declarations are accurate before submitting your visa application.",
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
      href: "https://educationmalaysia.gov.my/",
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
