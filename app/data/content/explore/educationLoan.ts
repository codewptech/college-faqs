import type { ContentCta, ContentSection, ContentText, SeoContent } from '../types'

type SectionCollection = {
  eyebrow: string
  title: string
  intro: ContentText[]
  items: ContentSection[]
}

type EducationLoanContent = {
  ready: boolean
  seo: SeoContent
  eyebrow: string
  title: string
  subtitle: string
  intro: ContentText[]
  costs: SectionCollection
  guidance: SectionCollection
  documents: {
    eyebrow: string
    title: string
    intro: ContentText[]
    items: ContentText[]
  }
  notice: ContentText
  sections: ContentSection[]
  cta: ContentCta
}

// PUBLIC CONTENT SLOT: add only publication-approved education-loan content here.
export const educationLoanContent: EducationLoanContent = {
  ready: false,
  seo: { title: '', description: '' },
  eyebrow: '',
  title: 'Education Loan',
  subtitle: '',
  intro: [],
  costs: { eyebrow: '', title: '', intro: [], items: [] },
  guidance: { eyebrow: '', title: '', intro: [], items: [] },
  documents: { eyebrow: '', title: '', intro: [], items: [] },
  notice: '',
  sections: [],
  cta: { eyebrow: '', title: '', text: '', links: [] },
}
