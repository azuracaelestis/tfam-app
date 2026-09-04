'use client'
import { useRef, useState, useLayoutEffect } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, animate } from 'motion/react'
import type { PanInfo } from 'motion/react'
import { type Exhibition, metaLine } from '@/lib/exhibitions'
import { useTranslation } from '@/lib/useTranslation'
import ChevronRightIcon from './icons/ChevronRightIcon'
import { LIFT } from '@/lib/motion'

interface ExhibitionCarouselProps {
  exhibitions: Exhibition[]
  onOpen: (id: string) => void
  lang: 'en' | 'zh'
}

const CARD_W      = 262
const CARD_GAP    = 8
const CARD_STRIDE = CARD_W + CARD_GAP   // 270 — translateX per card step
const LEFT_INSET  = 20                  // CSS padding-left on the track
const RIGHT_INSET = 20                  // CSS padding-right on the track — mirrors LEFT_INSET

const SNAP_SPRING    = { type: 'spring' as const, visualDuration: 0.3, bounce: 0.1 }
const SWIPE_OFFSET   = CARD_STRIDE * 0.3   // ~81px drag → advance one card
const SWIPE_VELOCITY = 400                  // px/s fast-flick threshold

// Same glyphs as ExhibitionImageSlider's slider arrows — kept local rather
// than shared since that slider's arrows are hover-gated (a desktop-only
// affordance), while these only reveal on drag (see hasDragged below); the
// two components' reveal rules are different enough that a shared button
// would need its own visibility prop anyway.
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

export default function ExhibitionCarousel({ exhibitions, onOpen, lang }: ExhibitionCarouselProps) {
  const t = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  // Usability testing found visitors never discovered this carousel could be
  // dragged at all, let alone that (once revealed) it also has tap targets —
  // so the arrows stay hidden until the first drag, rather than sitting there
  // permanently as visual clutter on a screen that's otherwise finger-first.
  const [hasDragged, setHasDragged] = useState(false)
  const trackX = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerW, setContainerW] = useState(0)

  useLayoutEffect(() => {
    if (containerRef.current) setContainerW(containerRef.current.offsetWidth)
  }, [])

  const trackContentWidth = LEFT_INSET + exhibitions.length * CARD_W + (exhibitions.length - 1) * CARD_GAP + RIGHT_INSET
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
      target = Math.min(activeIndex + 1, exhibitions.length - 1)
    } else if (offset.x > SWIPE_OFFSET || velocity.x > SWIPE_VELOCITY) {
      target = Math.max(activeIndex - 1, 0)
    }

    snapToCard(target)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Clipping container — `relative` anchors the arrow buttons so they
          stay fixed over the viewport instead of scrolling with the track. */}
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
          {exhibitions.map((ex, i) => {
            const displayTitle = lang === 'zh' && ex.titleZh ? ex.titleZh : ex.title
            return (
              <div
                key={ex.id}
                onClick={() => onOpen(ex.id)}
                className="w-[262px] shrink-0 rounded-card overflow-hidden border border-hairline bg-white cursor-pointer"
              >
                <motion.div layoutId={`hero-carousel-${ex.id}`} transition={LIFT} className="relative w-full h-[158px] overflow-hidden">
                  <Image
                    src={ex.image}
                    alt={ex.title}
                    fill
                    className="object-cover"
                    priority={i === 0}
                  />
                </motion.div>

                <div className="flex flex-col gap-4 p-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[1.25rem] font-semibold text-black leading-normal">{displayTitle}</h3>
                    <p className="text-xs text-ink-secondary leading-normal">{metaLine(ex, lang)}</p>
                  </div>
                  {/* leading and min-h both in rem (not the old leading-[18px]
                      h-[54px] px pairing): at 200% text size the old fixed px
                      line-height stayed put while the font-size doubled,
                      so lines rendered taller than their own box and
                      overlapped. rem units grow together, and line-clamp-3
                      itself already caps the content at 3 lines — min-h
                      only keeps short descriptions the same height as long
                      ones, it never causes clipping. */}
                  <p className="text-sm font-normal text-black leading-[1.125rem] min-h-[3.375rem] line-clamp-3">
                    {lang === 'zh' && ex.descriptionZh ? ex.descriptionZh : ex.description}
                  </p>
                  <button
                    onClick={() => onOpen(ex.id)}
                    className="relative flex items-center gap-0.5 text-sm font-semibold text-black before:content-[''] before:absolute before:-inset-y-3 before:inset-x-0"
                  >
                    {t.whatsOn.explore}
                    <ChevronRightIcon size={17} />
                  </button>
                </div>
              </div>
            )
          })}
        </motion.div>

        {/* Tap targets for the same navigation the drag gesture already does
            — hidden until the visitor actually drags once (see hasDragged),
            then stay visible for the rest of this screen's life. Positioned
            over the fixed-height image row (158px) rather than the full,
            variable-height card. Gated on maxScroll > 0 too, not just card
            count: on a wide enough viewport all cards already fit on screen
            (nothing left to scroll to), and without this an arrow would sit
            there "clickable" but visibly do nothing when tapped. */}
        {exhibitions.length > 1 && maxScroll > 0 && (
          <>
            <button
              aria-label={t.whatsOn.prevExhibition}
              disabled={activeIndex === 0}
              onClick={() => snapToCard(activeIndex - 1)}
              className={`absolute left-3 top-[79px] -translate-y-1/2 z-10 size-9 rounded-full bg-white/80 shadow-md flex items-center justify-center transition-opacity duration-150 focus-visible:opacity-100 ${
                hasDragged && activeIndex > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <SliderArrowLeftIcon />
            </button>
            <button
              aria-label={t.whatsOn.nextExhibition}
              disabled={activeIndex === exhibitions.length - 1}
              onClick={() => snapToCard(activeIndex + 1)}
              className={`absolute right-3 top-[79px] -translate-y-1/2 z-10 size-9 rounded-full bg-white/80 shadow-md flex items-center justify-center transition-opacity duration-150 focus-visible:opacity-100 ${
                hasDragged && activeIndex < exhibitions.length - 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <SliderArrowRightIcon />
            </button>
          </>
        )}
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-[7px]">
        {exhibitions.map((_, i) => (
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
    </div>
  )
}
