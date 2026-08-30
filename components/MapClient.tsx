'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FLOORS, type AmenityType, type Room, type FloorData } from '@/lib/mapData'
import { useExhibitionOverlay } from '@/contexts/ExhibitionOverlayContext'
import { useLanguage, type Language } from '@/lib/useLanguage'
import { useTranslation } from '@/lib/useTranslation'
import { getById } from '@/lib/exhibitions'
import { STATE } from '@/lib/motion'
import BottomNav from './BottomNav'
import GalleryPreviewSheet from './GalleryPreviewSheet'

// ── Floor Switcher ────────────────────────────────────────────────────────────
//
// Sliding pill bound to the active floor via layoutId — same R6 "state change"
// pattern as the Activities filter pills (there's no swipeable track to bind
// to here, the way What's On's tabs bind to trackX, so this is the layoutId
// variant of that same rule, not a copy of the track-bound one).

function FloorSwitcher({
  floors,
  activeId,
  onChange,
}: {
  floors: FloorData[]
  activeId: string
  onChange: (id: string) => void
}) {
  return (
    <div className="bg-white border border-[#ddd] rounded-full h-[46px] p-px flex items-center">
      {floors.map(floor => {
        const isActive = floor.id === activeId
        return (
          <button
            key={floor.id}
            onClick={() => !floor.disabled && onChange(floor.id)}
            disabled={floor.disabled}
            className={[
              'relative flex-1 h-[44px] rounded-full text-sm font-semibold text-center transition-colors duration-150',
              floor.disabled ? 'text-[#ddd] cursor-not-allowed' : isActive ? 'text-white' : 'text-[#0a0a0a]',
            ].filter(Boolean).join(' ')}
          >
            {isActive && (
              <motion.div
                layoutId="map-floor-pill"
                className="absolute inset-0 rounded-full bg-[#0a0a0a]"
                transition={STATE}
              />
            )}
            <span className="relative z-10">{floor.label}</span>
          </button>
        )
      })}
    </div>
  )
}

const AMENITY_ICONS = new Set<AmenityType>(['toilet', 'cafe', 'locker'])
const AMENITY_ICON_SIZE: Partial<Record<AmenityType, number>> = { toilet: 11, cafe: 18, locker: 14 }

// ── Amenity Chips ─────────────────────────────────────────────────────────────

function AmenityChips({
  chips,
  disabledChips,
  active,
  onChange,
}: {
  chips: AmenityType[]
  disabledChips: AmenityType[]
  active: AmenityType | null
  onChange: (chip: AmenityType | null) => void
}) {
  const t = useTranslation()
  if (chips.length === 0) return null
  return (
    <div className="flex gap-3 items-center overflow-x-auto px-5 py-3 scrollbar-hide">
      {chips.map(chip => {
        const isDisabled = disabledChips.includes(chip)
        return (
          <button
            key={chip}
            onClick={() => !isDisabled && onChange(chip === active ? null : chip)}
            disabled={isDisabled}
            className={`shrink-0 flex items-center gap-2 h-[35px] rounded-full border border-[#ddd] px-5 text-sm font-normal transition-colors duration-150 ${
              isDisabled ? 'bg-white text-[#ddd] cursor-not-allowed'
                : chip === active ? 'bg-[#f2f2f2] text-[#4f4f4f]'
                : 'bg-white text-[#4f4f4f]'
            }`}
          >
            {AMENITY_ICONS.has(chip) && (
              <img
                src={`/images/maps/${chip}.svg`}
                width={AMENITY_ICON_SIZE[chip] ?? 14}
                height={AMENITY_ICON_SIZE[chip] ?? 14}
                alt=""
                aria-hidden="true"
                // Icons are opaque black-stroke assets (no currentColor), so
                // disabled state is faked with opacity to match the disabled
                // label's #ddd over this chip's white background.
                className={isDisabled ? 'opacity-[0.13]' : undefined}
              />
            )}
            {t.map.amenities[chip]}
          </button>
        )
      })}
    </div>
  )
}

// ── Route Banner ──────────────────────────────────────────────────────────────

