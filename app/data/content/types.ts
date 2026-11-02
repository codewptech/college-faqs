export type EditorialTimestamps = {
  /** Offset-aware ISO 8601 timestamp; editorially maintained, not file mtime. */
  publishedAt?: string | null;
  lastUpdated?: string | null;
  effectiveAt?: string | null;
};

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

export type ImageBlock = {
  type: "image";
  src: string;
  alt: string;
  caption?: string | null;
  width: number;
  height: number;
};

/** Page-owned responsive media; URLs remain explicit in the consuming page. */
export type ResponsiveImage = Pick<
  ImageBlock,
  "src" | "alt" | "width" | "height"
> & {
  srcset: string;
  sizes: string;
};

export type NoteBlock = {
  type: "note";
  text: ContentText;
};

export type ContentBlock =
  ParagraphBlock | ListBlock | TableBlock | NoteBlock | ImageBlock;

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

export type CountryGuideContent = EditorialTimestamps & {
  ready: boolean;
  slug: string;
  country: string;
  heroImage?: Omit<ImageBlock, "type">;
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

export type LegalPageContent = EditorialTimestamps & {
  ready: boolean;
  seo: SeoContent;
  title: string;
  intro: ContentText[];
  sections: ContentSection[];
  notice?: ContentText;
};
