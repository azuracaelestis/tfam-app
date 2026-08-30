'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FLOORS, type AmenityType, type Room, type FloorData } from '@/lib/mapData'
import { getById } from '@/lib/exhibitions'
import { useTranslation } from '@/lib/useTranslation'
import { useLanguage } from '@/lib/useLanguage'
import BottomNav from './BottomNav'

// ── Floor Switcher ────────────────────────────────────────────────────────────

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
    <div className="mx-4 flex border border-[#d9d9d9] rounded-2xl overflow-hidden">
      {floors.map((floor, i) => {
        const isFirst = i === 0
        const isLast = i === floors.length - 1
        const isActive = floor.id === activeId
        return (
          <button
            key={floor.id}
            onClick={() => !floor.disabled && onChange(floor.id)}
            disabled={floor.disabled}
            className={[
              'flex-1 py-[18px] text-base font-semibold text-center transition-colors duration-150 border-[#d9d9d9]',
              !isFirst ? 'border-l' : '',
              isActive ? 'bg-tfam-dark text-white' : '',
              floor.disabled ? 'text-[#cbcbcb] cursor-not-allowed' : !isActive ? 'bg-white text-black' : '',
              isFirst ? 'rounded-bl-2xl rounded-tl-2xl' : '',
              isLast ? 'rounded-br-2xl rounded-tr-2xl' : '',
            ].filter(Boolean).join(' ')}
          >
            {floor.label}
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
  active,
  onChange,
}: {
  chips: AmenityType[]
  active: AmenityType | null
  onChange: (chip: AmenityType | null) => void
}) {
  const t = useTranslation()
  if (chips.length === 0) return null
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
      {chips.map(chip => (
        <button
          key={chip}
          onClick={() => onChange(chip === active ? null : chip)}
          className={`flex-shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
            chip === active
              ? 'bg-tfam-dark text-white border-tfam-dark'
              : 'bg-white text-black border-[#d9d9d9]'
          }`}
        >
          {AMENITY_ICONS.has(chip) && (
            <img
              src={`/images/maps/${chip}.svg`}
              width={AMENITY_ICON_SIZE[chip] ?? 14}
              height={AMENITY_ICON_SIZE[chip] ?? 14}
              alt=""
              aria-hidden="true"
              className={chip === active ? 'invert' : ''}
            />
          )}
          {t.map.amenities[chip]}
        </button>
      ))}
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
  const t = useTranslation()
  return (
    <div className="mx-4 bg-info-bg rounded-lg px-[18px] py-[18px] flex items-center gap-3">
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
        {t.map.hide}
      </button>
    </div>
  )
}

// ── Room Card ─────────────────────────────────────────────────────────────────

function RoomCard({
  room,
  activeAmenity,
  routeIndex,
  onTap,
}: {
  room: Room
  activeAmenity: AmenityType | null
  routeIndex: number
  onTap?: () => void
}) {
  const isAmenityActive = activeAmenity !== null && room.amenity === activeAmenity
  const t = useTranslation()
  const [lang] = useLanguage()
  const isTappable = Boolean(room.exhibitionId) && Boolean(onTap)
  const isCorridorLike = room.type === 'corridor' || room.type === 'lobby'
  const isStaircase = room.type === 'staircase'
  const isLanding   = room.type === 'landing'

  const baseClass = [
    'relative flex flex-col items-center justify-center text-center p-2 border border-[#d9d9d9] rounded-2xl',
    'bg-white',
    isAmenityActive ? 'ring-2 ring-inset ring-tfam-red' : '',
    isTappable ? 'active:bg-[#f0f0f0] cursor-pointer' : 'cursor-default',
  ].filter(Boolean).join(' ')

  const style: React.CSSProperties = {
    gridColumn: `${room.col} / span ${room.colSpan}`,
    gridRow: `${room.row} / span ${room.rowSpan}`,
  }

  if (isLanding) {
    return <div className={baseClass} style={style} />
  }

  if (isStaircase) {
    return (
      <div className={baseClass + ' overflow-hidden'} style={style}>
        {/* Staircase hatching — horizontal lines */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
          <defs>
            <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8">
              <line x1="0" y1="8" x2="8" y2="0" stroke="#d9d9d9" strokeWidth="1.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hatch)"/>
        </svg>
      </div>
    )
  }

  // For galleries with an exhibition, show name + exhibition title
  const exhibition = room.exhibitionId ? getById(room.exhibitionId) : undefined
  const exhibitionName = exhibition
    ? (lang === 'zh' && exhibition.titleZh ? exhibition.titleZh : exhibition.title)
    : null
  const roomLabel = t.map.roomNames[room.id as keyof typeof t.map.roomNames] ?? room.name

  const content = (
    <>
      {routeIndex >= 0 && (
        <span className="absolute -top-4 -left-4 size-8 rounded-full bg-[#110d0d] text-white text-base font-bold flex items-center justify-center z-20">
          {routeIndex + 1}
        </span>
      )}
      <div className="flex flex-col items-center gap-2">
        {room.amenity === 'cafe' && (
          <img src="/images/maps/cafe.svg" width={32} height={32} alt="" aria-hidden="true" />
        )}
        <span className="text-sm font-semibold leading-tight text-black">{roomLabel}</span>
        {exhibitionName && (
          <span className="text-sm font-normal text-black leading-snug">{exhibitionName}</span>
        )}
      </div>
      {room.amenityIcon && (
        <span className="absolute bottom-2 right-2 size-7 rounded-full bg-[#f0f0f0] flex items-center justify-center">
          <img src={`/images/maps/${room.amenityIcon}.svg`} width={16} height={16} alt="" aria-hidden="true" />
        </span>
      )}
    </>
  )

  if (isTappable) {
    return (
      <button className={baseClass} style={style} onClick={onTap}>
        {content}
      </button>
    )
  }

  return (
    <div className={baseClass} style={style}>
      {content}
    </div>
  )
}


// ── Floor Plan ────────────────────────────────────────────────────────────────

function FloorPlan({
  floor,
  activeAmenity,
  showRoute,
  onRoomTap,
}: {
  floor: FloorData
  activeAmenity: AmenityType | null
  showRoute: boolean
  onRoomTap: (exhibitionId: string) => void
}) {
  const t = useTranslation()
  const stops = showRoute ? (floor.suggestedRoute?.stops ?? []) : []

  return (
    <div className="relative mx-4 rounded-2xl border border-[#d9d9d9] overflow-hidden bg-[#f8f8f8] p-5">
      {/* Offline badge — sits above the grid, right-aligned */}
      <div className="flex justify-end mb-3">
        <span className="bg-[#d2d0d0] text-black text-xs font-normal px-2.5 py-1 rounded-full leading-none">
          {t.map.offline}
        </span>
      </div>

      {floor.disabled || floor.rooms.length === 0 ? (
        <div className="flex items-center justify-center h-[240px]">
          <p className="text-sm text-tfam-mid">{t.map.contentComingSoon}</p>
        </div>
      ) : (
        <div
          className="relative"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${floor.gridCols}, 1fr)`,
            gridTemplateRows: `repeat(${floor.gridRows}, minmax(80px, auto))`,
            gap: '14px',
          }}
        >
          {floor.rooms.map(room => {
            const routeIndex = stops.indexOf(room.id)
            return (
              <RoomCard
                key={room.id}
                room={room}
                activeAmenity={activeAmenity}
                routeIndex={routeIndex}
                onTap={room.exhibitionId ? () => onRoomTap(room.exhibitionId!) : undefined}
              />
            )
          })}

          {/* "You are here" green dot — pulsing flare */}
          <div
            className="absolute z-10 flex items-center justify-center"
            style={{ bottom: '28px', right: '28px' }}
            aria-label={t.map.youAreHere}
          >
            <span className="absolute inline-flex size-5 rounded-full bg-[#3dba6a] opacity-75 animate-ping" />
            <span className="relative inline-flex size-3 rounded-full bg-[#3dba6a] ring-2 ring-white" />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function MapClient() {
  const router = useRouter()
  const t = useTranslation()
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
    router.push('/whats-on/' + exhibitionId + '?from=map')
  }

  const showRouteBanner = activeFloorId === '1F' && !!floor.suggestedRoute && showRoute

  const captionText =
    activeFloorId === 'B1'
      ? t.map.youAreHereB1
      : showRouteBanner
      ? null
      : t.map.youAreHereGeneric

  return (
    <div className="min-h-screen bg-white flex flex-col font-noto pb-[69px]">
      {/* Header */}
      <header className="px-5 pt-14 pb-3">
        <h1 className="text-[20px] font-bold text-black">{t.map.title}</h1>
      </header>

      {/* Floor switcher */}
      <div className="mb-3 px-0">
        <FloorSwitcher
          floors={FLOORS}
          activeId={activeFloorId}
          onChange={handleFloorChange}
        />
      </div>

      {/* Amenity chips */}
      <AmenityChips
        chips={floor.amenityChips}
        active={activeAmenity}
        onChange={setActiveAmenity}
      />

      {/* Route banner (1F only) */}
      {showRouteBanner && floor.suggestedRoute && (
        <div className="mb-3">
          <RouteBanner
            label={t.map.route.label}
            subtext={t.map.route.subtext}
            onHide={() => setShowRoute(false)}
          />
        </div>
      )}

      {/* Floor plan */}
      <FloorPlan
        floor={floor}
        activeAmenity={activeAmenity}
        showRoute={showRoute}
        onRoomTap={handleRoomTap}
      />

      {/* Caption */}
      {!floor.disabled && captionText && (
        <p className="text-center text-xs text-tfam-mid mt-3 px-4">
          {captionText}
        </p>
      )}

      <BottomNav />
    </div>
  )
}