function RouteBanner({
  label,
  subtext,
  onHide,
}: {
  label: string
  subtext: string
  onHide: () => void
}) {
  return (
    <div className="mx-5 bg-info-bg rounded-lg px-[18px] py-[18px] flex items-center gap-3">
      {/* Location pin icon */}
      <svg width="15" height="18" viewBox="0 0 15 18" fill="none" className="shrink-0" aria-hidden="true">
        <path d="M7.5 0C3.36 0 0 3.36 0 7.5C0 13.125 7.5 18 7.5 18C7.5 18 15 13.125 15 7.5C15 3.36 11.64 0 7.5 0ZM7.5 10.5C5.84 10.5 4.5 9.16 4.5 7.5C4.5 5.84 5.84 4.5 7.5 4.5C9.16 4.5 10.5 5.84 10.5 7.5C10.5 9.16 9.16 10.5 7.5 10.5Z" fill="#111111"/>
      </svg>
      <div className="flex-1 flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-black leading-normal">{label}</p>
        <p className="text-sm font-normal text-black leading-normal">{subtext}</p>
      </div>
      <button
        onClick={onHide}
        className="shrink-0 border border-black rounded-2xl px-5 py-1 text-sm text-black bg-white"
      >
        Hide
      </button>
    </div>
  )
}

// ── Floor Plan ────────────────────────────────────────────────────────────────
//
// The floor illustration (room layout, labels, icons, the Offline badge) is a
// single exported SVG per floor (see lib/mapData.ts `mapImage`), not built
// from room data. Room data still drives things laid on top of it: invisible
// tap hotspots for galleries (positioned via each room's `rect`, in the
// image's own coordinate space, converted to percentages so they track the
// image at any render size), the amenity-highlight ring, and the
// suggested-route step numbers (via routeMarkers/RouteNumberBadge, on every
// floor now — see that component's doc — so Hide can dismiss them cleanly).

function RoomHotspot({
  room,
  imageWidth,
  imageHeight,
  lang,
  onTap,
}: {
  room: Room
  imageWidth: number
  imageHeight: number
  lang: Language
  onTap?: () => void
}) {
  if (!room.rect || !onTap) return null
  const [x, y, w, h] = room.rect
  const style: React.CSSProperties = {
    left: `${(x / imageWidth) * 100}%`,
    top: `${(y / imageHeight) * 100}%`,
    width: `${(w / imageWidth) * 100}%`,
    height: `${(h / imageHeight) * 100}%`,
  }

  return (
    <button
      className="absolute active:bg-black/5 transition-colors duration-75"
      style={style}
      onClick={onTap}
      aria-label={lang === 'zh' && room.nameZh ? room.nameZh : room.name}
    />
  )
}

// Circular icon badge marking where the active amenity chip's facility sits
// on the map — mutually exclusive per floor.amenityMarkers, replaces the old
// red-ring room highlight (see lib/mapData.ts amenityMarkers doc). Sized and
// positioned to match the badge already baked into 1F's map art (r=16 circle
// = 32px, ~14px-tall glyph — read directly from map-1f.svg's source, not
// eyeballed from a screenshot). Each icon keeps its own native aspect ratio
// at that ~14px height rather than being forced into a square, which was
// making Toilet (11:15 native) render visibly bulkier than Locker (14:16).
// B1's map art has no baked Cafe glyph of its own (removed from map-b1.svg)
// — this badge is the only thing rendering it, in every state, via
// `defaultAmenityMarker`.
const AMENITY_BADGE_SIZE = 32
const AMENITY_BADGE_ICON_DIMS: Record<AmenityType, { width: number; height: number }> = {
  toilet: { width: 10, height: 14 },
  cafe: { width: 16, height: 14 },
  locker: { width: 12, height: 14 },
  'changing-room': { width: 14, height: 14 },
}

