'use client'
import { useRef, useState, useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, useMotionValue, animate } from 'motion/react'
import type { PanInfo } from 'motion/react'
import ExhibitionCarousel from './ExhibitionCarousel'
import {
  type Exhibition,
  type ExhibitionStatus,
  getFeatured,
  getByStatus,
  metaLine,
} from '@/lib/exhibitions'

// ── Current card ──────────────────────────────────────────────────────────────

function CurrentCard({ ex }: { ex: Exhibition }) {
  const router = useRouter()
  return (
    <div
      onClick={() => router.push('/whats-on/' + ex.id + '?from=card')}
      className="flex h-[113px] bg-white active:bg-[#EEEEEE] border border-border-card rounded-[16px] overflow-hidden transition-colors duration-75 cursor-pointer"
    >
      <div className="relative w-[119px] h-[113px] shrink-0 overflow-hidden rounded-l-[16px]">
        <Image src={ex.image} alt={ex.title} fill className="object-cover" />
      </div>
      <div className="flex-1 flex flex-col gap-1 justify-center px-[18px] min-w-0">
        <p className="text-[16px] font-semibold text-black leading-snug truncate">{ex.title}</p>
        <p className="text-[14px] text-black leading-normal truncate">{metaLine(ex)}</p>
        <div className="flex items-center gap-2 flex-wrap">
          {ex.categories.map(cat => (
            <div key={cat} className="flex items-center gap-2 bg-[#f2f2f2] rounded-[8px] px-2 py-1">
              <img src="/tag.svg" width={8} height={8} alt="" aria-hidden="true" className="shrink-0" />
              <span className="text-[12px] text-black whitespace-nowrap">{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Coming-soon card ──────────────────────────────────────────────────────────

interface ComingSoonCardProps {
  ex: Exhibition
  notified: boolean
  onToggle: () => void
}

function ComingSoonCard({ ex, notified, onToggle }: ComingSoonCardProps) {
  return (
    <div className="flex h-[113px] bg-white border border-border-card rounded-[16px] overflow-hidden">
      <div className="relative w-[119px] h-[113px] shrink-0 overflow-hidden rounded-l-[16px]">
        <Image src={ex.image} alt={ex.title} fill className="object-cover" />
      </div>
      <div className="flex-1 flex flex-col gap-2 justify-center px-[18px] min-w-0">
        <div>
          <p className="text-[16px] font-semibold text-black leading-snug">{ex.title}</p>
          <p className="text-[14px] text-black leading-normal">{metaLine(ex)}</p>
        </div>
        <button
          onClick={onToggle}
          className={`h-[28px] w-full rounded-pill flex items-center justify-center gap-[6px] text-[14px] font-bold transition-colors ${
            notified
              ? 'bg-tfam-light text-tfam-mid border border-[#BEBEBE]'
              : 'bg-black text-white'
          }`}
        >
          {notified ? (
            '✓ Notifying You'
          ) : (
            <>
              <img src="/bell-white.svg" width={13} height={13} alt="" aria-hidden="true" className="shrink-0" />
              Notify Me
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────

const TABS: { label: string; value: ExhibitionStatus }[] = [
  { label: 'Current',     value: 'current'     },
  { label: 'Coming Soon', value: 'coming-soon' },
]

// Calm spring — museum app, not a game
const SNAP_SPRING = { type: 'spring' as const, visualDuration: 0.3, bounce: 0.1 }

// Gap between the two panels (visible mid-swipe)
const PANEL_GAP = 60

// Drag thresholds
const SWIPE_OFFSET_RATIO = 0.3  // 30% of panel width
const SWIPE_VELOCITY     = 400  // px/s

export default function WhatsOnClient() {
  const [activeTab, setActiveTab] = useState<ExhibitionStatus>('current')
  const [notified,  setNotified]  = useState<Set<string>>(new Set())

  // ── Swipe track ──
  const trackX       = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [panelW, setPanelW] = useState(0)

  // Measure container synchronously before first paint — no flash
  useLayoutEffect(() => {
    if (containerRef.current) {
      setPanelW(containerRef.current.offsetWidth)
    }
  }, [])

  // ── Data ──
  const featured       = getFeatured()
  const currentList    = getByStatus('current').filter(e => !e.featured)
  const comingSoonList = getByStatus('coming-soon')

  const toggleNotify = (id: string) =>
    setNotified(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const countFor = (tab: typeof TABS[number]) =>
    tab.value === 'current' ? currentList.length : comingSoonList.length

  // ── Snap + pill sync ──
  const snapToIndex = (index: number) => {
    // Always read live width so snap is correct even after resize
    const w = containerRef.current?.offsetWidth ?? panelW
    animate(trackX, -index * (w + PANEL_GAP), SNAP_SPRING)
    setActiveTab(TABS[index].value)
  }

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const w = containerRef.current?.offsetWidth ?? panelW
    const currentIndex = TABS.findIndex(t => t.value === activeTab)
    const { offset, velocity } = info

    let target = currentIndex
    if (offset.x < -w * SWIPE_OFFSET_RATIO || velocity.x < -SWIPE_VELOCITY) {
      target = Math.min(currentIndex + 1, TABS.length - 1)
    } else if (offset.x > w * SWIPE_OFFSET_RATIO || velocity.x > SWIPE_VELOCITY) {
      target = Math.max(currentIndex - 1, 0)
    }

    snapToIndex(target)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-noto pb-[69px]">

      {/* ── Header — sticky ── */}
      <header className="sticky top-0 z-10 bg-white h-[60px] px-5 flex items-end pb-[10px] shrink-0">
        <h1 className="text-[20px] font-bold text-black leading-none">What&rsquo;s On</h1>
      </header>

      {/* ── Carousel ── */}
      <div className="shrink-0 mb-[42px]">
        <ExhibitionCarousel exhibitions={featured} />
      </div>

      {/* ── Tabs + swipeable track ── */}
      <div className="flex-1 flex flex-col px-4 gap-3">

        {/* Tab pills — tap drives the track */}
        <div className="bg-tfam-light rounded-[32px] p-[7px] flex gap-2">
          {TABS.map((tab, i) => (
            <button
              key={tab.value}
              onClick={() => snapToIndex(i)}
              className={`flex-1 h-[47px] rounded-[32px] flex items-center justify-center gap-2 transition-colors border font-bold text-[16px] ${
                activeTab === tab.value
                  ? 'bg-[rgba(26,26,26,0.85)] text-white border-border-input'
                  : 'text-black border-border-input bg-transparent'
              }`}
            >
              {tab.label}
              <span className="bg-[#ececec] rounded-full min-w-[29px] h-[27px] flex items-center justify-center text-[14px] font-bold text-black px-1">
                {countFor(tab)}
              </span>
            </button>
          ))}
        </div>

        {/* Clipping container — measured for panel widths */}
        <div ref={containerRef} className="overflow-hidden">
          <motion.div
            className="flex items-start gap-[60px]"
            style={{ x: trackX }}
            drag="x"
            dragConstraints={{ left: -(panelW + PANEL_GAP), right: 0 }}
            dragElastic={0.05}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
          >
            {/* Panel 0 — Current */}
            <div
              className="flex flex-col gap-3 pb-4 shrink-0"
              style={{ width: panelW || '100%' }}
            >
              {currentList.map(ex => (
                <CurrentCard key={ex.id} ex={ex} />
              ))}
            </div>

            {/* Panel 1 — Coming Soon */}
            <div
              className="flex flex-col gap-3 pb-4 shrink-0"
              style={{ width: panelW || '100%' }}
            >
              {comingSoonList.map(ex => (
                <ComingSoonCard
                  key={ex.id}
                  ex={ex}
                  notified={notified.has(ex.id)}
                  onToggle={() => toggleNotify(ex.id)}
                />
              ))}
            </div>
          </motion.div>
        </div>

      </div>

    </div>
  )
}
