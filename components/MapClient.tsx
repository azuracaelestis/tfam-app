'use client'
import { useState } from 'react'
import { motion } from 'motion/react'
import { FLOORS, AMENITY_LABELS, type AmenityType, type Room, type FloorData } from '@/lib/mapData'
import { useExhibitionOverlay } from '@/contexts/ExhibitionOverlayContext'
import { STATE } from '@/lib/motion'
import BottomNav from './BottomNav'

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
              />
            )}
            {AMENITY_LABELS[chip]}
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
// The floor illustration (room layout, labels, icons, the Offline badge, and —
// for 1F — the suggested-route step numbers) is now a single exported SVG per
// floor (see lib/mapData.ts `mapImage`), not built from room data. Room data
// still drives two things laid on top of it: invisible tap hotspots for
// galleries (positioned via each room's `rect`, in the image's own coordinate
// space, converted to percentages so they track the image at any render size)
// and the amenity-highlight ring. Hiding the suggested route still dismisses
// the banner text but can no longer erase the baked-in step numbers from the
// image — a deliberate, minor trade-off of moving to a static illustration.

function RoomHotspot({
  room,
  imageWidth,
  imageHeight,
  onTap,
}: {
  room: Room
  imageWidth: number
  imageHeight: number
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
      aria-label={room.name}
    />
  )
}

// Circular icon badge marking where an active amenity chip's facility sits on
// the map — mutually exclusive per floor.amenityMarkers, replaces the old
// red-ring room highlight (see lib/mapData.ts amenityMarkers doc).
function AmenityMarker({
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
    transform: 'translate(-50%, -50%)',
  }
  // Cafe's badge matches the size of the baked-in glyph it replaces;
  // toilet/locker are scaled down 10% off that reference per feedback.
  const badgeSize = amenity === 'cafe' ? 40 : 36
  const iconSize = amenity === 'cafe' ? 22 : 20
  return (
    <div
      className="absolute z-10 flex items-center justify-center rounded-full bg-[#f2f2f2] border border-[#ddd] pointer-events-none"
      style={{ ...style, width: badgeSize, height: badgeSize }}
      aria-hidden="true"
    >
      <img src={`/images/maps/${amenity}.svg`} width={iconSize} height={iconSize} alt="" />
    </div>
  )
}

// Covers a baked-in amenity icon (e.g. B1's always-visible Cafe glyph) with a
// plain white patch while a different amenity chip is active — the icon
// isn't a DOM node we can toggle since it's drawn into the SVG artwork.
function BakedIconMask({
  rect,
  imageWidth,
  imageHeight,
}: {
  rect: [number, number, number, number]
  imageWidth: number
  imageHeight: number
}) {
  const [x, y, w, h] = rect
  const style: React.CSSProperties = {
    left: `${(x / imageWidth) * 100}%`,
    top: `${(y / imageHeight) * 100}%`,
    width: `${(w / imageWidth) * 100}%`,
    height: `${(h / imageHeight) * 100}%`,
  }
  return <div className="absolute bg-white rounded-full pointer-events-none" style={style} aria-hidden="true" />
}

function FloorPlan({
  floor,
  activeAmenity,
  onRoomTap,
}: {
  floor: FloorData
  activeAmenity: AmenityType | null
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
          onTap={room.exhibitionId ? () => onRoomTap(room.exhibitionId!) : undefined}
        />
      ))}

      {/* The baked-in Cafe glyph renders at its own fixed (smaller) size, so
          it's always masked and replaced by our own 33x33 marker below —
          keeps every amenity badge visually consistent. */}
      {floor.bakedAmenityIcon && (
        <BakedIconMask rect={floor.bakedAmenityIcon.rect} imageWidth={width} imageHeight={height} />
      )}

      {(() => {
        const shownAmenity = activeAmenity ?? floor.bakedAmenityIcon?.amenity ?? null
        const position = shownAmenity ? floor.amenityMarkers?.[shownAmenity] : undefined
        return shownAmenity && position ? (
          <AmenityMarker amenity={shownAmenity} position={position} imageWidth={width} imageHeight={height} />
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
  const [activeFloorId, setActiveFloorId] = useState<string>('1F')
  const [activeAmenity, setActiveAmenity] = useState<AmenityType | null>(null)
  const [showRoute, setShowRoute] = useState(true)

  const floor = FLOORS.find(f => f.id === activeFloorId) ?? FLOORS[1]

  const handleFloorChange = (id: string) => {
    setActiveFloorId(id)
    setActiveAmenity(null)
    setShowRoute(true)
  }

  const handleRoomTap = (exhibitionId: string) => {
    open(exhibitionId, 'map')
  }

  const showRouteBanner = activeFloorId === '1F' && !!floor.suggestedRoute && showRoute

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

      {/* Route banner (1F only) */}
      {showRouteBanner && floor.suggestedRoute && (
        <div className="mb-5">
          <RouteBanner
            label={floor.suggestedRoute.label}
            subtext={floor.suggestedRoute.subtext}
            onHide={() => setShowRoute(false)}
          />
        </div>
      )}

      {/* Floor plan */}
      <FloorPlan
        floor={floor}
        activeAmenity={activeAmenity}
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
    </div>
  )
}
