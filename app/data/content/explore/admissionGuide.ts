import type { ContentCta, ContentSection, ContentText, SeoContent } from '../types'

type SectionCollection = {
  eyebrow: string
  title: string
  intro: ContentText[]
  items: ContentSection[]
}

type AdmissionGuideContent = {
  ready: boolean
  seo: SeoContent
  eyebrow: string
  title: string
  subtitle: string
  intro: ContentText[]
  process: {
    eyebrow: string
    title: string
    intro: ContentText[]
    steps: ContentSection[]
  }
  shortlist: {
    eyebrow: string
    title: string
    intro: ContentText[]
    listTitle: string
    items: ContentText[]
  }
  readiness: SectionCollection
  sections: ContentSection[]
  cta: ContentCta
}

// PUBLIC CONTENT SLOT: add only publication-approved admission guidance here.
export const admissionGuideContent: AdmissionGuideContent = {
  ready: false,
  seo: { title: '', description: '' },
  eyebrow: '',
  title: 'Admission Guide',
  subtitle: '',
  intro: [],
  process: { eyebrow: '', title: '', intro: [], steps: [] },
  shortlist: { eyebrow: '', title: '', intro: [], listTitle: '', items: [] },
  readiness: { eyebrow: '', title: '', intro: [], items: [] },
  sections: [],
  cta: { eyebrow: '', title: '', text: '', links: [] },
}
