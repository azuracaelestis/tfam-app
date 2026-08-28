'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function ExhibitionDetailClient({ ex }: { ex: Exhibition }) {
  const router = useRouter()
  const t = useTranslation()
  const [lang] = useLanguage()

  const [sheetOpen, setSheetOpen] = useState(false)
  const [code, setCode] = useState('')

  // Audio sheet handlers — identical wiring to HomeClient
  const handleDigit  = (d: string) => setCode(prev => prev.length < 4 ? prev + d : prev)
  const handleDelete = () => setCode(prev => prev.slice(0, -1))
  const handleClose  = () => { setSheetOpen(false); setCode('') }
  const handlePlay   = () => router.push('/play?code=' + code)
  const handleQR     = () => router.push('/play?code=1001')
  const handleSeeOnMap = () => window.open('https://www.google.com/maps/search/?api=1&query=Taipei+Fine+Arts+Museum', '_blank')

  // Prefer true back-navigation so the transition mirrors however this
  // screen was entered; only fall back to a literal push when there's no
  // in-app history to go back to (e.g. a direct deep link).
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/whats-on')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-noto pb-[69px]">

      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-white h-[60px] px-5 flex items-end pb-[10px] shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center gap-3"
          aria-label={t.exhibitionDetail.back}
        >
          <ChevronLeftIcon />
          <span className="text-[20px] font-bold text-black leading-none">{t.exhibitionDetail.back}</span>
        </button>
      </header>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1">
        <ExhibitionImageSlider images={ex.images} alt={ex.title} />
        <ExhibitionDetailContent
          ex={ex}
          lang={lang}
          onStartAudio={() => setSheetOpen(true)}
          onSeeOnMap={handleSeeOnMap}
        />
      </div>

      {/* ── Audio sheet — identical wiring to HomeClient ── */}
      <AudioInputSheet
        open={sheetOpen}
        code={code}
        onDigit={handleDigit}
        onDelete={handleDelete}
        onClose={handleClose}
        onPlay={handlePlay}
        onQR={handleQR}
      />

    </div>
  )
}
