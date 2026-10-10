export type StudyDestination = {
  id: string
  name: string
  shortName: string
  description?: string
  considerations?: string[]
}

// Country names and routes are public navigation. Add only publication-approved
// descriptions or considerations; empty optional fields are omitted by the page.
export const studyDestinations: StudyDestination[] = [
  { id: 'usa', name: 'United States', shortName: 'USA' },
  { id: 'uk', name: 'United Kingdom', shortName: 'UK' },
  { id: 'canada', name: 'Canada', shortName: 'Canada' },
  { id: 'australia', name: 'Australia', shortName: 'Australia' },
  { id: 'france', name: 'France', shortName: 'France' },
  { id: 'germany', name: 'Germany', shortName: 'Germany' },
  { id: 'malaysia', name: 'Malaysia', shortName: 'Malaysia' },
  { id: 'uae', name: 'United Arab Emirates', shortName: 'UAE' },
  { id: 'georgia', name: 'Georgia', shortName: 'Georgia' },
]
