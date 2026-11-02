/** Public, publication-approved resource identity. Never store confidential drafts here.
 * Editorial bodies remain owned by their route-local typed content modules.
 * Changing publication status here does not bypass substantive-content checks.
 */
export type PublicationStatus = "pending" | "published";

const initialPublicationStatus = {
  "/about": "published",
  "/explore/admission-guide": "published",
  "/explore/education-loan": "published",
  "/explore/faqs": "published",
  "/privacy-policy": "published",
  "/terms-and-conditions": "published",
  "/programs/study-abroad": "published",
  "/programs/study-abroad/australia": "published",
  "/programs/study-abroad/canada": "published",
  "/programs/study-abroad/france": "published",
  "/programs/study-abroad/georgia": "published",
  "/programs/study-abroad/germany": "published",
  "/programs/study-abroad/malaysia": "published",
  "/programs/study-abroad/uae": "published",
  "/programs/study-abroad/uk": "published",
  "/programs/study-abroad/usa": "published",
} as const satisfies Record<string, PublicationStatus>;

export type EditorialRoute = keyof typeof initialPublicationStatus;

export const publicationStatus: Record<EditorialRoute, PublicationStatus> =
  initialPublicationStatus;

export function isEditorialRoute(path: string): path is EditorialRoute {
  return Object.prototype.hasOwnProperty.call(publicationStatus, path);
}

export function isCountryGuidePublished(countryId: string): boolean {
  const path = `/programs/study-abroad/${countryId}`;
  return isEditorialRoute(path) && isResourcePublished(path);
}

export function isResourcePublished(path: EditorialRoute): boolean {
  return publicationStatus[path] === "published";
}

/** Display copy is deliberately truthful when an editorial destination is pending. */
export const exploreResources = [
  {
    to: "/explore/admission-guide",
    title: "Admission Guide",
    publishedDescription:
      "Understand the admission process and plan your next steps.",
    pendingDescription:
      "Admission guidance is being prepared. Explore available programmes in the meantime.",
  },
  {
    to: "/explore/education-loan",
    title: "Education Loan",
    publishedDescription:
      "Explore education financing options and planning considerations.",
    pendingDescription:
      "Education loan guidance is being prepared. Programme information remains available.",
  },
  {
    to: "/explore/faqs",
    title: "FAQs",
    publishedDescription: "Find answers to common admission questions.",
    pendingDescription:
      "Frequently asked questions are being prepared. Explore the available programmes.",
  },
] as const satisfies ReadonlyArray<{
  to: EditorialRoute;
  title: string;
  publishedDescription: string;
  pendingDescription: string;
}>;

export function getExploreResources() {
  return exploreResources.map((item) => ({
    to: item.to,
    title: item.title,
    description: isResourcePublished(item.to)
      ? item.publishedDescription
      : item.pendingDescription,
    pending: !isResourcePublished(item.to),
  }));
}
