export type ExhibitionStatus = 'current' | 'coming-soon'

export interface Exhibition {
  id: string
  title: string
  image: string
  images: string[]         // ordered array for detail page slider
  endDate?: string         // ISO — present on current ("Until [date]")
  openDate?: string        // ISO — present on coming-soon ("Open [date]")
  floor: string
  gallery: string          // e.g. "Gallery A" — shown separately on detail page
  duration: number         // minutes
  categories: string[]
  description: string
  fullDescription: string  // longer text for detail page
  status: ExhibitionStatus
  featured: boolean        // true = appears in top carousel
}

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)  // local-time — avoids UTC midnight rollover
}

export function fmtLong(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(parseISO(iso))
}

function fmtShort(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(parseISO(iso))
}

export function metaLine(ex: Exhibition): string {
  return ex.status === 'current'
    ? `Until ${fmtLong(ex.endDate!)} | ${ex.floor} | ~${ex.duration} mins`
    : `Open ${fmtShort(ex.openDate!)} | ${ex.categories.join(' · ')}`
}

export const exhibitions: Exhibition[] = [
  {
    id: 'your-curious-journey',
    title: 'Your Curious Journey',
    image: '/images/your-curious-journey.png',
    images: [
      '/images/Your Curious Journey/your-curious-journey-1.jpg',
      '/images/Your Curious Journey/your-curious-journey-2.jpg',
      '/images/Your Curious Journey/your-curious-journey-3.jpg',
    ],
    endDate: '2026-08-30',
    floor: '1F',
    gallery: 'Gallery A',
    duration: 50,
    categories: ['Contemporary'],
    description: 'A seminal work exploring the tension between urban memory and natural form. Industrial materials layered against organic textures invite viewers to reconsider boundaries between the built and the living.',
    fullDescription: 'Some paths are marked. Others you make yourself. Move through this exhibition without a map — and see where curiosity leads.',
    status: 'current',
    featured: true,
  },
  {
    id: 'forms-in-motion',
    title: 'Forms in Motion',
    image: '/images/forms-in-motion.png',
    images: [
      '/images/Forms in Motion/forms-in-motion-1.png',
      '/images/Forms in Motion/forms-in-motion-2.png',
      '/images/Forms in Motion/forms-in-motion-3.png',
    ],
    endDate: '2026-07-01',
    floor: '2F',
    gallery: 'Gallery B',
    duration: 45,
    categories: ['Installation Art', 'Contemporary'],
    description: 'An immersive photography series examining how light sculpts perception. Thirty large-format prints trace the changing quality of light across different seasons and geographies.',
    fullDescription: 'From rigid material, unexpected tenderness. These sculptures trace the moment between stillness and movement — and ask which one we choose to inhabit.',
    status: 'current',
    featured: true,
  },
  {
    id: 'visions-of-tomorrow',
    title: 'Vision of Tomorrow',
    image: '/images/Vision of Tomorrow/vision-of-tomorrow.jpg',
    images: [
      '/images/Vision of Tomorrow/vision-of-tomorrow.jpg',
      '/images/Vision of Tomorrow/vision-of-tomorrow-2.jpg',
      '/images/Vision of Tomorrow/vision-of-tomorrow-3.jpg',
    ],
    endDate: '2026-08-30',
    floor: '2F',
    gallery: 'Gallery A',
    duration: 45,
    categories: ['Contemporary'],
    description: 'What do we imagine when we close our eyes and think of what comes next?',
    fullDescription: 'What do we imagine when we close our eyes and think of what comes next? These works don’t answer — they open the question wider.',
    status: 'current',
    featured: true,
  },
  // ── Current tab list (non-featured — do not appear in carousel) ─────────────
  {
    id: 'material-extensions',
    title: 'Material Extensions',
    image: '/images/material-extensions.png',
    images: [
      '/images/Material Extensions/material-extensions-1.png',
      '/images/Material Extensions/material-extensions-2.png',
      '/images/Material Extensions/material-extensions-3.png',
    ],
    endDate: '2026-08-30',
    floor: '2F',
    gallery: 'Gallery C',
    duration: 50,
    categories: ['Contemporary'],
    description: 'Site-specific installations using found industrial objects investigate the lifecycle of materials — from production through obsolescence — as a lens on environmental history.',
    fullDescription: 'Sound installations exploring how frequency and space shape human perception. Six rooms, each tuned to a different emotional resonance.',
    status: 'current',
    featured: false,
  },
  {
    id: 'surrealism',
    title: 'Surrealism',
    image: '/images/surrealism.png',
    images: [
      '/images/Surrealism/surrealism-1.jpg',
      '/images/Surrealism/surrealism-2.jpg',
      '/images/Surrealism/surrealism-3.jpg',
    ],
    endDate: '2026-07-01',
    floor: '1F',
    gallery: 'Gallery A',
    duration: 50,
    categories: ['Contemporary'],
    description: 'A survey of Surrealist practice across painting, sculpture, and photography, tracing the movement\'s exploration of the unconscious and the uncanny.',
    fullDescription: 'Reality, slightly tilted. These works borrow from the rational world and return something stranger — familiar enough to unsettle, strange enough to stay with you.',
    status: 'current',
    featured: false,
  },
  {
    id: 'tfam-screening-project',
    title: 'TFAM Screening Project',
    image: '/images/tfam-screening-project.png',
    images: ['/images/tfam-screening-project.png'],
    endDate: '2025-07-01',
    floor: '1F',
    gallery: '',
    duration: 60,
    categories: ['Installation Art'],
    description: 'A curated programme of experimental moving-image works presented in a purpose-built screening environment within the museum\'s ground floor galleries.',
    fullDescription: 'A curated programme of experimental moving-image works presented in a purpose-built screening environment within the museum\'s ground floor galleries.',
    status: 'current',
    featured: false,
  },
  // ── Coming soon ──────────────────────────────────────────────────────────────
  {
    id: 'material-extensions-coming',
    title: 'Entanglements',
    image: '/images/entanglements.png',
    images: ['/images/entanglements.png'],
    openDate: '2025-08-01',
    floor: '3F Gallery A',
    gallery: '',
    duration: 25,
    categories: ['Installation Art'],
    description: 'Site-specific installations using found industrial objects investigate the lifecycle of materials — from production through obsolescence — as a lens on environmental history.',
    fullDescription: 'Site-specific installations using found industrial objects investigate the lifecycle of materials — from production through obsolescence — as a lens on environmental history.',
    status: 'coming-soon',
    featured: false,
  },
  {
    id: 'sound-of-sinking',
    title: 'The Sound of Sinking',
    image: '/images/the-sound-of-sinking.png',
    images: ['/images/the-sound-of-sinking.png'],
    openDate: '2025-09-04',
    floor: '2F Gallery B',
    gallery: '',
    duration: 15,
    categories: ['Photography'],
    description: 'An immersive sound installation drawing on field recordings and photography to chart the slow disappearance of coastal landscapes across Southeast Asia.',
    fullDescription: 'An immersive sound installation drawing on field recordings and photography to chart the slow disappearance of coastal landscapes across Southeast Asia.',
    status: 'coming-soon',
    featured: false,
  },
]

export const getFeatured = (): Exhibition[] => exhibitions.filter(e => e.featured)
export const getByStatus = (s: ExhibitionStatus): Exhibition[] => exhibitions.filter(e => e.status === s)
export const getById = (id: string): Exhibition | undefined => exhibitions.find(e => e.id === id)
