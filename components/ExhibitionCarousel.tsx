'use client'
import { useRef, useState, useLayoutEffect } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, animate } from 'motion/react'
import type { PanInfo } from 'motion/react'
import { type Exhibition, metaLine } from '@/lib/exhibitions'
import { useTranslation } from '@/lib/useTranslation'
import ChevronRightIcon from './icons/ChevronRightIcon'

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

export default function ExhibitionCarousel({ exhibitions, onOpen, lang }: ExhibitionCarouselProps) {
  const t = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
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
      {/* Clipping container */}
      <div ref={containerRef} className="overflow-hidden">
        <motion.div
          className="flex gap-2"
          style={{ x: trackX, paddingLeft: LEFT_INSET, paddingRight: RIGHT_INSET }}
          drag="x"
          dragConstraints={{ left: -maxScroll, right: 0 }}
          dragElastic={0.05}
          dragMomentum={false}
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
                <div className="relative w-full h-[158px] overflow-hidden">
                  <Image
                    src={ex.image}
                    alt={ex.title}
                    fill
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>

                <div className="flex flex-col gap-4 p-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[20px] font-semibold text-black leading-normal">{displayTitle}</h3>
                    <p className="text-xs text-ink-secondary leading-normal">{metaLine(ex, lang)}</p>
                  </div>
                  <p className="text-sm font-normal text-black leading-[18px] h-[54px] line-clamp-3">
                    {lang === 'zh' && ex.descriptionZh ? ex.descriptionZh : ex.description}
                  </p>
                  <button
                    onClick={() => onOpen(ex.id)}
                    className="flex items-center gap-0.5 text-sm font-semibold text-black"
                  >
                    {t.whatsOn.explore}
                    <ChevronRightIcon size={17} />
                  </button>
                </div>
              </div>
            )
          })}
        </motion.div>
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
