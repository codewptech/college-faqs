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
    content.intro.some(hasText) ||
    content.sections.some(hasSectionContent) ||
    hasText(content.notice),
  );
}

export function hasCountryGuideContent(guide: CountryGuideContent): boolean {
  return Boolean(
    guide.intro.some(hasText) ||
    guide.highlights.some(hasText) ||
    guide.sections.some(hasSectionContent) ||
    hasText(guide.notice) ||
    hasText(guide.verificationNotice) ||
    hasCtaContent(guide.cta),
  );
}
