import type { ContentCta, ContentLink, ContentSection, ContentText, SeoContent } from './types'

export type AboutCard = {
  title: string
  description?: ContentText
}

type AboutCollection = {
  eyebrow: string
  title: string
  intro?: ContentText
  items: AboutCard[]
}

type AboutStatistics = {
  title: string
  items: Array<{ value: string; label: string }>
}

type AboutContent = {
  ready: boolean
  seo: SeoContent
  eyebrow: string
  title: string
  intro: ContentText[]
  heroLinks: ContentLink[]
  sections: ContentSection[]
  principles: AboutCollection
  features: AboutCollection
  journey: AboutCollection
  statistics: AboutStatistics
  mission: ContentCta
}

// PUBLIC CONTENT SLOT: add only text approved for publication, then set ready to true.
export const aboutContent: AboutContent = {
  ready: false,
  seo: { title: '', description: '' },
  eyebrow: '',
  title: 'About',
  intro: [],
  heroLinks: [],
  sections: [],
  principles: { eyebrow: '', title: '', intro: '', items: [] },
  features: { eyebrow: '', title: '', intro: '', items: [] },
  journey: { eyebrow: '', title: '', intro: '', items: [] },
  statistics: { title: '', items: [] },
  mission: { eyebrow: '', title: '', text: '', links: [] },
}
