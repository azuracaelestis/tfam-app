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
  // ── Popular (carousel) — matching Figma's "Featured This Week" exactly ──────
  {
    id: 'watercolor-basics',
    title: 'Water Color Basic',
    titleZh: '水彩基礎課程',
    image: '/images/activities/water-color-basic.png',
    category: 'class',
    tags: ['Free', 'Classes', '2 hrs', 'Age 12+'],
    description: 'Learn essential watercolor techniques with a TFAM teaching artist.',
    descriptionZh: '跟隨北美館駐館藝術家，學習基礎水彩技法。',
    popular: true,
  },
  {
    id: 'curator-led',
    title: 'Curator-Led',
    titleZh: '策展人導覽',
    image: '/images/activities/curator-led.png',
    category: 'tour',
    tags: ['Free', 'Tours', '3 hrs', 'Age 18+'],
    description: 'Join a curator-led tour highlighting the stories behind current exhibitions.',
    descriptionZh: '參加策展人導覽，深入了解當期展覽背後的故事。',
    popular: true,
  },
  {
    id: 'ink-painting-workshop',
    title: 'Ink Painting Workshop',
    titleZh: '水墨畫工作坊',
    image: '/images/activities/ink-painting-workshop.png',
    category: 'class',
    tags: ['Free', 'Classes', '4 hrs', 'Age 16+'],
    description: 'Learn traditional ink painting techniques in this hands-on workshop.',
    descriptionZh: '透過實作課程，學習傳統水墨畫技法。',
    popular: true,
  },
  // ── Other Activities (list) — matching Figma exactly ─────────────────────────
  {
    id: 'guided-exhibition-tour',
    title: 'Guided Exhibition Tour',
    titleZh: '展覽導覽',
    image: '/images/activities/guided-exhibition-tour.png',
    category: 'tour',
    tags: ['Free', 'Tours', '2 hrs', 'Age 12+'],
    description: 'Curator-led tour of current exhibitions. English and Mandarin available.',
    descriptionZh: '由策展人帶領參觀當期展覽，提供英文與國語導覽。',
    popular: false,
  },
  {
    id: 'sculpture-workshop',
    title: 'Sculpture Workshop',
    titleZh: '雕塑工作坊',
    image: '/images/activities/sculpture-workshop.png',
    category: 'class',
    tags: ['Free', 'Classes', '2 hrs', 'Age 16+'],
    description: 'Learn essential watercolor techniques with a TFAM teaching artist.',
    descriptionZh: '學習基礎水彩技法，由北美館駐館藝術家親自指導。',
    popular: false,
  },
  {
    id: 'photography-walk',
    title: 'Photography Walk',
    titleZh: '攝影漫遊',
    image: '/images/activities/photography-walk.jpg',
    category: 'tour',
    tags: ['Free', 'Tours', '2 hrs', 'Age 14+'],
    description: "Explore the museum and surrounding streets through a photographer's eye.",
    popular: false,
  },
  // ── Additional activities for filter variety ──────────────────────────────────
  {
    id: 'lantern-festival',
    title: 'Lantern Festival Workshop',
    titleZh: '花燈工作坊',
    image: '/images/activities/lantern-festival-workshop.png',
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
    image: '/images/activities/moon-festival-night.png',
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
    image: '/images/activities/family-art-tour.png',
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
    image: '/images/activities/printmaking-workshop.png',
    category: 'class',
    tags: ['Classes', '4 hrs', 'Age 16+'],
    description: 'Create your own linocut prints with guidance from practising printmakers.',
    descriptionZh: '在專業版畫家指導下，親手製作專屬亞麻油氈版畫。',
    popular: false,
  },
]

export const getActivityById = (id: string): Activity | undefined =>
  activities.find(a => a.id === id)

export const getDurationTag = (a: Activity): string | undefined =>
  a.tags.find(tag => /^\d+(?:\.\d+)? hrs?$/.test(tag))

export const getAgeTag = (a: Activity): string | undefined =>
  a.tags.find(tag => /^Age \d+\+$/.test(tag) || tag === 'All ages')

export interface ScheduledDate {
  date: string        // ISO "YYYY-MM-DD"
  fullSlots: string[] // slot IDs sold out on this date, e.g. ['09:00-12:00']
}

export const TIME_SLOTS = ['09:00-12:00', '14:00-16:00', '18:00-20:00'] as const
export type TimeSlot = typeof TIME_SLOTS[number]

