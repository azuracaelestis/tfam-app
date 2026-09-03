'use client'
import { useRef, useState, useLayoutEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, useMotionValue, animate } from 'motion/react'
import type { PanInfo } from 'motion/react'
import { type Activity, getDurationTag, getAgeTag } from '@/lib/activities'
import { useTranslation } from '@/lib/useTranslation'
import { useLanguage } from '@/lib/useLanguage'
import { translateTag } from '@/lib/translateTag'
import ActivityMeta from './ActivityMeta'
import ChevronRightIcon from './icons/ChevronRightIcon'
import { LIFT } from '@/lib/motion'

const CARD_W      = 262
const CARD_GAP    = 8
const CARD_STRIDE = CARD_W + CARD_GAP   // 270 — translateX per card step
const LEFT_INSET  = 20                  // CSS padding-left on the track
const RIGHT_INSET = 20                  // CSS padding-right on the track — mirrors LEFT_INSET

const SNAP_SPRING    = { type: 'spring' as const, visualDuration: 0.3, bounce: 0.1 }
const SWIPE_OFFSET   = CARD_STRIDE * 0.3
const SWIPE_VELOCITY = 400

// Same glyphs as ExhibitionCarousel's slider arrows.
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

export default function ActivityCarousel({ activities }: { activities: Activity[] }) {
  const router = useRouter()
  const t = useTranslation()
  const [lang] = useLanguage()
  const [activeIndex, setActiveIndex] = useState(0)
  // Same reveal-on-drag rule as ExhibitionCarousel's arrows — hidden until
  // the first drag, then stay visible, so this finger-first screen isn't
  // cluttered with tap targets before the visitor has shown any intent to
  // browse further.
  const [hasDragged, setHasDragged] = useState(false)
  const trackX = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerW, setContainerW] = useState(0)

  useLayoutEffect(() => {
    if (containerRef.current) setContainerW(containerRef.current.offsetWidth)
  }, [])

  // Scrolling a flat `index * CARD_STRIDE` overshoots once the track's end is
  // already on screen — the last card would sit left-aligned with a wide gap
  // of dead space beside it. Clamping to the track's real overflow parks the
  // final card against RIGHT_INSET instead, mirroring LEFT_INSET on the first
  // card. Same treatment as ExhibitionCarousel's track.
  const trackContentWidth = LEFT_INSET + activities.length * CARD_W + (activities.length - 1) * CARD_GAP + RIGHT_INSET
  const maxScroll = Math.max(trackContentWidth - containerW, 0)

  const targetFor = (index: number) => -Math.min(index * CARD_STRIDE, maxScroll)

  const snapToCard = (index: number) => {
    animate(trackX, targetFor(index), SNAP_SPRING)
    setActiveIndex(index)
  }

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info
    let target = activeIndex
    if (offset.x < -SWIPE_OFFSET || velocity.x < -SWIPE_VELOCITY) {
      target = Math.min(activeIndex + 1, activities.length - 1)
    } else if (offset.x > SWIPE_OFFSET || velocity.x > SWIPE_VELOCITY) {
      target = Math.max(activeIndex - 1, 0)
    }
    snapToCard(target)
  }

  return (
    <div className="flex flex-col gap-4">
      <div ref={containerRef} className="relative overflow-hidden">
        <motion.div
          className="flex gap-2"
          style={{ x: trackX, paddingLeft: LEFT_INSET, paddingRight: RIGHT_INSET }}
          drag="x"
          dragConstraints={{ left: -maxScroll, right: 0 }}
          dragElastic={0.05}
          dragMomentum={false}
          onDragStart={() => setHasDragged(true)}
          onDragEnd={handleDragEnd}
        >
          {activities.map((a, i) => {
            const displayTitle = lang === 'zh' && a.titleZh ? a.titleZh : a.title
            const description  = lang === 'zh' && a.descriptionZh ? a.descriptionZh : a.description
            const durationTag = getDurationTag(a)
            const ageTag      = getAgeTag(a)
            return (
              <div
                key={a.id}
                onClick={() => router.push(`/activities/${a.id}/book?from=carousel`)}
                className="w-[262px] shrink-0 rounded-card overflow-hidden border border-hairline bg-white cursor-pointer"
              >
                <motion.div layoutId={`chip-carousel-${a.id}`} transition={LIFT} className="relative w-full h-[158px] overflow-hidden">
                  <Image src={a.image} alt={a.title} fill sizes="262px" className="object-cover" priority={i === 0} />
                </motion.div>
                <div className="flex flex-col gap-4 p-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-semibold text-black leading-normal">{displayTitle}</h3>
                    <ActivityMeta
                      duration={durationTag ? translateTag(durationTag, t) : undefined}
                      age={ageTag ? translateTag(ageTag, t) : undefined}
                    />
                  </div>
                  <p className="text-sm font-normal text-black leading-[18px] h-[54px] line-clamp-3">
                    {description}
                  </p>
                  <div className="flex items-center gap-0.5 text-sm font-semibold text-black">
                    {t.activities.bookThis}
                    <ChevronRightIcon size={17} />
                  </div>
                </div>
              </div>
            )
          })}
        </motion.div>

        {/* Tap targets for the same navigation the drag gesture already does
            — hidden until the visitor actually drags once, then stay visible.
            Gated on maxScroll > 0 too: on a wide enough viewport all cards
            already fit on screen, so an arrow that's technically clickable
            but moves nothing would be worse than no arrow at all. */}
        {activities.length > 1 && maxScroll > 0 && (
          <>
            <button
              aria-label={t.activities.prevActivity}
              disabled={activeIndex === 0}
              onClick={() => snapToCard(activeIndex - 1)}
              className={`absolute left-3 top-[79px] -translate-y-1/2 z-10 size-9 rounded-full bg-white/80 shadow-md flex items-center justify-center transition-opacity duration-150 focus-visible:opacity-100 ${
                hasDragged && activeIndex > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <SliderArrowLeftIcon />
            </button>
            <button
              aria-label={t.activities.nextActivity}
              disabled={activeIndex === activities.length - 1}
              onClick={() => snapToCard(activeIndex + 1)}
              className={`absolute right-3 top-[79px] -translate-y-1/2 z-10 size-9 rounded-full bg-white/80 shadow-md flex items-center justify-center transition-opacity duration-150 focus-visible:opacity-100 ${
                hasDragged && activeIndex < activities.length - 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <SliderArrowRightIcon />
            </button>
          </>
        )}
      </div>

      <div className="flex items-center justify-center gap-[7px]">
        {activities.map((_, i) => (
          <span
            key={i}
            className={`block rounded-full transition-all duration-200 ${
              i === activeIndex ? 'w-5 h-[6px] bg-[#9c9c9c]' : 'size-[6px] bg-border-card'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
