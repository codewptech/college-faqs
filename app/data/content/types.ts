export type SeoContent = {
  title: string;
  description: string;
};

export type TextSegment = {
  text: string;
  href?: string;
  strong?: boolean;
};

export type ContentText = string | TextSegment[];

export type ContentLink = {
  label: string;
  to: string;
};

export type ParagraphBlock = {
  type: "paragraph";
  text: ContentText;
};

export type ListBlock = {
  type: "list";
  ordered?: boolean;
  items: ContentText[];
};

export type TableBlock = {
  type: "table";
  caption?: string;
  headers: ContentText[];
  rows: ContentText[][];
};

export type NoteBlock = {
  type: "note";
  text: ContentText;
};

export type ContentBlock = ParagraphBlock | ListBlock | TableBlock | NoteBlock;

export type ContentSection = {
  id?: string;
  eyebrow?: string;
  title?: string;
  blocks: ContentBlock[];
};

export type ContentCta = {
  eyebrow?: string;
  title?: string;
  text?: ContentText;
  links: ContentLink[];
};

export type CountryGuideContent = {
  ready: boolean;
  slug: string;
  country: string;
  seo: SeoContent;
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: ContentText[];
  highlights: ContentText[];
  sections: ContentSection[];
  notice?: ContentText;
  verificationNotice: ContentText;
  cta?: ContentCta;
};

export type LegalPageContent = {
  ready: boolean;
  seo: SeoContent;
  title: string;
  lastUpdated: string;
  intro: ContentText[];
  sections: ContentSection[];
  notice?: ContentText;
};
