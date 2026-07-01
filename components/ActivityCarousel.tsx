'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, useMotionValue, animate } from 'motion/react'
import type { PanInfo } from 'motion/react'
import { type Activity } from '@/lib/activities'
import { useTranslation } from '@/lib/useTranslation'
import { useLanguage } from '@/lib/useLanguage'
import { translateTag } from '@/lib/translateTag'

const CARD_W      = 313
const CARD_GAP    = 18
const CARD_STRIDE = CARD_W + CARD_GAP   // 331
const LEFT_INSET  = 18

const SNAP_SPRING    = { type: 'spring' as const, visualDuration: 0.3, bounce: 0.1 }
const SWIPE_OFFSET   = CARD_STRIDE * 0.3
const SWIPE_VELOCITY = 400

function CalendarIconWhite() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="3" width="14" height="11" rx="1.5" stroke="white" strokeWidth="1.4" />
      <path d="M1 7h14" stroke="white" strokeWidth="1.4" />
      <path d="M5 1v4M11 1v4" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function TagPill({ label, isFree }: { label: string; isFree?: boolean }) {
  return (
    <div className={`bg-[#f2f2f2] flex items-center justify-center px-[8px] py-[4px] rounded-[8px] shrink-0 ${isFree ? 'gap-[8px]' : ''}`}>
      {isFree && (
        <img src="/tag.svg" width={8} height={8} alt="" aria-hidden="true" className="shrink-0" />
      )}
      <span className="text-[12px] text-black whitespace-nowrap">{label}</span>
    </div>
  )
}

export default function ActivityCarousel({ activities }: { activities: Activity[] }) {
  const router = useRouter()
  const t = useTranslation()
  const [lang] = useLanguage()
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
      target = Math.min(activeIndex + 1, activities.length - 1)
    } else if (offset.x > SWIPE_OFFSET || velocity.x > SWIPE_VELOCITY) {
      target = Math.max(activeIndex - 1, 0)
    }
    snapToCard(target)
  }

  return (
    <div className="flex flex-col gap-[14px]">
      {/* Clipping container */}
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-[18px]"
          style={{ x: trackX, paddingLeft: LEFT_INSET }}
          drag="x"
          dragConstraints={{ left: -(activities.length - 1) * CARD_STRIDE, right: 0 }}
          dragElastic={0.05}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
        >
          {activities.map(a => (
            <div
              key={a.id}
              className="w-[313px] h-[340px] shrink-0 rounded-[16px] overflow-hidden border-2 border-[#d6d6d6] bg-white flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full h-[175px] shrink-0">
                <Image src={a.image} alt={a.title} fill className="object-cover" />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col gap-[18px] px-[24px] pt-[22px] pb-[30px]">
                <div className="flex flex-col gap-[4px]">
                  <h3 className="text-[20px] font-semibold text-black leading-snug line-clamp-2">
                    {lang === 'zh' && a.titleZh ? a.titleZh : a.title}
                  </h3>
                  <div className="flex gap-[4px] flex-wrap">
                    {a.tags.map(raw => (
                      <TagPill key={raw} label={translateTag(raw, t)} isFree={raw === 'Free'} />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/activities/${a.id}/book`)}
                  className="mt-auto flex items-center justify-center gap-[8px] p-[8px] w-full rounded-pill bg-black active:bg-[#494848] text-white text-[16px] font-bold transition-colors duration-75"
                >
                  <CalendarIconWhite />
                  {t.activities.bookThis}
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Pagination dots */}
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