// Dates are kept rolling a few weeks out from "today" on purpose — every
// activity needs at least one real future date for ChooseDateClient to show
// anything bookable at all (it finds the first scheduled date >= today and
// opens the calendar on that month). Previously only 5 of the 10 activities
// had entries here, and even those had drifted entirely into the past, so
// every activity (including ones with data) showed a dateless calendar.
export const scheduledDates: Record<string, ScheduledDate[]> = {
  'watercolor-basics': [
    { date: '2026-10-10', fullSlots: [] },
    { date: '2026-10-17', fullSlots: ['09:00-12:00'] },
    { date: '2026-10-24', fullSlots: ['09:00-12:00', '14:00-16:00', '18:00-20:00'] }, // all full
    { date: '2026-10-31', fullSlots: [] },
    { date: '2026-11-07', fullSlots: ['14:00-16:00'] },
    { date: '2026-11-14', fullSlots: [] },
  ],
  'curator-led': [
    { date: '2026-10-11', fullSlots: [] },
    { date: '2026-10-18', fullSlots: ['18:00-20:00'] },
    { date: '2026-10-25', fullSlots: ['09:00-12:00', '14:00-16:00', '18:00-20:00'] }, // all full
    { date: '2026-11-01', fullSlots: [] },
    { date: '2026-11-08', fullSlots: [] },
  ],
  'ink-painting-workshop': [
    { date: '2026-10-12', fullSlots: [] },
    { date: '2026-10-19', fullSlots: ['18:00-20:00'] },
    { date: '2026-10-26', fullSlots: ['09:00-12:00', '14:00-16:00', '18:00-20:00'] }, // all full
    { date: '2026-11-02', fullSlots: [] },
  ],
  'photography-walk': [
    { date: '2026-10-13', fullSlots: [] },
    { date: '2026-10-20', fullSlots: ['09:00-12:00', '14:00-16:00'] },
    { date: '2026-10-27', fullSlots: [] },
    { date: '2026-11-03', fullSlots: ['09:00-12:00', '14:00-16:00', '18:00-20:00'] }, // all full
  ],
  'guided-exhibition-tour': [
    { date: '2026-10-14', fullSlots: [] },
    { date: '2026-10-21', fullSlots: ['09:00-12:00'] },
    { date: '2026-10-28', fullSlots: ['09:00-12:00', '14:00-16:00', '18:00-20:00'] }, // all full
    { date: '2026-11-04', fullSlots: ['14:00-16:00'] },
  ],
  'sculpture-workshop': [
    { date: '2026-10-15', fullSlots: [] },
    { date: '2026-10-22', fullSlots: [] },
    { date: '2026-10-29', fullSlots: ['18:00-20:00'] },
    { date: '2026-11-05', fullSlots: ['09:00-12:00', '14:00-16:00', '18:00-20:00'] }, // all full
  ],
  'lantern-festival': [
    { date: '2026-10-16', fullSlots: [] },
    { date: '2026-10-23', fullSlots: ['09:00-12:00', '14:00-16:00', '18:00-20:00'] }, // all full
    { date: '2026-10-30', fullSlots: [] },
    { date: '2026-11-06', fullSlots: ['14:00-16:00'] },
  ],
  'moon-festival': [
    { date: '2026-10-09', fullSlots: [] },
    { date: '2026-10-16', fullSlots: ['09:00-12:00', '14:00-16:00', '18:00-20:00'] }, // all full
    { date: '2026-10-23', fullSlots: [] },
  ],
  'family-art-tour': [
    { date: '2026-10-10', fullSlots: [] },
    { date: '2026-10-17', fullSlots: [] },
    { date: '2026-10-24', fullSlots: ['09:00-12:00'] },
    { date: '2026-10-31', fullSlots: [] },
    { date: '2026-11-07', fullSlots: ['09:00-12:00', '14:00-16:00', '18:00-20:00'] }, // all full
  ],
  'printmaking-workshop': [
    { date: '2026-10-13', fullSlots: [] },
    { date: '2026-10-20', fullSlots: [] },
    { date: '2026-10-27', fullSlots: ['09:00-12:00', '14:00-16:00', '18:00-20:00'] }, // all full
    { date: '2026-11-03', fullSlots: ['18:00-20:00'] },
  ],
}
