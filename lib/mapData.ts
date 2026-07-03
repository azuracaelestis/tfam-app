// ---------------------------------------------------------------------------
// Map screen floor/room data
// Add new floors or rooms here — no React imports, plain data only.
// ---------------------------------------------------------------------------

export type AmenityType = 'toilet' | 'cafe' | 'locker' | 'changing-room'

export type Room = {
  id: string
  name: string
  type: 'gallery' | 'corridor' | 'lobby' | 'bookstore' | 'children' | 'staircase' | 'landing' | AmenityType
  amenity?: AmenityType       // set when this room IS an amenity (used for chip filtering)
  amenityIcon?: AmenityType   // renders a small icon badge in the bottom-right corner of the card
  exhibitionId?: string       // present on tappable gallery rooms only
  col: number                 // CSS grid-column start (1-based)
  row: number                 // CSS grid-row start (1-based)
  colSpan: number
  rowSpan: number
}

export type FloorData = {
  id: 'B1' | '1F' | '2F' | '3F'
  label: string
  disabled?: boolean
  gridCols: number
  gridRows: number
  rooms: Room[]
  amenityChips: AmenityType[]
  suggestedRoute?: {
    label: string
    subtext: string
    stops: string[]           // ordered room ids
  }
}

export const FLOORS: FloorData[] = [
  {
    id: 'B1',
    label: 'B1',
    gridCols: 6,
    gridRows: 3,
    amenityChips: ['toilet', 'cafe', 'locker'],
    rooms: [
      { id: 'cafe',          name: 'Cafe',          type: 'cafe',      amenity: 'cafe',   col: 1, row: 1, colSpan: 6, rowSpan: 1 },
      { id: 'children-area', name: 'Children Area', type: 'children',                     col: 1, row: 2, colSpan: 3, rowSpan: 1 },
      { id: 'book-store',    name: 'Book Store',    type: 'bookstore',                    col: 4, row: 2, colSpan: 3, rowSpan: 1 },
      { id: 'corridor',      name: 'Corridor',      type: 'corridor',                     col: 1, row: 3, colSpan: 3, rowSpan: 1 },
      { id: 'landing',       name: '',              type: 'landing',                      col: 4, row: 3, colSpan: 1, rowSpan: 1 },
      { id: 'staircase',     name: '',              type: 'staircase',                    col: 5, row: 3, colSpan: 2, rowSpan: 1 },
    ],
  },
  {
    id: '1F',
    label: '1F',
    gridCols: 6,
    gridRows: 3,
    amenityChips: ['toilet', 'cafe', 'locker'],
    suggestedRoute: {
      label: 'Suggested first visit route',
      subtext: '~2 hours · 3 stops across first floor',
      stops: ['gallery-b', 'gallery-a', 'gallery-c'],
    },
    rooms: [
      { id: 'gallery-a', name: 'Gallery A', type: 'gallery', exhibitionId: 'your-curious-journey',   col: 1, row: 1, colSpan: 6, rowSpan: 1 },
      { id: 'gallery-c', name: 'Gallery C', type: 'gallery', exhibitionId: 'surrealism',             col: 1, row: 2, colSpan: 3, rowSpan: 1 },
      { id: 'gallery-b', name: 'Gallery B', type: 'gallery', exhibitionId: 'tfam-screening-project', col: 4, row: 2, colSpan: 3, rowSpan: 1 },
      { id: 'corridor',  name: 'Corridor',  type: 'corridor',                                        col: 1, row: 3, colSpan: 3, rowSpan: 1 },
      { id: 'landing',   name: '',          type: 'landing',                                         col: 4, row: 3, colSpan: 1, rowSpan: 1 },
      { id: 'staircase', name: '',          type: 'staircase',                                       col: 5, row: 3, colSpan: 2, rowSpan: 1 },
    ],
  },
  {
    id: '2F',
    label: '2F',
    gridCols: 6,
    gridRows: 3,
    amenityChips: ['toilet', 'cafe', 'locker', 'changing-room'],
    rooms: [
      { id: 'gallery-a', name: 'Gallery A',        type: 'gallery', exhibitionId: 'visions-of-tomorrow', col: 1, row: 1, colSpan: 3, rowSpan: 1 },
      { id: 'gallery-b', name: 'Gallery B',        type: 'gallery', exhibitionId: 'forms-in-motion',     col: 4, row: 1, colSpan: 3, rowSpan: 1, amenityIcon: 'cafe' },
      { id: 'gallery-c', name: 'Gallery C',        type: 'gallery', exhibitionId: 'material-extensions', col: 1, row: 2, colSpan: 1, rowSpan: 1 },
      { id: 'lobby',     name: 'Lobby / Entrance', type: 'lobby',                                        col: 2, row: 2, colSpan: 2, rowSpan: 1 },
      { id: 'gallery-d', name: 'Gallery D',        type: 'gallery',                                      col: 4, row: 2, colSpan: 3, rowSpan: 1, amenityIcon: 'cafe' },
      { id: 'corridor',  name: 'Corridor',         type: 'corridor',                                     col: 1, row: 3, colSpan: 3, rowSpan: 1 },
      { id: 'landing',   name: '',                 type: 'landing',                                      col: 4, row: 3, colSpan: 1, rowSpan: 1 },
      { id: 'staircase', name: '',                 type: 'staircase',                                    col: 5, row: 3, colSpan: 2, rowSpan: 1 },
    ],
  },
  {
    id: '3F',
    label: '3F',
    disabled: true,
    gridCols: 4,
    gridRows: 3,
    amenityChips: [],
    rooms: [],
  },
]

export function getFloor(id: string): FloorData | undefined {
  return FLOORS.find(f => f.id === id)
}

export const AMENITY_LABELS: Record<AmenityType, string> = {
  toilet:          'Toilet',
  cafe:            'Cafe',
  locker:          'Locker',
  'changing-room': 'Changing Room',
}