function AmenityBadge({
  amenity,
  position,
  imageWidth,
  imageHeight,
}: {
  amenity: AmenityType
  position: { x: number; y: number }
  imageWidth: number
  imageHeight: number
}) {
  const style: React.CSSProperties = {
    left: `${(position.x / imageWidth) * 100}%`,
    top: `${(position.y / imageHeight) * 100}%`,
    width: AMENITY_BADGE_SIZE,
    height: AMENITY_BADGE_SIZE,
    transform: 'translate(-50%, -50%)',
  }
  const iconDims = AMENITY_BADGE_ICON_DIMS[amenity]
  return (
    <div
      className="absolute z-10 flex items-center justify-center rounded-full bg-[#f2f2f2] border border-[#ddd] pointer-events-none"
      style={style}
      aria-hidden="true"
    >
      <img src={`/images/maps/${amenity}.svg`} width={iconDims.width} height={iconDims.height} alt="" />
    </div>
  )
}

// Numbered suggested-route stop marker (black circle, bold white number).
// Every floor with a suggestedRoute drives these from floor.routeMarkers —
// 1F's were originally baked directly into map-1f.svg (flattened vector
// text from the original export), but that meant Hide couldn't dismiss
// them, so they were removed from the source art in favor of this marker,
// same as 2F.
//
// Faster and separate from STATE: the pins are secondary to the route
// banner, not the primary thing being dismissed — they should read as
// "also going," not compete with the banner's own 220ms collapse.
const BADGE_FADE = { duration: 0.14, ease: 'linear' } as const

function RouteNumberBadge({
  number,
  position,
  imageWidth,
  imageHeight,
}: {
  number: number
  position: { x: number; y: number }
  imageWidth: number
  imageHeight: number
}) {
  const style: React.CSSProperties = {
    left: `${(position.x / imageWidth) * 100}%`,
    top: `${(position.y / imageHeight) * 100}%`,
    width: 30,
    height: 32,
    transform: 'translate(-50%, -50%)',
  }
  return (
    <div
      className="absolute z-10 flex items-center justify-center rounded-full bg-[#0a0a0a] pointer-events-none"
      style={style}
      aria-hidden="true"
    >
      <span className="text-[16px] font-bold text-white">{number}</span>
    </div>
  )
}

