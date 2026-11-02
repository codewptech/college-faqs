import { isResourcePublished } from "../../resourceCatalog";
import type { LegalPageContent } from "../types";

/** Adapted for web from the client-approved Terms & Conditions document. */
export const termsContent: LegalPageContent = {
  ready: isResourcePublished("/terms-and-conditions"),
  seo: {
    title: "Terms & Conditions | College FAQs",
    description:
      "Read the terms governing use of College FAQs, educational guidance, admission assistance, education loan information and related services.",
  },
  title: "Terms & Conditions",
  publishedAt: "2026-11-01T00:00:00+05:30",
  lastUpdated: "2026-11-01T00:00:00+05:30",
  effectiveAt: "2026-11-01T00:00:00+05:30",
  intro: [
    "Welcome to www.collegefaqs.com (“Website”), operated by Octans Edu Services Pvt. Ltd. (“Company”, “CollegeFAQs”, “we”, “us” or “our”).",
    "These Terms & Conditions (“Terms”) govern your access to and use of the website and the counselling, admission guidance, information, education loan assistance and other services made available through the website.",
    "By accessing, browsing or using the website, submitting an enquiry or application, or using any service provided through the website, you acknowledge that you have read, understood and agreed to these Terms. If you do not agree with these Terms, please do not use the website or submit your personal information through it.",
  ],
  sections: [
    {
      id: "about-collegefaqs",
      title: "About CollegeFAQs",
      blocks: [
        {
          type: "paragraph",
          text: "CollegeFAQs.com is an education information and guidance platform that assists students in exploring colleges, universities, courses, admissions and related education opportunities in India and abroad.",
        },
        {
          type: "paragraph",
          text: "Our services may include college and course information, counselling and guidance, admission assistance, application support, education loan assistance and other related services.",
        },
        {
          type: "paragraph",
          text: "CollegeFAQs may work with or facilitate communication with colleges, universities, financial institutions, education service providers and other relevant third parties.",
        },
      ],
    },
    {
      id: "website-information",
      title: "Website Information",
      blocks: [
        {
          type: "paragraph",
          text: "We make reasonable efforts to provide useful, relevant and updated information relating to colleges, universities, courses, eligibility, fees, admissions, examinations, placements, scholarships and other educational matters.",
        },
        {
          type: "paragraph",
          text: "However:",
        },
        {
          type: "list",
          items: [
            "Information relating to colleges, universities, courses, fees, eligibility, admission dates, examinations, scholarships, placements and other matters may change from time to time.",
            "Information may be based on information provided by educational institutions, publicly available sources or third-party sources.",
            "CollegeFAQs does not guarantee that every piece of information available on the website will always be complete, current or error-free.",
            "Students are advised to independently verify important information, eligibility requirements, admission dates, fees and other applicable conditions from the concerned college, university, examination authority or other official source before making a decision.",
          ],
        },
        {
          type: "paragraph",
          text: "The availability of information about any college, university, course or service on the website should not be interpreted as an endorsement, guarantee or certification by CollegeFAQs.",
        },
      ],
    },
    {
      id: "registration-and-user-information",
      title: "Registration and User Information",
      blocks: [
        {
          type: "paragraph",
          text: "Certain features of the website may require you to submit personal, academic or contact information.",
        },
        {
          type: "paragraph",
          text: "When submitting information through the website, you agree to:",
        },
        {
          type: "list",
          items: [
            "Provide information that is accurate, complete and current to the best of your knowledge.",
            "Update information when necessary.",
            "Not impersonate another person or provide false or misleading information.",
            "Maintain the confidentiality of any application, enquiry, reference or identification number provided to you.",
            "Use the website only for lawful purposes.",
          ],
        },
        {
          type: "paragraph",
          text: "You are responsible for the accuracy of information submitted by you. CollegeFAQs shall not be responsible for any loss, rejection, delay or other consequence resulting from incorrect, incomplete or outdated information provided by you.",
        },
      ],
    },
    {
      id: "students-below-18-years-of-age",
      title: "Students Below 18 Years of Age",
      blocks: [
        {
          type: "paragraph",
          text: "If you are below 18 years of age, you should use the website and submit personal information only with the knowledge and appropriate consent of your parent or legal guardian, wherever required by applicable law.",
        },
        {
          type: "paragraph",
          text: "Where necessary, CollegeFAQs may request additional information or confirmation from a parent or legal guardian.",
        },
      ],
    },
    {
      id: "communication-and-contact-consent",
      title: "Communication and Contact Consent",
      blocks: [
        {
          type: "paragraph",
          text: "When you voluntarily submit your contact details through the website, you may be contacted by CollegeFAQs or its authorised representatives regarding your enquiry, requested services, counselling, courses, colleges, admissions, application status, education loans or other services relevant to your enquiry.",
        },
        {
          type: "paragraph",
          text: "Depending on the nature of the communication and applicable law, communications may be made through:",
        },
        {
          type: "list",
          items: [
            "Phone calls",
            "Email",
            "SMS",
            "WhatsApp or other messaging platforms",
          ],
        },
        {
          type: "paragraph",
          text: "Where separate consent is required for promotional or marketing communications, such consent will be obtained through an appropriate consent mechanism.",
        },
        {
          type: "paragraph",
          text: "You may withdraw your consent for promotional communications or request that such communications be stopped by contacting us at info@collegefaqs.com, subject to applicable law and any communications necessary to provide services already requested by you.",
        },
        {
          type: "paragraph",
          text: "Where applicable, commercial communications will be undertaken in accordance with the requirements of TRAI and other applicable laws and regulations.",
        },
      ],
    },
    {
      id: "sharing-information-with-education-and-service-partners",
      title: "Sharing Information with Education and Service Partners",
      blocks: [
        {
          type: "paragraph",
          text: "To provide counselling, admission assistance, education loan assistance or other services requested by you, your information may, where permitted and appropriate, be shared with relevant colleges, universities, financial institutions, education partners or service providers.",
        },
        {
          type: "paragraph",
          text: "Such sharing will be subject to applicable law and our Privacy Policy.",
        },
        {
          type: "paragraph",
          text: "CollegeFAQs does not authorise unrelated third parties to use your personal information for purposes inconsistent with the purpose for which it was collected, except where permitted or required by applicable law.",
        },
        {
          type: "paragraph",
          text: "For details regarding collection, use, storage, sharing and protection of personal information, please refer to our Privacy Policy.",
        },
      ],
    },
    {
      id: "counselling-and-admission-assistance",
      title: "Counselling and Admission Assistance",
      blocks: [
        {
          type: "paragraph",
          text: "CollegeFAQs provides information, counselling and assistance intended to help students make informed education decisions.",
        },
        {
          type: "paragraph",
          text: "However:",
        },
        {
          type: "list",
          items: [
            "Counselling and guidance do not constitute a guarantee of admission.",
            "Admission decisions are made solely by the respective college, university or educational institution.",
            "Meeting eligibility requirements does not guarantee admission.",
            "CollegeFAQs does not guarantee admission into any particular college, university, course or programme.",
            "The final decision regarding admission, seat allocation, scholarships, fees, eligibility, document verification and selection rests with the concerned institution or competent authority.",
            "Students remain responsible for completing applications, submitting documents and meeting applicable deadlines and requirements.",
          ],
        },
      ],
    },
    {
      id: "education-loan-assistance",
      title: "Education Loan Assistance",
      blocks: [
        {
          type: "paragraph",
          text: "Where CollegeFAQs provides education loan guidance or facilitates communication with financial institutions:",
        },
        {
          type: "list",
          items: [
            "Loan approval is solely at the discretion of the concerned bank or financial institution.",
            "CollegeFAQs does not guarantee loan approval, sanction amount, interest rate, tenure or other loan terms.",
            "Students should independently review the terms and conditions, interest rates, processing charges, repayment obligations and other applicable terms before accepting any loan.",
          ],
        },
        {
          type: "paragraph",
          text: "CollegeFAQs is not responsible for the approval, rejection, delay or modification of any loan application by a financial institution.",
        },
      ],
    },
    {
      id: "third-party-websites-and-services",
      title: "Third-Party Websites and Services",
      blocks: [
        {
          type: "paragraph",
          text: "The Website may contain links, references or integrations relating to third-party websites, colleges, universities, financial institutions, service providers or other external platforms.",
        },
        {
          type: "paragraph",
          text: "CollegeFAQs does not control such third-party websites or services and is not responsible for their:",
        },
        {
          type: "list",
          items: [
            "Content",
            "Accuracy",
            "Availability",
            "Privacy practices",
            "Security",
            "Terms and conditions",
            "Products or services",
          ],
        },
        {
          type: "paragraph",
          text: "Your use of third-party websites or services is subject to the terms and policies of those third parties.",
        },
      ],
    },
    {
      id: "no-guarantee-of-educational-or-career-outcomes",
      title: "No Guarantee of Educational or Career Outcomes",
      blocks: [
        {
          type: "paragraph",
          text: "CollegeFAQs does not guarantee any particular educational, admission, placement, salary, career or financial outcome.",
        },
        {
          type: "paragraph",
          text: "Information regarding placements, salaries, career opportunities, rankings, reviews or other outcomes is provided for general informational purposes and may vary between institutions, programmes, students and years.",
        },
        {
          type: "paragraph",
          text: "Students should independently evaluate such information before making an educational or financial decision.",
        },
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      blocks: [
        {
          type: "paragraph",
          text: "All content and materials available on the website, including but not limited to:",
        },
        {
          type: "list",
          items: [
            "Text",
            "Articles",
            "Graphics",
            "Logos",
            "Images",
            "Videos",
            "Icons",
            "website design",
            "Layout",
            "Software",
            "Branding",
            "Other original materials",
          ],
        },
        {
          type: "paragraph",
          text: "are owned by or licensed to Octans Edu Services Pvt. Ltd. / CollegeFAQs.com, unless otherwise stated, and are protected by applicable intellectual property laws.",
        },
        {
          type: "paragraph",
          text: "You may access, view, download or print website content for your personal, non-commercial use, provided that copyright and other proprietary notices are retained.",
        },
        {
          type: "paragraph",
          text: "You may not, without prior written permission:",
        },
        {
          type: "list",
          items: [
            "Copy or reproduce substantial portions of the website.",
            "Modify or republish website content.",
            "Distribute or commercially exploit Website materials.",
            "Use CollegeFAQs branding, logos or content in a manner that suggests unauthorised affiliation.",
            "Scrape, systematically extract or reproduce website content for commercial purposes.",
          ],
        },
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable Use",
      blocks: [
        {
          type: "paragraph",
          text: "You agree not to use the website:",
        },
        {
          type: "list",
          items: [
            "For any unlawful or fraudulent purpose.",
            "To submit false, misleading or unauthorised information.",
            "To impersonate another person or organisation.",
            "To interfere with the operation or security of the website.",
            "To introduce malicious code, viruses or harmful software.",
            "To attempt unauthorised access to Website systems or data.",
            "To copy, scrape or commercially exploit website content without permission.",
            "In any manner that may harm CollegeFAQs, its users or third parties.",
          ],
        },
        {
          type: "paragraph",
          text: "We reserve the right to restrict or suspend access to the website where we reasonably believe these Terms have been violated.",
        },
      ],
    },
    {
      id: "website-availability",
      title: "Website Availability",
      blocks: [
        {
          type: "paragraph",
          text: "We endeavour to keep the website available and functional. However, we do not guarantee that the website will always be available, uninterrupted, secure or free from errors.",
        },
        {
          type: "paragraph",
          text: "Access may occasionally be suspended or restricted due to maintenance, technical issues, updates, security concerns, network failures or circumstances beyond our reasonable control.",
        },
      ],
    },
    {
      id: "disclaimer-of-warranties",
      title: "Disclaimer of Warranties",
      blocks: [
        {
          type: "paragraph",
          text: "The Website, its content and services are provided on an “AS IS” and “AS AVAILABLE” basis, to the extent permitted by applicable law.",
        },
        {
          type: "paragraph",
          text: "We do not provide any express or implied warranty that:",
        },
        {
          type: "list",
          items: [
            "The Website will always be available or error-free.",
            "Information will always be complete, accurate or current.",
            "The Website will meet every user's individual requirements.",
            "Any particular admission, education loan, scholarship, placement or career outcome will be achieved.",
          ],
        },
        {
          type: "paragraph",
          text: "Nothing in these Terms excludes any rights or protections that cannot lawfully be excluded under applicable law.",
        },
      ],
    },
    {
      id: "limitation-of-liability",
      title: "Limitation of Liability",
      blocks: [
        {
          type: "paragraph",
          text: "To the maximum extent permitted by applicable law, CollegeFAQs, Octans Edu Services Pvt. Ltd., and their respective directors, employees, representatives and authorised personnel shall not be liable for any indirect, incidental, special, consequential or similar loss arising from your use of, or inability to use, the website or reliance upon information available through the website.",
        },
        {
          type: "paragraph",
          text: "This includes, where legally permissible, losses arising from:",
        },
        {
          type: "list",
          items: [
            "Admission decisions made by educational institutions.",
            "Incorrect or incomplete information submitted by users.",
            "Changes in admission criteria, fees, deadlines or institutional policies.",
            "Rejection or delay of admission or education loan applications.",
            "Actions or omissions of third-party institutions or service providers.",
            "Temporary Website unavailability or technical interruptions.",
          ],
        },
        {
          type: "paragraph",
          text: "Nothing in these Terms shall limit liability where such limitation is prohibited under applicable law.",
        },
      ],
    },
    {
      id: "indemnity",
      title: "Indemnity",
      blocks: [
        {
          type: "paragraph",
          text: "To the extent permitted by applicable law, you agree to indemnify and hold harmless CollegeFAQs, Octans Edu Services Pvt. Ltd., its directors, employees and representatives from claims, losses, liabilities, damages and expenses arising from:",
        },
        {
          type: "list",
          items: [
            "Your violation of these Terms.",
            "Your misuse of the website.",
            "Information or documents submitted by you that are false, misleading or unauthorised.",
            "Your violation of applicable laws or the rights of another person or organisation.",
          ],
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacy",
      blocks: [
        {
          type: "paragraph",
          text: "Your use of the website and submission of personal information is also governed by our Privacy Policy, which explains how we collect, use, disclose, retain and protect personal information.",
        },
        {
          type: "paragraph",
          text: "The Privacy Policy forms an important part of these Terms and should be read before submitting personal information through the website.",
        },
      ],
    },
    {
      id: "changes-to-these-terms",
      title: "Changes to These Terms",
      blocks: [
        {
          type: "paragraph",
          text: "CollegeFAQs may modify, update or amend these Terms from time to time to reflect changes in our services, business practices, technology or applicable laws.",
        },
        {
          type: "paragraph",
          text: "Updated Terms will be published on this page with the revised “Last Updated” date.",
        },
        {
          type: "paragraph",
          text: "Your continued use of the website after the revised Terms are published will constitute acceptance of the updated Terms, to the extent permitted by applicable law.",
        },
      ],
    },
    {
      id: "suspension-or-termination",
      title: "Suspension or Termination",
      blocks: [
        {
          type: "paragraph",
          text: "We reserve the right to suspend or restrict access to the website or any particular service where we reasonably believe that a user has:",
        },
        {
          type: "list",
          items: [
            "Violated these Terms.",
            "Provided false or misleading information.",
            "Misused the website or services.",
            "Engaged in fraudulent or unlawful activities.",
            "Attempted to compromise the security or operation of the website.",
          ],
        },
        {
          type: "paragraph",
          text: "Such action may be taken without prejudice to any other rights or remedies available to us under applicable law.",
        },
      ],
    },
    {
      id: "governing-law-and-jurisdiction",
      title: "Governing Law and Jurisdiction",
      blocks: [
        {
          type: "paragraph",
          text: "These Terms shall be governed by and interpreted in accordance with the laws of India.",
        },
        {
          type: "paragraph",
          text: "Subject to applicable law, disputes arising out of or relating to these Terms or your use of the website shall be subject to the jurisdiction of the competent courts at Patna, Bihar, India.",
        },
      ],
    },
    {
      id: "contact-us",
      title: "Contact Us",
      blocks: [
        {
          type: "paragraph",
          text: "For questions, concerns, requests regarding these Terms or communication preferences, you may contact us at:",
        },
        {
          type: "paragraph",
          text: "Octans Edu Services Pvt. Ltd.",
        },
        {
          type: "paragraph",
          text: "Email: info@collegefaqs.com",
        },
      ],
    },
  ],
  notice:
    "CollegeFAQs.com is an education information and guidance platform. Admission decisions, fee structures, eligibility, scholarships, education loans, placements and other institutional matters are ultimately subject to the policies and decisions of the respective institutions, authorities and service providers. Students are encouraged to verify important information from official sources before making educational, admission or financial decisions.",
};
