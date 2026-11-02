import type {
  ContentBlock,
  ContentCta,
  ContentSection,
  ContentText,
  CountryGuideContent,
  LegalPageContent,
} from "./types";

export function hasText(value: ContentText | null | undefined): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  if (!Array.isArray(value)) return false;
  return value.some((segment) => Boolean(segment?.text?.trim()));
}

export function isInternalHref(value: string): boolean {
  const href = value.trim();
  return href.startsWith("/") && !href.startsWith("//");
}

export function isSafeHref(value: string): boolean {
  const href = value.trim();
  if (!href) return false;
  if ((href.startsWith("/") && !href.startsWith("//")) || href.startsWith("#"))
    return true;
  return /^(https?:|mailto:|tel:)/i.test(href);
}

export function hasBlockContent(block: ContentBlock): boolean {
  if (block.type === "image")
    return Boolean(
      block.src.trim() &&
      Number.isFinite(block.width) &&
      Number.isFinite(block.height),
    );
  if (block.type === "paragraph" || block.type === "note")
    return hasText(block.text);
  if (block.type === "list") return block.items.some(hasText);
  if (block.type === "table") {
    return (
      block.headers.some(hasText) || block.rows.some((row) => row.some(hasText))
    );
  }
  return false;
}

export function hasSectionContent(
  section: Pick<ContentSection, "title" | "eyebrow" | "blocks">,
): boolean {
  return section.blocks.some(hasBlockContent);
}

export function hasCtaContent(cta: ContentCta | null | undefined): boolean {
  if (!cta) return false;
  return Boolean(
    hasText(cta.text) ||
    cta.links.some((link) => link.label.trim() && isSafeHref(link.to)),
  );
}

export function hasLegalPageContent(content: LegalPageContent): boolean {
  return Boolean(
    content.intro.some(hasText) || content.sections.some(hasSectionContent),
  );
}

export function hasCountryGuideContent(guide: CountryGuideContent): boolean {
  return Boolean(
    guide.intro.some(hasText) ||
    guide.highlights.some(hasText) ||
    guide.sections.some(hasSectionContent),
  );
}

/**
 * One shared interpretation of authored sections for both article output and
 * in-page navigation. Invalid/duplicate anchor IDs cannot produce links.
 */
export function getRenderableSections(sections: ContentSection[]) {
  const usedIds = new Set<string>();
  return sections.filter(hasSectionContent).map((section) => {
    const candidate = section.id?.trim() ?? "";
    const anchorId =
      /^[A-Za-z][A-Za-z0-9_-]*$/.test(candidate) && !usedIds.has(candidate)
        ? candidate
        : undefined;
    if (anchorId) usedIds.add(anchorId);
    return {
      section,
      anchorId,
      blocks: section.blocks.filter(hasBlockContent),
    };
  });
}

/** Date-only values and impossible local calendar dates are not editorial timestamps. */
export function isValidEditorialTimestamp(
  value: string | null | undefined,
): value is string {
  if (!value) return false;
  const m = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|([+-])(\d{2}):(\d{2}))$/,
  );
  if (!m) return false;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const hour = Number(m[4]);
  const minute = Number(m[5]);
  const second = Number(m[6]);
  const zoneHour = m[9] === undefined ? 0 : Number(m[9]);
  const zoneMinute = m[10] === undefined ? 0 : Number(m[10]);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return (
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= days[month - 1]! &&
    hour <= 23 &&
    minute <= 59 &&
    second <= 59 &&
    zoneHour <= 14 &&
    zoneMinute <= 59 &&
    (zoneHour !== 14 || zoneMinute === 0) &&
    Number.isFinite(Date.parse(value))
  );
}

/** The PPT requires a strict comparison of full instants, independent of today. */
export function shouldShowEffectiveAt(
  lastUpdated: string | null | undefined,
  effectiveAt: string | null | undefined,
): boolean {
  return (
    isValidEditorialTimestamp(lastUpdated) &&
    isValidEditorialTimestamp(effectiveAt) &&
    Date.parse(lastUpdated) < Date.parse(effectiveAt)
  );
}
