export type ActivityCategory = 'class' | 'tour' | 'festival'

export interface Activity {
  id: string
  title: string
  image: string
  category: ActivityCategory
  tags: string[]         // rendered as pills, e.g. ['Free', '3 hrs', 'Age 16+']
  description: string    // short — shown on list cards
  popular: boolean       // true → appears in "Most Popular" carousel
}

export const activities: Activity[] = [
  // ── Popular (carousel) — 3 cards matching Figma's 3 pagination dots ─────────
  {
    id: 'watercolor-basics',
    title: 'Watercolor Basics',
    image: '/images/activities/watercolor-basics.jpg',
    category: 'class',
    tags: ['Free', 'Classes', '3 hrs', 'Age 16+'],
    description: 'Learn watercolour fundamentals with a TFAM resident artist. All materials provided.',
    popular: true,
  },
  {
    id: 'ink-painting-workshop',
    title: 'Ink Painting Workshop',
    image: '/images/activities/ink-painting-workshop.jpg',
    category: 'class',
    tags: ['Free', 'Classes', '4 hrs', 'Age 18+'],
    description: 'An intensive introduction to traditional ink painting techniques. Materials provided.',
    popular: true,
  },
  {
    id: 'photography-walk',
    title: 'Photography Walk',
    image: '/images/activities/photography-walk.jpg',
    category: 'tour',
    tags: ['Free', 'Tours', '2 hrs', 'Age 14+'],
    description: "Explore the museum and surrounding streets through a photographer's eye.",
    popular: true,
  },
  // ── Other Activities (list) — matching Figma exactly ─────────────────────────
  {
    id: 'guided-exhibition-tour',
    title: 'Guided Exhibition Tour',
    image: '/images/forms-in-motion.png',
    category: 'tour',
    tags: ['Free', 'Tours', '1.5 hrs', 'All ages'],
    description: 'Curator-led tour of current exhibitions. English and Mandarin available.',
    popular: false,
  },
  {
    id: 'sculpture-workshop',
    title: 'Sculpture Workshop',
    image: '/images/material-extensions.png',
    category: 'class',
    tags: ['Free', 'Classes', '3 hrs', 'Age 16+'],
    description: 'Introduction to watercolor techniques with a TFAM resident artist. Materials provided.',
    popular: false,
  },
  // ── Additional activities for filter variety ──────────────────────────────────
  {
    id: 'lantern-festival',
    title: 'Lantern Festival Workshop',
    image: '/images/forms-in-motion.png',
    category: 'festival',
    tags: ['Festivals', '2 hrs', 'Age 8+'],
    description: 'Craft and light your own paper lantern in this hands-on cultural workshop.',
    popular: false,
  },
  {
    id: 'moon-festival',
    title: 'Moon Festival Night',
    image: '/images/entanglements.png',
    category: 'festival',
    tags: ['Festivals', '3 hrs', 'All ages'],
    description: 'Celebrate the Mid-Autumn Festival with lanterns, mooncakes, and live music in the museum garden.',
    popular: false,
  },
  {
    id: 'family-art-tour',
    title: 'Family Art Tour',
    image: '/images/entanglements.png',
    category: 'tour',
    tags: ['Free', 'Tours', '1 hr', 'Age 5+'],
    description: 'A playful guided tour designed for families with young children.',
    popular: false,
  },
  {
    id: 'printmaking-workshop',
    title: 'Printmaking Workshop',
    image: '/images/your-curious-journey.png',
    category: 'class',
    tags: ['Classes', '4 hrs', 'Age 16+'],
    description: 'Create your own linocut prints with guidance from practising printmakers.',
    popular: false,
  },
]

export const getActivityById = (id: string): Activity | undefined =>
  activities.find(a => a.id === id)

export interface ScheduledDate {
  date: string  // ISO "YYYY-MM-DD"
  full: boolean
}

export const scheduledDates: Record<string, ScheduledDate[]> = {
  'watercolor-basics': [
    { date: '2026-09-05', full: false },
    { date: '2026-09-12', full: false },
    { date: '2026-09-19', full: true  },
    { date: '2026-09-26', full: false },
    { date: '2026-10-03', full: false },
    { date: '2026-10-10', full: false },
  ],
  'ink-painting-workshop': [
    { date: '2026-09-06', full: false },
    { date: '2026-09-13', full: false },
    { date: '2026-09-20', full: true  },
    { date: '2026-09-27', full: false },
  ],
  'photography-walk': [
    { date: '2026-09-07', full: false },
    { date: '2026-09-14', full: false },
    { date: '2026-09-21', full: false },
    { date: '2026-09-28', full: true  },
  ],
  'guided-exhibition-tour': [
    { date: '2026-09-02', full: false },
    { date: '2026-09-09', full: false },
    { date: '2026-09-16', full: true  },
    { date: '2026-09-23', full: false },
  ],
  'sculpture-workshop': [
    { date: '2026-09-04', full: false },
    { date: '2026-09-11', full: false },
    { date: '2026-09-18', full: false },
    { date: '2026-09-25', full: true  },
  ],
}
