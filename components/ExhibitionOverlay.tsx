'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import AudioInputSheet from './AudioInputSheet'
import ExhibitionImageSlider from './ExhibitionImageSlider'
import ExhibitionDetailContent from './ExhibitionDetailContent'
import { getById } from '@/lib/exhibitions'
import { useTranslation } from '@/lib/useTranslation'
import { useLanguage } from '@/lib/useLanguage'
import { LIFT, SHEET } from '@/lib/motion'
import type { Origin } from '@/contexts/ExhibitionOverlayContext'

function ChevronLeftIcon() {
  return (
    <svg width="7" height="13" viewBox="0 0 7 13" fill="none" aria-hidden="true">
      <path d="M6 1L1 6.5L6 12" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Content below the hero fades in a beat after the hero lands — reads as the
// room assembling around the image rather than everything snapping in at once.
const CONTENT_ENTER = { duration: LIFT.duration, ease: LIFT.ease, delay: 0.07 }
const CONTENT_EXIT = { duration: LIFT.duration }

export default function ExhibitionOverlay({ id, origin, onClose }: { id: string; origin: Origin; onClose: () => void }) {
  const router = useRouter()
  const t = useTranslation()
  const [lang] = useLanguage()
  const ex = getById(id)

  const [sheetOpen, setSheetOpen] = useState(false)
  const [code, setCode] = useState('')

  if (!ex) return null

  // Map has no thumbnail to lift from, so it gets no layoutId — the hero
  // falls back cleanly to the panel-only fade/rise entrance.
  const heroLayoutId = origin === 'map' ? undefined : `hero-${origin}-${id}`

  const handleDigit  = (d: string) => setCode(prev => prev.length < 4 ? prev + d : prev)
  const handleDelete = () => setCode(prev => prev.slice(0, -1))
  const handleClose  = () => { setSheetOpen(false); setCode('') }
  const handlePlay   = () => router.push('/play?code=' + code)
  const handleQR     = () => router.push('/play?code=1001')
  const handleSeeOnMap = () => window.open('https://www.google.com/maps/search/?api=1&query=Taipei+Fine+Arts+Museum', '_blank')

  return (
    <motion.div
      className="fixed inset-0 z-30 bg-white overflow-y-auto pb-[69px] font-noto"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={LIFT}
    >
      {/* R4: while AudioInputSheet is open, the overlay's own content recedes
          behind it — AudioInputSheet doesn't own the page it sits over, so
          this wrapper (everything except the sheet) carries the effect. A
          nested motion.div, not the outer panel above: that one already has
          its own R1 mount/unmount transform+transition, and mixing the two
          concerns onto one element would fight over a single `transition`.
          `overflow-clip`, not `overflow-hidden`: hidden establishes a scroll
          container, which would become the sticky header's containing block
          below and break its stick-to-top-on-scroll (verified — it did).
          clip still clips the border-radius during the scale without that
          side effect. */}
      <motion.div
        className="flex flex-col overflow-clip"
        animate={{
          scale: sheetOpen ? 0.94 : 1,
          y: sheetOpen ? 12 : 0,
          borderRadius: sheetOpen ? 14 : 0,
        }}
        transition={SHEET}
        style={{ transformOrigin: 'top center' }}
      >
      {/* ── Header ── */}
      <motion.header
        className="sticky top-0 z-10 bg-white h-[60px] px-5 flex items-end pb-[10px] shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: CONTENT_ENTER }}
        exit={{ opacity: 0, transition: CONTENT_EXIT }}
      >
        <button
          onClick={onClose}
          className="relative flex items-center gap-3 before:content-[''] before:absolute before:-inset-y-[12px] before:inset-x-0"
          aria-label={t.exhibitionDetail.back}
        >
          <ChevronLeftIcon />
          <span className="text-[20px] font-bold text-black leading-none">{t.exhibitionDetail.back}</span>
        </button>
      </motion.header>

      <ExhibitionImageSlider images={ex.images} alt={ex.title} heroLayoutId={heroLayoutId} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: CONTENT_ENTER }}
        exit={{ opacity: 0, transition: CONTENT_EXIT }}
      >
        <ExhibitionDetailContent
          ex={ex}
          lang={lang}
          onStartAudio={() => setSheetOpen(true)}
          onSeeOnMap={handleSeeOnMap}
        />
      </motion.div>

      </motion.div>

      <AudioInputSheet
        open={sheetOpen}
        code={code}
        onDigit={handleDigit}
        onDelete={handleDelete}
        onClose={handleClose}
        onPlay={handlePlay}
        onQR={handleQR}
      />
    </motion.div>
  )
}
