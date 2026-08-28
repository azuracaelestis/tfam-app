'use client'
import { useRef, useState, useLayoutEffect } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, animate } from 'motion/react'
import type { PanInfo } from 'motion/react'
import { useTranslation } from '@/lib/useTranslation'
import { LIFT } from '@/lib/motion'

const SNAP_SPRING    = { type: 'spring' as const, visualDuration: 0.3, bounce: 0.1 }
const SWIPE_VELOCITY = 400

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

export default function ExhibitionImageSlider({
  images,
  alt,
  heroLayoutId,
}: {
  images: string[]
  alt: string
  heroLayoutId?: string
}) {
  const t = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const trackX    = useMotionValue(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [sliderW, setSliderW] = useState(0)
  const [hovered, setHovered] = useState(false)

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
      target = Math.min(activeIndex + 1, images.length - 1)
    } else if (offset.x > w * 0.3 || velocity.x > SWIPE_VELOCITY) {
      target = Math.max(activeIndex - 1, 0)
    }
    snapTo(target)
  }

  return (
    <div className="shrink-0">
      <div
        className="relative w-full h-[225px]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div ref={sliderRef} className="overflow-hidden w-full h-full bg-canvas">
          <motion.div
            className="flex h-full"
            style={{ x: trackX }}
            drag={images.length > 1 ? 'x' : false}
            dragConstraints={{ left: -(images.length - 1) * sliderW, right: 0 }}
            dragElastic={0.05}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
          >
            {/* The shared element only exists while slide 0 is the slide on
                screen. Once the visitor swipes away, slide 0 is translated off
                to the left with the track, and letting it keep the layoutId
                makes the closing lift start from that off-screen box — the hero
                flings ~550px left before curving back to the row. Swiping away
                breaks the identity link by hand, so the exit correctly degrades
                to the panel-only fade, exactly as the Map origin does. */}
            {images.map((src, i) => (
              <div key={i} className="relative shrink-0 h-full" style={{ width: sliderW || '100%' }}>
                {i === 0 && heroLayoutId && activeIndex === 0 ? (
                  <motion.div layoutId={heroLayoutId} className="relative w-full h-full" transition={LIFT}>
                    <Image src={src} alt={alt} fill className="object-cover" priority />
                  </motion.div>
                ) : (
                  <Image src={src} alt={alt} fill className="object-cover" priority={i === 0} />
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {images.length > 1 && (
          <>
            <button
              aria-label={t.exhibitionDetail.prevImage}
              disabled={activeIndex === 0}
              onClick={() => snapTo(activeIndex - 1)}
              className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 size-9 rounded-full bg-white/80 shadow-md flex items-center justify-center transition-opacity duration-150 focus-visible:opacity-100 ${
                hovered && activeIndex > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <SliderArrowLeftIcon />
            </button>
            <button
              aria-label={t.exhibitionDetail.nextImage}
              disabled={activeIndex === images.length - 1}
              onClick={() => snapTo(activeIndex + 1)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 z-10 size-9 rounded-full bg-white/80 shadow-md flex items-center justify-center transition-opacity duration-150 focus-visible:opacity-100 ${
                hovered && activeIndex < images.length - 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <SliderArrowRightIcon />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center justify-center gap-[7px] pt-3">
          {images.map((_, i) => (
            <span
              key={i}
              className={`block rounded-full transition-all duration-200 ${
                i === activeIndex ? 'w-5 h-[6px] bg-[#9c9c9c]' : 'size-[6px] bg-[#9c9c9c]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