function FloorPlan({
  floor,
  activeAmenity,
  showRoute,
  lang,
  onRoomTap,
}: {
  floor: FloorData
  activeAmenity: AmenityType | null
  showRoute: boolean
  lang: Language
  onRoomTap: (exhibitionId: string) => void
}) {
  if (floor.disabled || !floor.mapImage) {
    return (
      <div className="relative mx-5 rounded-2xl border border-[#ddd] overflow-hidden bg-[#f8f8f8] p-5 flex items-center justify-center h-[240px]">
        <p className="text-sm text-tfam-mid">Content coming soon</p>
      </div>
    )
  }

  const { src, width, height } = floor.mapImage

  return (
    <div className="relative mx-5" style={{ aspectRatio: `${width} / ${height}` }}>
      <img src={src} alt={`${floor.label} floor plan`} className="absolute inset-0 w-full h-full" />

      {floor.rooms.map(room => (
        <RoomHotspot
          key={room.id}
          room={room}
          imageWidth={width}
          imageHeight={height}
          lang={lang}
          onTap={room.exhibitionId ? () => onRoomTap(room.exhibitionId!) : undefined}
        />
      ))}

      <AnimatePresence>
        {showRoute && floor.suggestedRoute?.stops.map((roomId, i) => {
          const position = floor.routeMarkers?.[roomId]
          const number = (floor.suggestedRoute!.startNumber ?? 1) + i
          return position ? (
            <motion.div
              key={roomId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={BADGE_FADE}
            >
              <RouteNumberBadge number={number} position={position} imageWidth={width} imageHeight={height} />
            </motion.div>
          ) : null
        })}
      </AnimatePresence>

      {/* When no chip is tapped, a floor may still show one amenity marker
          by default (B1's Cafe) — see FloorData.defaultAmenityMarker. */}
      {(() => {
        const shownAmenity = activeAmenity ?? floor.defaultAmenityMarker ?? null
        const position = shownAmenity ? floor.amenityMarkers?.[shownAmenity] : undefined
        return shownAmenity && position ? (
          <AmenityBadge amenity={shownAmenity} position={position} imageWidth={width} imageHeight={height} />
        ) : null
      })()}

      {/* "You are here" green dot — pulsing flare */}
      <div
        className="absolute z-10 flex items-center justify-center"
        style={{ bottom: '6%', right: '7.5%' }}
        aria-label="You are here"
      >
        <span className="absolute inline-flex size-5 rounded-full bg-[#1abd6e] opacity-75 animate-ping" />
        <span className="relative inline-flex size-3 rounded-full bg-[#1abd6e] ring-2 ring-white" />
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function MapClient() {
  const { open } = useExhibitionOverlay()
  const [lang] = useLanguage()
  const [activeFloorId, setActiveFloorId] = useState<string>('1F')
  const [activeAmenity, setActiveAmenity] = useState<AmenityType | null>(null)
  const [showRoute, setShowRoute] = useState(true)
  const [previewId, setPreviewId] = useState<string | null>(null)

  const floor = FLOORS.find(f => f.id === activeFloorId) ?? FLOORS[1]
  const previewExhibition = previewId ? getById(previewId) ?? null : null

  const handleFloorChange = (id: string) => {
    setActiveFloorId(id)
    setActiveAmenity(null)
    setShowRoute(true)
  }

  // Tapping a gallery opens a quick-peek sheet (slides up like the audio
  // guide's AudioInputSheet) rather than jumping straight to the full
  // ExhibitionOverlay — "More Info" inside it opens that instead.
  const handleRoomTap = (exhibitionId: string) => {
    setPreviewId(exhibitionId)
  }

  const handleMoreInfo = () => {
    if (previewId) open(previewId, 'map')
    setPreviewId(null)
  }

  const showRouteBanner = !!floor.suggestedRoute && showRoute

  const captionText =
    activeFloorId === 'B1'
      ? 'You are here | Tap a chip above to highlight facilities'
      : showRouteBanner
      ? null
      : 'You are here | Tap any gallery to see exhibition'

  return (
    <div className="min-h-screen bg-white flex flex-col font-noto pb-[69px]">
      {/* Header */}
      <header className="bg-white px-5 py-[10px] flex items-end">
        <h1 className="text-[32px] font-semibold text-[#0a0a0a] leading-normal">Map</h1>
      </header>

      {/* Floor switcher */}
      <div className="px-5 py-[10px]">
        <FloorSwitcher
          floors={FLOORS}
          activeId={activeFloorId}
          onChange={handleFloorChange}
        />
      </div>

      {/* Amenity chips */}
      <AmenityChips
        chips={floor.amenityChips}
        disabledChips={floor.disabledAmenityChips ?? []}
        active={activeAmenity}
        onChange={setActiveAmenity}
      />

      {/* Route banner (any floor with a suggestedRoute) */}
      <AnimatePresence initial={false}>
        {showRouteBanner && floor.suggestedRoute && (
          <motion.div
            key="route-banner"
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: 20 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            transition={STATE}
            style={{ overflow: 'hidden' }}
          >
            <RouteBanner
              label={floor.suggestedRoute.label}
              subtext={floor.suggestedRoute.subtext}
              onHide={() => setShowRoute(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floor plan */}
      <FloorPlan
        floor={floor}
        activeAmenity={activeAmenity}
        showRoute={showRoute}
        lang={lang}
        onRoomTap={handleRoomTap}
      />

      {/* Caption */}
      {!floor.disabled && captionText && (
        <div className="flex items-center gap-3 mt-3 px-5">
          <span className="relative shrink-0 size-[23px]" aria-hidden="true">
            <span className="absolute inset-0 rounded-full bg-[#1abd6e]/30" />
            <span className="absolute inset-0 m-auto size-[7px] rounded-full bg-[#1abd6e]" />
          </span>
          <p className="text-sm text-[#0a0a0a]">{captionText}</p>
        </div>
      )}

      <BottomNav />

      <GalleryPreviewSheet
        exhibition={previewExhibition}
        open={previewId !== null}
        onClose={() => setPreviewId(null)}
        onMoreInfo={handleMoreInfo}
      />
    </div>
  )
}
