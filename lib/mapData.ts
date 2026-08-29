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
  col: number                 // CSS grid-column start (1-based) — fallback grid, used when a floor has no mapImage
  row: number                 // CSS grid-row start (1-based)
  colSpan: number
  rowSpan: number
  /** [x, y, width, height] in the floor's mapImage viewBox coordinate space —
   *  positions the invisible tap hotspot (and amenity-highlight ring) over the
   *  matching room baked into the illustration. Omitted for floors with no
   *  mapImage, or for rooms that are neither tappable nor amenity-matched. */
  rect?: [number, number, number, number]
}

export type FloorData = {
  id: 'B1' | '1F' | '2F' | '3F'
  label: string
  disabled?: boolean
  gridCols: number
  gridRows: number
  rooms: Room[]
  amenityChips: AmenityType[]
  /** Chips shown but non-interactive on this floor (e.g. Cafe only exists on
   *  B1) — rendered per the Figma "unavailable" chip style, not omitted. */
  disabledAmenityChips?: AmenityType[]
  suggestedRoute?: {
    label: string
    subtext: string
    stops: string[]           // ordered room ids
  }
  /** Exported floor-plan illustration (room layout, labels, icons, and the
   *  Offline badge are all baked into this image) — width/height are its
   *  native SVG viewBox size, used to convert each room's `rect` into
   *  percentage-based hotspot positioning. */
  mapImage?: { src: string; width: number; height: number }
  /** Center point, in the mapImage's viewBox coordinate space, where a
   *  circular icon badge for that amenity appears when its chip is tapped —
   *  mutually exclusive with the other amenities (only the active chip's
   *  marker renders). Per Figma nodes 229:967 (toilet) / 229:881 (locker). */
  amenityMarkers?: Partial<Record<AmenityType, { x: number; y: number }>>
  /** An amenity icon baked permanently into mapImage (e.g. B1's Cafe icon+
   *  label, always visible with no chip tapped) — `rect` covers just the
   *  icon glyph, in the mapImage's viewBox space, so it can be masked with a
   *  plain white cover whenever a *different* amenity chip is active. */
  bakedAmenityIcon?: { amenity: AmenityType; rect: [number, number, number, number] }
}

