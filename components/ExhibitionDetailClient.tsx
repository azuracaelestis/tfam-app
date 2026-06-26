'use client'
import { useRef, useState, useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, useMotionValue, animate } from 'motion/react'
import type { PanInfo } from 'motion/react'
import AudioInputSheet from './AudioInputSheet'
import { type Exhibition, fmtLong } from '@/lib/exhibitions'

const SNAP_SPRING    = { type: 'spring' as const, visualDuration: 0.3, bounce: 0.1 }
const SWIPE_VELOCITY = 400

// ── Icons ─────────────────────────────────────────────────────────────────────

function ChevronLeftIcon() {
  return (
    <svg width="7" height="13" viewBox="0 0 7 13" fill="none" aria-hidden="true">
      <path d="M6 1L1 6.5L6 12" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRightSmallIcon() {
  return (
    <svg width="5" height="9" viewBox="0 0 5 9" fill="none" aria-hidden="true">
      <path d="M1 1l3 3.5L1 8" stroke="black" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SliderArrowLeftIcon() {
  return (
    <svg width="8" height="13" viewBox="0 0 8 13" fill="none" aria-hidden="true">
      <path d="M7 1L1.5 6.5L7 12" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SliderArrowRightIcon() {
  return (
    <svg width="8" height="13" viewBox="0 0 8 13" fill="none" aria-hidden="true">
      <path d="M1 1L6.5 6.5L1 12" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="3" width="14" height="11" rx="1.5" stroke="#666666" strokeWidth="1.4" />
      <path d="M1 7h14" stroke="#666666" strokeWidth="1.4" />
      <path d="M5 1v4M11 1v4" stroke="#666666" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg width="18" height="17" viewBox="0 0 14 17" fill="none" aria-hidden="true">
      <path d="M7 1C4.24 1 2 3.24 2 6c0 3.75 5 10 5 10s5-6.25 5-10C12 3.24 9.76 1 7 1z" stroke="#666666" strokeWidth="1.4" />
      <circle cx="7" cy="6" r="2" stroke="#666666" strokeWidth="1.4" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="#666666" strokeWidth="1.4" />
      <path d="M8 4.5V8l2.5 2" stroke="#666666" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HeadphoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1 11V7C1 5.4087 1.63214 3.88258 2.75736 2.75736C3.88258 1.63214 5.4087 1 7 1C8.5913 1 10.1174 1.63214 11.2426 2.75736C12.3679 3.88258 13 5.4087 13 7V11" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 11.6666C13 12.0203 12.8595 12.3594 12.6095 12.6095C12.3594 12.8595 12.0203 13 11.6667 13H11C10.6464 13 10.3072 12.8595 10.0572 12.6095C9.80714 12.3594 9.66667 12.0203 9.66667 11.6666V9.66665C9.66667 9.31302 9.80714 8.97389 10.0572 8.72384C10.3072 8.47379 10.6464 8.33331 11 8.33331H13V11.6666ZM1 11.6666C1 12.0203 1.14048 12.3594 1.39052 12.6095C1.64057 12.8595 1.97971 13 2.33333 13H3C3.35362 13 3.69276 12.8595 3.94281 12.6095C4.19286 12.3594 4.33333 12.0203 4.33333 11.6666V9.66665C4.33333 9.31302 4.19286 8.97389 3.94281 8.72384C3.69276 8.47379 3.35362 8.33331 3 8.33331H1V11.6666Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Info row ──────────────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  action,
}: {
  icon: React.ReactNode
  label: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 flex items-center">{icon}</span>
      <span className="text-[15px] text-black flex-1">{label}</span>
      {action}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ExhibitionDetailClient({ ex, fromCard }: { ex: Exhibition; fromCard: boolean }) {
  const router = useRouter()

  // Slider
  const [activeIndex, setActiveIndex] = useState(0)
  const trackX    = useMotionValue(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [sliderW, setSliderW] = useState(0)
  const [sliderHovered, setSliderHovered] = useState(false)

  // Audio sheet
  const [sheetOpen, setSheetOpen] = useState(false)
  const [code, setCode] = useState('')

  useLayoutEffect(() => {
    if (sliderRef.current) setSliderW(sliderRef.current.offsetWidth)
  }, [])

  const snapTo = (index: number) => {
    const w = sliderRef.current?.offsetWidth ?? sliderW
    animate(trackX, -index * w, SNAP_SPRING)
    setActiveIndex(index)
  }

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const w = sliderRef.current?.offsetWidth ?? sliderW
    const { offset, velocity } = info
    let target = activeIndex
    if (offset.x < -w * 0.3 || velocity.x < -SWIPE_VELOCITY) {
      target = Math.min(activeIndex + 1, ex.images.length - 1)
    } else if (offset.x > w * 0.3 || velocity.x > SWIPE_VELOCITY) {
      target = Math.max(activeIndex - 1, 0)
    }
    snapTo(target)
  }

  // Audio sheet handlers — identical wiring to HomeClient
  const handleDigit  = (d: string) => setCode(prev => prev.length < 4 ? prev + d : prev)
  const handleDelete = () => setCode(prev => prev.slice(0, -1))
  const handleClose  = () => { setSheetOpen(false); setCode('') }
  const handlePlay   = () => router.push('/play?code=' + code)
  const handleQR     = () => router.push('/play?code=1001')

  const locationLabel = ex.gallery ? `${ex.floor} | ${ex.gallery}` : ex.floor

  return (
    <div className="min-h-screen bg-white flex flex-col font-noto pb-[69px]">

      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-white h-[60px] px-5 flex items-end pb-[10px] shrink-0">
        <button
          onClick={() => router.push('/whats-on')}
          className="flex items-center gap-3"
          aria-label="Back to What's On"
        >
          <ChevronLeftIcon />
          <span className="text-[20px] font-bold text-black leading-none">What&rsquo;s On</span>
        </button>
      </header>

      {/* ── Content — zoom-in only when arriving from a card tap ── */}
      <motion.div
        initial={fromCard ? { opacity: 0, scale: 0.90 } : false}
        animate={fromCard ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex flex-col flex-1"
      >

      {/* ── Image section: slider + arrows + dots grouped together ── */}
      <div className="shrink-0">
        {/* Hover-sensitive wrapper — arrows overlay this area only */}
        <div
          className="relative w-full h-[282px]"
          onMouseEnter={() => setSliderHovered(true)}
          onMouseLeave={() => setSliderHovered(false)}
        >
          <div ref={sliderRef} className="overflow-hidden w-full h-full bg-tfam-light">
            <motion.div
              className="flex h-full"
              style={{ x: trackX }}
              drag={ex.images.length > 1 ? 'x' : false}
              dragConstraints={{ left: -(ex.images.length - 1) * sliderW, right: 0 }}
              dragElastic={0.05}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
            >
              {ex.images.map((src, i) => (
                <div
                  key={i}
                  className="relative shrink-0 h-full"
                  style={{ width: sliderW || '100%' }}
                >
                  <Image
                    src={src}
                    alt={ex.title}
                    fill
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Prev / next arrows — only when multiple images */}
          {ex.images.length > 1 && (
            <>
              <button
                aria-label="Previous image"
                disabled={activeIndex === 0}
                onClick={() => snapTo(activeIndex - 1)}
                className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 size-9 rounded-full bg-white/80 shadow-md flex items-center justify-center transition-opacity duration-150 focus-visible:opacity-100 ${
                  sliderHovered && activeIndex > 0
                    ? 'opacity-100'
                    : 'opacity-0 pointer-events-none'
                }`}
              >
                <SliderArrowLeftIcon />
              </button>
              <button
                aria-label="Next image"
                disabled={activeIndex === ex.images.length - 1}
                onClick={() => snapTo(activeIndex + 1)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 z-10 size-9 rounded-full bg-white/80 shadow-md flex items-center justify-center transition-opacity duration-150 focus-visible:opacity-100 ${
                  sliderHovered && activeIndex < ex.images.length - 1
                    ? 'opacity-100'
                    : 'opacity-0 pointer-events-none'
                }`}
              >
                <SliderArrowRightIcon />
              </button>
            </>
          )}
        </div>

        {/* Pagination dots — shown only when multiple images */}
        {ex.images.length > 1 && (
          <div className="flex items-center justify-center gap-[7px] pt-[18px]">
            {ex.images.map((_, i) => (
              <span
                key={i}
                className={`block rounded-full transition-all duration-200 ${
                  i === activeIndex
                    ? 'w-5 h-[6px] bg-[#9c9c9c]'
                    : 'size-[6px] bg-border-card'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      {/* Outer: gap-[42px] separates Exhibition Details from Navigation Buttons */}
      <div className="px-[18px] pt-[28px] pb-6 flex flex-col gap-[42px]">

        {/* Exhibition Details: gap-[16px] (gap-4) between Event Header and description */}
        <div className="flex flex-col gap-4">

          {/* Event Header: gap-[24px] (gap-6) between title+tag and info rows */}
          <div className="flex flex-col gap-6">

            {/* Title + category tag */}
            <div className="flex flex-col gap-2">
              <h1 className="text-[24px] font-semibold text-black leading-tight">{ex.title}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                {ex.categories.map(cat => (
                  <div key={cat} className="flex items-center gap-2 bg-[#f2f2f2] rounded-[8px] px-2 py-1">
                    <img src="/tag.svg" width={8} height={8} alt="" aria-hidden="true" className="shrink-0" />
                    <span className="text-[12px] text-black whitespace-nowrap">{cat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info rows: gap-[4px] (gap-1) between each row */}
            <div className="flex flex-col gap-1">
              {ex.endDate && (
                <InfoRow
                  icon={<CalendarIcon />}
                  label={`Until ${fmtLong(ex.endDate)}`}
                />
              )}
              <InfoRow
                icon={<MapPinIcon />}
                label={locationLabel}
                action={
                  <button className="flex items-center gap-2 shrink-0">
                    <span className="text-[15px] font-normal text-black underline leading-none whitespace-nowrap">
                      Show on map
                    </span>
                    <ChevronRightSmallIcon />
                  </button>
                }
              />
              <InfoRow
                icon={<ClockIcon />}
                label={`~${ex.duration} mins to explore`}
              />
            </div>
          </div>

          {/* Full description */}
          <p className="text-[15px] text-black leading-snug">{ex.fullDescription}</p>
        </div>

        {/* Navigation buttons — side by side, 178px each */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSheetOpen(true)}
            className="h-[48px] w-[178px] rounded-pill border border-black text-black text-[16px] font-bold flex items-center justify-center gap-2 active:bg-[#f5f5f5] transition-colors duration-75"
          >
            <HeadphoneIcon />
            Audio Guide
          </button>
          <button
            onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Taipei+Fine+Arts+Museum', '_blank')}
            className="h-[48px] w-[178px] rounded-pill bg-black text-white text-[16px] font-bold flex items-center justify-center gap-2 active:bg-[#494848] transition-colors duration-75"
          >
            <img src="/getting-there.svg" width={16} height={16} alt="" aria-hidden="true" />
            Getting Here
          </button>
        </div>

      </div>

      </motion.div>

      {/* ── Audio sheet — identical wiring to HomeClient ── */}
      <AudioInputSheet
        open={sheetOpen}
        code={code}
        onDigit={handleDigit}
        onDelete={handleDelete}
        onClose={handleClose}
        onPlay={handlePlay}
        onQR={handleQR}
      />

    </div>
  )
}
