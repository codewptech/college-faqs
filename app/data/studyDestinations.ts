export type StudyDestination = {
  id: string;
  name: string;
  shortName: string;
  description?: string;
  considerations?: string[];
  image?: { src: string; alt: string; width: number; height: number };
  overviewImage?: { src: string; alt: string; width: number; height: number };
};

export const studyDestinations: StudyDestination[] = [
  {
    id: "usa",
    name: "United States",
    shortName: "USA",
    description:
      "Universities, scholarships, living costs and F-1 practical training.",
    considerations: ["Funding and academic fit", "F-1 conditions, CPT and OPT"],
    overviewImage: {
      src: "/editorial/usa-overview.webp",
      width: 1376,
      height: 768,
      alt: "World map highlighting the United States with a flag-themed country inset",
    },
    image: {
      src: "/editorial/usa-1.webp",
      width: 387,
      height: 258,
      alt: "Red-brick university building with windows along a pedestrian path",
    },
  },
  {
    id: "uk",
    name: "United Kingdom",
    shortName: "UK",
    description:
      "Scholarships, living costs, housing and the Graduate visa route.",
    considerations: [
      "One-year master’s programmes",
      "Check 2027 Graduate visa changes",
    ],
    overviewImage: {
      src: "/editorial/uk-overview.webp",
      width: 1376,
      height: 768,
      alt: "World map highlighting the United Kingdom with a flag-themed country inset",
    },
    image: {
      src: "/editorial/uk-1.webp",
      width: 362,
      height: 276,
      alt: "Historic red-brick university building with a lawn under a blue sky",
    },
  },
  {
    id: "canada",
    name: "Canada",
    shortName: "Canada",
    description: "Proof of funds, accommodation and PGWP eligibility.",
    considerations: ["Study permit planning", "PGWP rules depend on programme"],
    overviewImage: {
      src: "/editorial/canada-overview.webp",
      width: 1376,
      height: 768,
      alt: "World map highlighting Canada with a flag-themed country inset",
    },
    image: {
      src: "/editorial/canada-1.webp",
      width: 783,
      height: 391,
      alt: "Contemporary university building in Toronto with the CN Tower in the background",
    },
  },
  {
    id: "australia",
    name: "Australia",
    shortName: "Australia",
    description: "University choices, Subclass 500 visa and student life.",
    considerations: [
      "Budgeting and OSHC",
      "Student work and graduate visa rules",
    ],
    overviewImage: {
      src: "/editorial/australia-overview.webp",
      width: 1376,
      height: 768,
      alt: "World map highlighting Australia with a flag-themed country inset",
    },
    image: {
      src: "/editorial/australia-1.webp",
      width: 640,
      height: 420,
      alt: "University campus with sandstone buildings, a clock tower and green lawns",
    },
  },
  {
    id: "france",
    name: "France",
    shortName: "France",
    description: "Campus France, public universities, housing and budgeting.",
    considerations: [
      "Campus France procedures",
      "French language and housing support",
    ],
    overviewImage: {
      src: "/editorial/france-overview.webp",
      width: 1376,
      height: 768,
      alt: "World map highlighting France with a flag-themed country inset",
    },
    image: {
      src: "/editorial/france-1.webp",
      width: 547,
      height: 365,
      alt: "Les Invalides building and its gold-domed roof in Paris",
    },
  },
  {
    id: "germany",
    name: "Germany",
    shortName: "Germany",
    description: "APS, university options, blocked account and accommodation.",
    considerations: ["Course and tuition policies", "APS and visa preparation"],
    overviewImage: {
      src: "/editorial/germany-overview.webp",
      width: 1376,
      height: 768,
      alt: "World map highlighting Germany with a flag-themed country inset",
    },
    image: {
      src: "/editorial/germany-1.webp",
      width: 690,
      height: 409,
      alt: "Reichstag building in Berlin under a blue sky with German flags",
    },
  },
  {
    id: "malaysia",
    name: "Malaysia",
    shortName: "Malaysia",
    description: "Public and private universities, branch campuses and EMGS.",
    considerations: [
      "Student Pass process",
      "Campus and accommodation options",
    ],
    overviewImage: {
      src: "/editorial/malaysia-overview.webp",
      width: 1376,
      height: 768,
      alt: "World map highlighting Malaysia with a flag-themed country inset",
    },
    image: {
      src: "/editorial/malaysia-1.webp",
      width: 547,
      height: 365,
      alt: "Petronas Twin Towers and Kuala Lumpur skyline at sunset",
    },
  },
  {
    id: "uae",
    name: "United Arab Emirates",
    shortName: "UAE",
    description: "Branch campuses, visa considerations and university costs.",
    considerations: [
      "Verify campus accreditation",
      "Local study and work permissions",
    ],
    overviewImage: {
      src: "/editorial/uae-overview.webp",
      width: 1376,
      height: 768,
      alt: "World map highlighting the United Arab Emirates with a flag-themed country inset",
    },
    image: {
      src: "/editorial/uae-1.webp",
      width: 715,
      height: 429,
      alt: "Burj Khalifa and illuminated Dubai skyline at night",
    },
  },
  {
    id: "georgia",
    name: "Georgia",
    shortName: "Georgia",
    description:
      "University programmes, medical-study considerations and housing.",
    considerations: [
      "Check medical recognition carefully",
      "D3 visa and residence requirements",
    ],
    overviewImage: {
      src: "/editorial/georgia-overview.webp",
      width: 1376,
      height: 768,
      alt: "World map highlighting Georgia with a flag-themed country inset",
    },
    image: {
      src: "/editorial/georgia-3.webp",
      width: 1160,
      height: 773,
      alt: "Multi-storey student housing buildings around a courtyard at dusk",
    },
  },
];
