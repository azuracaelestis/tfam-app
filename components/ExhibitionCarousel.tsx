'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, animate } from 'motion/react'
import type { PanInfo } from 'motion/react'
import { type Exhibition, metaLine } from '@/lib/exhibitions'

interface ExhibitionCarouselProps {
  exhibitions: Exhibition[]
  onOpen: (id: string) => void
}

const CARD_W      = 313
const CARD_GAP    = 15
const CARD_STRIDE = CARD_W + CARD_GAP   // 328 — translateX per card step
const LEFT_INSET  = 31.5                // CSS padding-left on the track

const SNAP_SPRING    = { type: 'spring' as const, visualDuration: 0.3, bounce: 0.1 }
const SWIPE_OFFSET   = CARD_STRIDE * 0.3   // ~98px drag → advance one card
const SWIPE_VELOCITY = 400                  // px/s fast-flick threshold

export default function ExhibitionCarousel({ exhibitions, onOpen }: ExhibitionCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const trackX = useMotionValue(0)

  const snapToCard = (index: number) => {
    animate(trackX, -index * CARD_STRIDE, SNAP_SPRING)
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
    <div className="flex flex-col gap-[18px]">
      {/* Clipping container */}
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-[15px]"
          style={{ x: trackX, paddingLeft: LEFT_INSET }}
          drag="x"
          dragConstraints={{ left: -(exhibitions.length - 1) * CARD_STRIDE, right: 0 }}
          dragElastic={0.05}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
        >
          {exhibitions.map((ex, i) => (
            <div
              key={ex.id}
              className="relative w-[313px] h-[390px] shrink-0 rounded-[16px] overflow-hidden border border-border-card bg-tfam-light"
            >
              {/* Shared-element image layer */}
              <motion.div layoutId={`ex-img-${ex.id}`} className="absolute inset-0 overflow-hidden">
                <Image
                  src={ex.image}
                  alt={ex.title}
                  fill
                  className="object-cover"
                  priority={i === 0}
                />
              </motion.div>

              {/* White content overlay — bottom 57.5% of card (~224px) */}
              <div className="absolute bottom-0 left-0 right-0 bg-white px-5 pt-4 pb-[27px] flex flex-col gap-[18px]">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[24px] font-bold text-black leading-[30px]">{ex.title}</h3>
                  <p className="text-[14px] text-tfam-mid leading-normal">{metaLine(ex)}</p>
                </div>
                <p className="text-[14px] text-black leading-snug line-clamp-3">{ex.description}</p>
                <button
                  onClick={() => onOpen(ex.id)}
                  className="h-[38px] w-full rounded-pill bg-black active:bg-[#494848] text-white text-[16px] font-bold flex items-center justify-center transition-colors duration-75"
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
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