export const FLOORS: FloorData[] = [
  {
    id: 'B1',
    label: 'B1',
    gridCols: 6,
    gridRows: 3,
    amenityChips: ['toilet', 'cafe', 'locker'],
    mapImage: { src: '/map/map-b1.svg', width: 368, height: 461 },
    // Cafe's marker sits over the same spot as the baked-in glyph it
    // replaces (see bakedAmenityIcon below) — kept at the same 33x33 size as
    // toilet/locker so all three amenity badges read consistently.
    amenityMarkers: {
      toilet: { x: 121, y: 340 },
      cafe: { x: 187, y: 106 },
      locker: { x: 302.5, y: 327 },
    },
    bakedAmenityIcon: { amenity: 'cafe', rect: [162, 81, 50, 50] },
    rooms: [
      { id: 'cafe',          name: 'Cafe',          type: 'cafe',      amenity: 'cafe',   col: 1, row: 1, colSpan: 6, rowSpan: 1, rect: [23.5, 65.5, 324, 118] },
      { id: 'children-area', name: 'Children Area', type: 'children',                     col: 1, row: 2, colSpan: 3, rowSpan: 1, rect: [22.5, 201.5, 214, 117] },
      { id: 'book-store',    name: 'Book Store',    type: 'bookstore',                    col: 4, row: 2, colSpan: 3, rowSpan: 1, rect: [253.5, 201.5, 93, 117] },
      { id: 'corridor',      name: 'Corridor',      type: 'corridor',                     col: 1, row: 3, colSpan: 3, rowSpan: 1, rect: [20.5, 341.5, 191, 89] },
      { id: 'landing',       name: '',              type: 'landing',                      col: 4, row: 3, colSpan: 1, rowSpan: 1, rect: [222.5, 341.5, 29, 28] },
      { id: 'staircase',     name: '',              type: 'staircase',                    col: 5, row: 3, colSpan: 2, rowSpan: 1, rect: [222.5, 379.5, 121, 51] },
    ],
  },
  {
    id: '1F',
    label: '1F',
    gridCols: 6,
    gridRows: 3,
    amenityChips: ['toilet', 'cafe', 'locker'],
    disabledAmenityChips: ['cafe'],
    suggestedRoute: {
      label: 'Suggested first visit route',
      subtext: '~2 hours · 3 stops across first floor',
      stops: ['gallery-b', 'gallery-a', 'gallery-c'],
    },
    mapImage: { src: '/map/map-1f.svg', width: 368, height: 467 },
    rooms: [
      { id: 'gallery-a', name: 'Gallery A', type: 'gallery', exhibitionId: 'your-curious-journey',   col: 1, row: 1, colSpan: 6, rowSpan: 1, rect: [20, 60, 328, 119] },
      { id: 'gallery-c', name: 'Gallery C', type: 'gallery', exhibitionId: 'tfam-screening-project', col: 1, row: 2, colSpan: 3, rowSpan: 1, rect: [20, 197, 157, 140.7] },
      { id: 'gallery-b', name: 'Gallery B', type: 'gallery', exhibitionId: 'material-extensions',    col: 4, row: 2, colSpan: 3, rowSpan: 1, rect: [191, 197, 157, 140.7] },
      { id: 'corridor',  name: 'Corridor',  type: 'corridor',                                        col: 1, row: 3, colSpan: 3, rowSpan: 1, rect: [20, 359.7, 157, 70.3] },
      { id: 'landing',   name: '',          type: 'landing',                                         col: 4, row: 3, colSpan: 1, rowSpan: 1, rect: [191, 359.7, 30, 29] },
      { id: 'staircase', name: '',          type: 'staircase',                                       col: 5, row: 3, colSpan: 2, rowSpan: 1, rect: [191, 397.7, 122, 52] },
    ],
  },
  {
    id: '2F',
    label: '2F',
    gridCols: 6,
    gridRows: 3,
    amenityChips: ['toilet', 'cafe', 'locker'],
    disabledAmenityChips: ['cafe', 'locker'],
    mapImage: { src: '/map/map-2f.svg', width: 368, height: 461 },
    rooms: [
      { id: 'gallery-a', name: 'Gallery A',        type: 'gallery', exhibitionId: 'visions-of-tomorrow', col: 1, row: 1, colSpan: 3, rowSpan: 1, rect: [21.5, 60.5, 169, 142] },
      { id: 'gallery-b', name: 'Gallery B',        type: 'gallery', exhibitionId: 'forms-in-motion',     col: 4, row: 1, colSpan: 3, rowSpan: 1, amenityIcon: 'cafe', rect: [206.5, 60.5, 138, 142] },
      { id: 'gallery-c', name: 'Gallery C',        type: 'gallery', exhibitionId: 'surrealism',           col: 1, row: 2, colSpan: 1, rowSpan: 1, rect: [21.5, 215.5, 91, 117] },
      { id: 'lobby',     name: 'Lobby / Entrance', type: 'lobby',                                        col: 2, row: 2, colSpan: 2, rowSpan: 1, rect: [124.5, 215.5, 104, 117] },
      { id: 'gallery-d', name: 'Gallery D',        type: 'gallery',                                      col: 4, row: 2, colSpan: 3, rowSpan: 1, amenityIcon: 'cafe', rect: [240.5, 215.5, 104, 117] },
      { id: 'corridor',  name: 'Corridor',         type: 'corridor',                                     col: 1, row: 3, colSpan: 3, rowSpan: 1, rect: [21.5, 345.5, 191, 89] },
      { id: 'landing',   name: '',                 type: 'landing',                                      col: 4, row: 3, colSpan: 1, rowSpan: 1, rect: [223.5, 345.5, 29, 28] },
      { id: 'staircase', name: '',                 type: 'staircase',                                    col: 5, row: 3, colSpan: 2, rowSpan: 1, rect: [223.5, 383.5, 121, 51] },
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
