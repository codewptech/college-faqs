import { isResourcePublished } from "../../resourceCatalog";
import type { LegalPageContent } from "../types";

/** Adapted for web from the client-approved Privacy Policy document. */
export const privacyContent: LegalPageContent = {
  ready: isResourcePublished("/privacy-policy"),
  seo: {
    title: "Privacy Policy | College FAQs",
    description:
      "Learn how College FAQs collects, uses, shares and protects personal information submitted for educational counselling and admission assistance.",
  },
  title: "Privacy Policy",
  publishedAt: "2026-11-01T00:00:00+05:30",
  lastUpdated: "2026-11-01T00:00:00+05:30",
  effectiveAt: "2026-11-01T00:00:00+05:30",
  intro: [
    "At CollegeFAQs.com, operated by Octans Edu Services Pvt. Ltd., we respect your privacy and are committed to protecting the personal information you share with us.",
    "This Privacy Policy explains how we collect, use and protect your information when you visit www.collegefaqs.com, submit an enquiry, or use our counselling and admission-related services.",
  ],
  sections: [
    {
      id: "information-we-collect",
      title: "Information We Collect",
      blocks: [
        {
          type: "paragraph",
          text: "Depending on the services you request, we may collect:",
        },
        {
          type: "list",
          items: [
            "Name, mobile number and email address",
            "City, state and other basic personal details",
            "Academic qualifications, marks and entrance exam details",
            "Preferred courses, colleges and locations",
            "Admission-related information",
            "Information required for education loan assistance",
            "Information you voluntarily provide through forms, calls, email or WhatsApp",
            "Basic technical information such as IP address, browser and device information",
          ],
        },
        {
          type: "paragraph",
          text: "We aim to collect only information that is reasonably necessary to provide our services.",
        },
      ],
    },
    {
      id: "how-we-use-your-information",
      title: "How We Use Your Information",
      blocks: [
        {
          type: "paragraph",
          text: "We may use your information to:",
        },
        {
          type: "list",
          items: [
            "Provide college and course counselling",
            "Help you explore and compare colleges and courses",
            "Assist with admission-related enquiries and applications",
            "Provide education loan guidance",
            "Respond to your enquiries and requests",
            "Send relevant updates regarding courses, admissions and services",
            "Improve our website and services",
            "Comply with applicable laws and regulatory requirements",
          ],
        },
      ],
    },
    {
      id: "sharing-of-information",
      title: "Sharing of Information",
      blocks: [
        {
          type: "paragraph",
          text: "Where necessary to provide the services requested by you, relevant information may be shared with:",
        },
        {
          type: "list",
          items: [
            "Colleges and universities",
            "Banks and financial institutions for education loan assistance",
            "Authorised education and service partners",
            "Technology and service providers supporting our operations",
            "Government or regulatory authorities where legally required",
          ],
        },
        {
          type: "paragraph",
          text: "We do not intend to sell your personal information to unauthorised third parties.",
        },
      ],
    },
    {
      id: "communication-consent",
      title: "Communication Consent",
      blocks: [
        {
          type: "paragraph",
          text: "By submitting your details, you may be contacted by CollegeFAQs or its authorised representatives regarding your education enquiry, counselling, admissions, courses and related services through phone calls, email, SMS and/or WhatsApp, subject to applicable law and your consent.",
        },
        {
          type: "paragraph",
          text: "You may request to stop promotional communications by contacting info@collegefaqs.com.",
        },
      ],
    },
    {
      id: "data-security",
      title: "Data Security",
      blocks: [
        {
          type: "paragraph",
          text: "We take reasonable technical and organisational measures to protect your personal information against unauthorised access, misuse, loss or disclosure.",
        },
        {
          type: "paragraph",
          text: "However, no online system can be guaranteed to be completely secure.",
        },
      ],
    },
    {
      id: "data-retention",
      title: "Data Retention",
      blocks: [
        {
          type: "paragraph",
          text: "We retain personal information only for as long as reasonably necessary to provide our services, fulfil legitimate business or legal requirements, or as otherwise permitted by applicable law.",
        },
      ],
    },
    {
      id: "your-rights",
      title: "Your Rights",
      blocks: [
        {
          type: "paragraph",
          text: "Subject to applicable law, you may request access to, correction or deletion of your personal information, withdraw consent where applicable, or raise a privacy-related grievance.",
        },
        {
          type: "paragraph",
          text: "For such requests, please contact us at:",
        },
        {
          type: "paragraph",
          text: "Email: info@collegefaqs.com",
        },
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      blocks: [
        {
          type: "paragraph",
          text: "Our Website may use cookies and similar technologies to improve website functionality, understand website usage and enhance user experience. You can manage cookies through your browser settings.",
        },
      ],
    },
    {
      id: "third-party-websites",
      title: "Third-Party Websites",
      blocks: [
        {
          type: "paragraph",
          text: "Our Website may contain links to college, university, banking or other third-party websites. We are not responsible for the privacy practices of these external websites and recommend reviewing their respective privacy policies.",
        },
      ],
    },
    {
      id: "changes-to-this-policy",
      title: "Changes to This Policy",
      blocks: [
        {
          type: "paragraph",
          text: "We may update this Privacy Policy from time to time to reflect changes in our services, technology or applicable laws. The updated version will be published on this page with a revised “Last Updated” date.",
        },
      ],
    },
    {
      id: "contact-us",
      title: "Contact Us",
      blocks: [
        {
          type: "paragraph",
          text: "Octans Edu Services Pvt. Ltd.",
        },
        {
          type: "paragraph",
          text: "Website: www.collegefaqs.com",
        },
        {
          type: "paragraph",
          text: "Email: info@collegefaqs.com",
        },
      ],
    },
  ],
  notice:
    "At CollegeFAQs.com, we use your information responsibly to help you make better-informed decisions about colleges, courses, admissions and education opportunities.",
};
