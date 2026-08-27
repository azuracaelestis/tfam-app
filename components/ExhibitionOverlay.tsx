'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'motion/react'
import AudioInputSheet from './AudioInputSheet'
import ExhibitionImageSlider from './ExhibitionImageSlider'
import ExhibitionDetailContent from './ExhibitionDetailContent'
import { type Exhibition } from '@/lib/exhibitions'
import { useTranslation } from '@/lib/useTranslation'
import { useLanguage } from '@/lib/useLanguage'

function ChevronLeftIcon() {
  return (
    <svg width="7" height="13" viewBox="0 0 7 13" fill="none" aria-hidden="true">
      <path d="M6 1L1 6.5L6 12" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ExhibitionOverlay({ ex, onClose }: { ex: Exhibition; onClose: () => void }) {
  const router = useRouter()
  const t = useTranslation()
  const [lang] = useLanguage()
  const [morphComplete, setMorphComplete] = useState(false)

  const [sheetOpen, setSheetOpen] = useState(false)
  const [code, setCode] = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleDigit  = (d: string) => setCode(prev => prev.length < 4 ? prev + d : prev)
  const handleDelete = () => setCode(prev => prev.slice(0, -1))
  const handleClose  = () => { setSheetOpen(false); setCode('') }
  const handlePlay   = () => router.push('/play?code=' + code)
  const handleQR     = () => router.push('/play?code=1001')
  const handleSeeOnMap = () => window.open('https://www.google.com/maps/search/?api=1&query=Taipei+Fine+Arts+Museum', '_blank')

  return (
    <motion.div
      className="fixed inset-0 z-30 bg-white overflow-y-auto pb-[69px] font-noto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-white h-[60px] px-5 flex items-end pb-[10px] shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-3"
          aria-label={t.exhibitionDetail.back}
        >
          <ChevronLeftIcon />
          <span className="text-[20px] font-bold text-black leading-none">{t.exhibitionDetail.back}</span>
        </button>
      </header>

      {/* ── Hero image — shared element; unmounts once the FLIP morph finishes, replaced by the real slider ── */}
      {!morphComplete && (
        <motion.div
          layoutId={`ex-img-${ex.id}`}
          className="relative w-full h-[225px] overflow-hidden bg-canvas"
          onLayoutAnimationComplete={() => setMorphComplete(true)}
        >
          <Image src={ex.images[0]} alt={ex.title} fill className="object-cover" priority />
        </motion.div>
      )}

      {morphComplete && <ExhibitionImageSlider images={ex.images} alt={ex.title} />}

      {/* ── Content — not mounted until morph completes; fades in on mount ── */}
      {morphComplete && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <ExhibitionDetailContent
            ex={ex}
            lang={lang}
            onStartAudio={() => setSheetOpen(true)}
            onSeeOnMap={handleSeeOnMap}
          />
        </motion.div>
      )}

      {morphComplete && (
        <AudioInputSheet
          open={sheetOpen}
          code={code}
          onDigit={handleDigit}
          onDelete={handleDelete}
          onClose={handleClose}
          onPlay={handlePlay}
          onQR={handleQR}
        />
      )}
    </motion.div>
  )
}
