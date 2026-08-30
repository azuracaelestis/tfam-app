// ---------------------------------------------------------------------------
// Map screen floor/room data
// Add new floors or rooms here — no React imports, plain data only.
// ---------------------------------------------------------------------------

export type AmenityType = 'toilet' | 'cafe' | 'locker' | 'changing-room'

export type Room = {
  id: string
  name: string
  nameZh?: string
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
    /** Number shown on the first stop's badge (rest count up from it) — 1F
     *  continues on B1 numbering conceptually but has no chips before it, so
     *  starts at 1; 2F continues 1F's three stops, starting at 4. */
    startNumber?: number
  }
  /** Center point, in the mapImage's viewBox coordinate space, for each
   *  suggestedRoute stop's numbered badge — only needed for a floor whose
   *  map art has no such numbers already baked in (1F's are flattened
   *  vector text baked into map-1f.svg; 2F has none, so it's rendered here
   *  via RouteNumberBadge instead). Per Figma node 238:1670. */
  routeMarkers?: Partial<Record<string, { x: number; y: number }>>
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
  /** The amenity marker shown when no chip is tapped (e.g. B1's Cafe, always
   *  visible as a landmark) — must have a matching `amenityMarkers` entry.
   *  Only use this for a spot with no baked art of its own (map-b1.svg has
   *  no Cafe glyph — this marker is the only thing that ever draws it, in
   *  every state), since there'd otherwise be no clean way to hide the baked
   *  version when a different chip is tapped without a visible seam. A floor
   *  whose default landmark *is* baked into its art (1F's Locker) should
   *  leave it alone instead — omit this field and don't try to replace it. */
  defaultAmenityMarker?: AmenityType
}

export const FLOORS: FloorData[] = [
  {
    id: 'B1',
    label: 'B1',
    gridCols: 6,
    gridRows: 3,
    amenityChips: ['toilet', 'cafe', 'locker'],
    mapImage: { src: '/map/map-b1.svg', width: 368, height: 461 },
    // map-b1.svg has no Cafe glyph baked in (removed — see defaultAmenityMarker
    // below) — this is the only thing that ever draws it, matching the spot
    // it used to occupy in the source art.
    amenityMarkers: {
      toilet: { x: 121, y: 340 },
      cafe: { x: 187, y: 106 },
      locker: { x: 302.5, y: 327 },
    },
    defaultAmenityMarker: 'cafe',
    rooms: [
      { id: 'cafe',          name: 'Cafe',          nameZh: '咖啡廳',   type: 'cafe',      amenity: 'cafe',   col: 1, row: 1, colSpan: 6, rowSpan: 1, rect: [23.5, 65.5, 324, 118] },
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
    // Positions read directly from the now-removed baked badges in
    // map-1f.svg (each was a circle centered on these coordinates) before
    // hiding the route stopped being able to erase them — rendered via
    // RouteNumberBadge instead, same as 2F, so Hide can dismiss them too.
    routeMarkers: {
      'gallery-b': { x: 199, y: 205 },
      'gallery-a': { x: 28, y: 67 },
      'gallery-c': { x: 30, y: 205 },
    },
    mapImage: { src: '/map/map-1f.svg', width: 368, height: 467 },
    // Toilet sits at the left side of the Corridor/Gallery C boundary, per
    // feedback; Locker at the right side, over the spot its own glyph used
    // to occupy (now removed from map-1f.svg, like B1's Cafe — see
    // defaultAmenityMarker's doc above — so it disappears cleanly on tap
    // instead of the earlier always-visible-landmark compromise).
    amenityMarkers: {
      toilet: { x: 62, y: 357 },
      locker: { x: 137.5, y: 359.5 },
    },
    defaultAmenityMarker: 'locker',
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
    // Toilet is 2F's only enabled chip, at the same relative Corridor-left
    // spot as 1F's Toilet. No defaultAmenityMarker — per feedback, it must
    // stay hidden until the chip is actually tapped, not shown up front.
    amenityMarkers: {
      toilet: { x: 72.5, y: 343 },
    },
    suggestedRoute: {
      label: 'Suggested first visit route',
      subtext: '~1.5 hours · 3 stops across second floor',
      stops: ['gallery-a', 'gallery-c', 'gallery-b'],
      startNumber: 4,
    },
    // Positions read from Figma node 238:1670's "Route marker" instances —
    // map-2f.svg has no baked numbers of its own (unlike 1F), so these are
    // rendered via RouteNumberBadge instead.
    routeMarkers: {
      'gallery-a': { x: 28, y: 61 },
      'gallery-c': { x: 27, y: 226 },
      'gallery-b': { x: 216, y: 61 },
    },
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
