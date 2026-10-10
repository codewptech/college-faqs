export interface NavigationItem {
  label: string
  to: string
}

export interface NavigationGroup {
  label: string
  items: NavigationItem[]
}

export const primaryNavigation: NavigationItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
]

export const navigationGroups: NavigationGroup[] = [
  {
    label: 'Programs',
    items: [
      { label: 'MBA', to: '/programs/mba' },
      { label: 'Engineering', to: '/programs/engineering' },
      { label: 'Study Abroad', to: '/programs/study-abroad' },
    ],
  },
  {
    label: 'Explore',
    items: [
      { label: 'Admission Guide', to: '/explore/admission-guide' },
      { label: 'Education Loan', to: '/explore/education-loan' },
      { label: 'FAQs', to: '/explore/faqs' },
    ],
  },
]

export const legalNavigation: NavigationItem[] = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms-and-conditions' },
]
