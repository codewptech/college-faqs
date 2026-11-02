// Public route/form/storage contracts. Synthetic contact details only.
const contact = {
  fullName: "SYNTHETIC Student",
  phone: "+91 99999 99999",
  email: "synthetic@example.invalid",
};
export const forms = [
  {
    form: "mba_mentor",
    route: "/programs/mba/talk-to-mentor",
    table: "mba_mentor",
    fields: { ...contact, program: "mba", message: "Guidance please" },
    details: { program: "mba", message: "Guidance please" },
  },
  {
    form: "mba_predictor",
    route: "/programs/mba/college-predictor",
    table: "mba_predictor",
    fields: {
      ...contact,
      exams: [{ exam: "cat", score: 0, percentile: 100 }],
      budgetLakhs: 0,
    },
    details: {
      exams: [{ exam: "cat", score: 0, percentile: 100 }],
      budgetLakhs: 0,
    },
    controls: { "exams[0][exam]": "cat", "exams[0][score]": "0" },
  },
  {
    form: "mba_application",
    route: "/programs/mba/application-form",
    table: "mba_application",
    fields: { ...contact, exam: "CAT", score: 0, percentile: 0 },
    details: { exam: "CAT", score: 0, percentile: 0 },
  },
  {
    form: "mba_start",
    route: "/programs/mba/start-your-application",
    table: "mba_start",
    fields: { ...contact, entranceExams: "CAT", bestScore: 0 },
    details: { entranceExams: "CAT", bestScore: 0 },
  },
  {
    form: "mba_gdpi",
    route: "/programs/mba/gdpi-preparation",
    table: "mba_gdpi",
    fields: {
      ...contact,
      appliedColleges: ["A", "", "B"],
      targetColleges: ["C"],
    },
    details: { appliedColleges: ["A", "B"], targetColleges: ["C"] },
  },
  {
    form: "engineering_enquiry",
    route: "/programs/engineering",
    table: "engineering_enquiry",
    fields: { ...contact, preferredBranch: "Computer Science" },
    details: { preferredBranch: "Computer Science" },
  },
  {
    form: "study_abroad_profile",
    route: "/programs/study-abroad",
    table: "study_abroad_profile",
    fields: {
      name: contact.fullName,
      phone: contact.phone,
      qualification: "B.Com",
      studyLevel: "other",
      otherStudyLevel: "Diploma",
    },
    details: {
      qualification: "B.Com",
      studyLevel: "other",
      otherStudyLevel: "Diploma",
    },
    controls: { qualification: "B.Com" },
  },
  {
    form: "study_abroad_mentor",
    route: "/programs/study-abroad",
    table: "study_abroad_mentor",
    fields: { name: contact.fullName, phone: contact.phone },
    details: {},
  },
];

export const routes = [
  "/",
  "/about",
  "/explore/admission-guide",
  "/explore/education-loan",
  "/explore/faqs",
  "/privacy-policy",
  "/terms-and-conditions",
  "/programs/mba",
  "/programs/mba/coupons",
  "/programs/mba/college-updates",
  ...new Set(forms.map((form) => form.route)),
  ...[
    "australia",
    "canada",
    "france",
    "georgia",
    "germany",
    "malaysia",
    "uae",
    "uk",
    "usa",
  ].map((country) => `/programs/study-abroad/${country}`),
];
