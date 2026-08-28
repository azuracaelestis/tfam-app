'use client'
import { useRef, useState, useLayoutEffect } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, animate } from 'motion/react'
import type { PanInfo } from 'motion/react'
import ExhibitionCarousel from './ExhibitionCarousel'
import ExhibitionOverlay from './ExhibitionOverlay'
import ChevronRightIcon from './icons/ChevronRightIcon'
import {
  type Exhibition,
  type ExhibitionStatus,
  getFeatured,
  getByStatus,
  getById,
  metaLine,
} from '@/lib/exhibitions'
import { useTranslation } from '@/lib/useTranslation'
import { useLanguage } from '@/lib/useLanguage'

// ── Current card ──────────────────────────────────────────────────────────────

function translateCat(t: ReturnType<typeof useTranslation>, cat: string): string {
  return t.notifications.categories[cat as keyof typeof t.notifications.categories] ?? cat
}

function CheckIcon() {
  return (
    <svg width="14" height="11" viewBox="0 0 14 11" fill="none" aria-hidden="true">
      <path d="M1 5.5L5 9.5L13 1.5" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CurrentCard({ ex, onOpen, lang }: { ex: Exhibition; onOpen: (id: string) => void; lang: 'en' | 'zh' }) {
  const t = useTranslation()
  const displayTitle = lang === 'zh' && ex.titleZh ? ex.titleZh : ex.title
  return (
    <div
      onClick={() => onOpen(ex.id)}
      className="w-[361px] flex items-stretch gap-[9px] bg-white active:bg-[#EEEEEE] border border-hairline rounded-card overflow-hidden pr-5 transition-colors duration-75 cursor-pointer"
    >
      <div className="relative w-[121px] min-h-[94px] shrink-0 overflow-hidden">
        <Image src={ex.image} alt={ex.title} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-1 justify-center py-3">
        <p className="text-base font-semibold text-black leading-snug truncate">{displayTitle}</p>
        <p className="text-xs text-ink-secondary leading-normal whitespace-nowrap">{metaLine(ex, lang)}</p>
        <div className="flex items-center gap-2 flex-wrap">
          {ex.categories.map(cat => (
            <div key={cat} className="flex items-center gap-2 bg-[#f2f2f2] rounded-[8px] px-2 py-1">
              <img src="/tag.svg" width={8} height={8} alt="" aria-hidden="true" className="shrink-0" />
              <span className="text-[12px] text-black whitespace-nowrap">
                {translateCat(t, cat)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <ChevronRightIcon size={24} className="text-ink shrink-0 self-center" />
    </div>
  )
}

// ── Coming-soon card ──────────────────────────────────────────────────────────

interface ComingSoonCardProps {
  ex: Exhibition
  notified: boolean
  onToggle: () => void
}

function ComingSoonCard({ ex, notified, onToggle, lang }: ComingSoonCardProps & { lang: 'en' | 'zh' }) {
  const t = useTranslation()
  const displayTitle = lang === 'zh' && ex.titleZh ? ex.titleZh : ex.title
  return (
    <div className="flex h-[130px] gap-4 bg-white border border-hairline rounded-card overflow-hidden pr-5">
      <div className="relative w-[148px] h-[130px] shrink-0 overflow-hidden rounded-card">
        <Image src={ex.image} alt={ex.title} fill className="object-cover" />
      </div>
      <div className="flex-1 flex flex-col gap-3 justify-center min-w-0 py-3">
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-black leading-snug truncate">{displayTitle}</p>
          <p className="text-xs text-ink-secondary leading-normal truncate">{metaLine(ex, lang, cat => translateCat(t, cat))}</p>
        </div>
        <button
          onClick={onToggle}
          className={`h-[44px] w-full rounded-pill flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${
            notified
              ? 'bg-[#F4F4F4] border border-[#DDDDDD] text-[#4F4F4F]'
              : 'bg-white border border-black text-black'
          }`}
        >
          {notified
            ? <CheckIcon />
            : <img src="/bell-black.svg" width={13} height={14} alt="" aria-hidden="true" className="shrink-0" />
          }
          {t.whatsOn.notifyMe}
        </button>
      </div>
    </div>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────

const TAB_VALUES: ExhibitionStatus[] = ['current', 'coming-soon']

const SNAP_SPRING = { type: 'spring' as const, visualDuration: 0.3, bounce: 0.1 }
const PANEL_GAP = 60
const SWIPE_OFFSET_RATIO = 0.3
const SWIPE_VELOCITY     = 400

export default function WhatsOnClient() {
  const t = useTranslation()
  const [lang] = useLanguage()
  const [activeTab, setActiveTab] = useState<ExhibitionStatus>('current')
  const [notified,  setNotified]  = useState<Set<string>>(new Set())
  const [openId,    setOpenId]    = useState<string | null>(null)

  const TABS = [
    { label: t.whatsOn.current,    value: 'current'     as ExhibitionStatus },
    { label: t.whatsOn.comingSoon, value: 'coming-soon' as ExhibitionStatus },
  ]

  // ── Swipe track ──
  const trackX       = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [panelW, setPanelW] = useState(0)

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

  const countFor = (tab: { value: ExhibitionStatus }) =>
    tab.value === 'current' ? currentList.length : comingSoonList.length

  const snapToIndex = (index: number) => {
    const w = containerRef.current?.offsetWidth ?? panelW
    animate(trackX, -index * (w + PANEL_GAP), SNAP_SPRING)
    setActiveTab(TAB_VALUES[index])
  }

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const w = containerRef.current?.offsetWidth ?? panelW
    const currentIndex = TAB_VALUES.findIndex(v => v === activeTab)
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

      {/* ── Header ── */}
      <header className="bg-white px-5 pt-3 pb-3 flex flex-col gap-1 shrink-0">
        <h1 className="text-[32px] font-semibold text-black leading-normal">{t.whatsOn.title}</h1>
        <p className="text-sm text-ink-secondary">{t.whatsOn.subtitle}</p>
      </header>

      {/* ── Carousel ── */}
      <div className="shrink-0 mb-[32px]">
        <ExhibitionCarousel exhibitions={featured} onOpen={setOpenId} lang={lang} />
      </div>

      {/* ── Tabs + swipeable track ── */}
      <div className="flex-1 flex flex-col px-4 gap-[18px]">

        <div className="bg-icon-bg rounded-pill p-1 flex gap-1 overflow-hidden">
          {TABS.map((tab, i) => (
            <button
              key={tab.value}
              onClick={() => snapToIndex(i)}
              className={`flex-1 min-w-0 h-[44px] rounded-pill flex items-center justify-center gap-2 transition-colors font-bold text-[16px] text-black outline-none focus:outline-none focus-visible:outline-none ${
                activeTab === tab.value ? 'bg-white' : 'bg-transparent'
              }`}
            >
              {tab.label}
              <span className="bg-[#ececec] rounded-full min-w-[29px] h-[27px] flex items-center justify-center text-[14px] font-bold text-black px-1">
                {countFor(tab)}
              </span>
            </button>
          ))}
        </div>

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
              className="flex flex-col gap-2 pb-4 shrink-0"
              style={{ width: panelW || '100%' }}
            >
              {currentList.map(ex => (
                <CurrentCard key={ex.id} ex={ex} onOpen={setOpenId} lang={lang} />
              ))}
            </div>

            {/* Panel 1 — Coming Soon */}
            <div
              className="flex flex-col gap-2 pb-4 shrink-0"
              style={{ width: panelW || '100%' }}
            >
              {comingSoonList.map(ex => (
                <ComingSoonCard
                  key={ex.id}
                  ex={ex}
                  notified={notified.has(ex.id)}
                  onToggle={() => toggleNotify(ex.id)}
                  lang={lang}
                />
              ))}
            </div>
          </motion.div>
        </div>

      </div>

      {/* ── Overlay ── */}
      {openId !== null && (() => {
        const ex = getById(openId)
        return ex ? (
          <ExhibitionOverlay key={openId} ex={ex} onClose={() => setOpenId(null)} />
        ) : null
      })()}

    </div>
  )
}
