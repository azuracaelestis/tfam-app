export type ActivityCategory = 'class' | 'tour' | 'festival'

export interface Activity {
  id: string
  title: string
  titleZh?: string
  image: string
  category: ActivityCategory
  tags: string[]         // rendered as pills, e.g. ['Free', '3 hrs', 'Age 16+']
  description: string    // short — shown on list cards
  descriptionZh?: string
  popular: boolean       // true → appears in "Most Popular" carousel
}

export const activities: Activity[] = [
  // ── Popular (carousel) — 3 cards matching Figma's 3 pagination dots ─────────
  {
    id: 'watercolor-basics',
    title: 'Watercolor Basics',
    titleZh: '水彩基礎課程',
    image: '/images/activities/watercolor-basics.jpg',
    category: 'class',
    tags: ['Free', 'Classes', '3 hrs', 'Age 16+'],
    description: 'Learn watercolour fundamentals with a TFAM resident artist. All materials provided.',
    popular: true,
  },
  {
    id: 'ink-painting-workshop',
    title: 'Ink Painting Workshop',
    titleZh: '水墨畫工作坊',
    image: '/images/activities/ink-painting-workshop.jpg',
    category: 'class',
    tags: ['Free', 'Classes', '4 hrs', 'Age 18+'],
    description: 'An intensive introduction to traditional ink painting techniques. Materials provided.',
    popular: true,
  },
  {
    id: 'photography-walk',
    title: 'Photography Walk',
    titleZh: '攝影漫遊',
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
    titleZh: '展覽導覽',
    image: '/images/forms-in-motion.png',
    category: 'tour',
    tags: ['Free', 'Tours', '1.5 hrs', 'All ages'],
    description: 'Curator-led tour of current exhibitions. English and Mandarin available.',
    descriptionZh: '由策展人帶領參觀當期展覽，提供英文與國語導覽。',
    popular: false,
  },
  {
    id: 'sculpture-workshop',
    title: 'Sculpture Workshop',
    titleZh: '雕塑工作坊',
    image: '/images/material-extensions.png',
    category: 'class',
    tags: ['Free', 'Classes', '3 hrs', 'Age 16+'],
    description: 'Introduction to sculpture techniques with a TFAM resident artist. Materials provided.',
    descriptionZh: '由北美館駐館藝術家帶領的雕塑技法入門課程，材料由主辦方提供。',
    popular: false,
  },
  // ── Additional activities for filter variety ──────────────────────────────────
  {
    id: 'lantern-festival',
    title: 'Lantern Festival Workshop',
    titleZh: '花燈工作坊',
    image: '/images/forms-in-motion.png',
    category: 'festival',
    tags: ['Festivals', '2 hrs', 'Age 8+'],
    description: 'Craft and light your own paper lantern in this hands-on cultural workshop.',
    descriptionZh: '親手製作並點亮專屬紙燈籠，體驗傳統文化手作課程。',
    popular: false,
  },
  {
    id: 'moon-festival',
    title: 'Moon Festival Night',
    titleZh: '中秋夜晚會',
    image: '/images/entanglements.png',
    category: 'festival',
    tags: ['Festivals', '3 hrs', 'All ages'],
    description: 'Celebrate the Mid-Autumn Festival with lanterns, mooncakes, and live music in the museum garden.',
    descriptionZh: '在美術館庭園歡度中秋節，賞燈、品月餅、聽現場音樂演出。',
    popular: false,
  },
  {
    id: 'family-art-tour',
    title: 'Family Art Tour',
    titleZh: '親子藝術導覽',
    image: '/images/entanglements.png',
    category: 'tour',
    tags: ['Free', 'Tours', '1 hr', 'Age 5+'],
    description: 'A playful guided tour designed for families with young children.',
    descriptionZh: '專為親子家庭設計的趣味導覽活動。',
    popular: false,
  },
  {
    id: 'printmaking-workshop',
    title: 'Printmaking Workshop',
    titleZh: '版畫工作坊',
    image: '/images/your-curious-journey.png',
    category: 'class',
    tags: ['Classes', '4 hrs', 'Age 16+'],
    description: 'Create your own linocut prints with guidance from practising printmakers.',
    descriptionZh: '在專業版畫家指導下，親手製作專屬亞麻油氈版畫。',
    popular: false,
  },
]

export const getActivityById = (id: string): Activity | undefined =>
  activities.find(a => a.id === id)

export interface ScheduledDate {
  date: string        // ISO "YYYY-MM-DD"
  fullSlots: string[] // slot IDs sold out on this date, e.g. ['09:00-12:00']
}

export const TIME_SLOTS = ['09:00-12:00', '14:00-16:00', '18:00-20:00'] as const
export type TimeSlot = typeof TIME_SLOTS[number]

export const scheduledDates: Record<string, ScheduledDate[]> = {
  'watercolor-basics': [
    { date: '2026-09-05', fullSlots: ['09:00-12:00'] },
    { date: '2026-09-12', fullSlots: [] },
    { date: '2026-09-19', fullSlots: ['09:00-12:00', '14:00-16:00', '18:00-20:00'] }, // all full
    { date: '2026-09-26', fullSlots: [] },
    { date: '2026-10-03', fullSlots: ['14:00-16:00'] },
    { date: '2026-10-10', fullSlots: [] },
  ],
  'ink-painting-workshop': [
    { date: '2026-09-06', fullSlots: [] },
    { date: '2026-09-13', fullSlots: ['18:00-20:00'] },
    { date: '2026-09-20', fullSlots: ['09:00-12:00', '14:00-16:00', '18:00-20:00'] }, // all full
    { date: '2026-09-27', fullSlots: [] },
  ],
  'photography-walk': [
    { date: '2026-09-07', fullSlots: [] },
    { date: '2026-09-14', fullSlots: ['09:00-12:00', '14:00-16:00'] },
    { date: '2026-09-21', fullSlots: [] },
    { date: '2026-09-28', fullSlots: ['09:00-12:00', '14:00-16:00', '18:00-20:00'] }, // all full
  ],
  'guided-exhibition-tour': [
    { date: '2026-09-02', fullSlots: [] },
    { date: '2026-09-09', fullSlots: ['09:00-12:00'] },
    { date: '2026-09-16', fullSlots: ['09:00-12:00', '14:00-16:00', '18:00-20:00'] }, // all full
    { date: '2026-09-23', fullSlots: ['14:00-16:00'] },
  ],
  'sculpture-workshop': [
    { date: '2026-09-04', fullSlots: [] },
    { date: '2026-09-11', fullSlots: [] },
    { date: '2026-09-18', fullSlots: ['18:00-20:00'] },
    { date: '2026-09-25', fullSlots: ['09:00-12:00', '14:00-16:00', '18:00-20:00'] }, // all full
  ],
}
