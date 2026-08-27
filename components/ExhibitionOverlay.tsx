'use client'
import { useState, useEffect } from 'react'
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

export default function ExhibitionOverlay({ ex, onClose }: { ex: Exhibition; onClose: () => void }) {
  const router = useRouter()
  const t = useTranslation()
  const [lang] = useLanguage()

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
    <div className="fixed inset-0 z-30 bg-white overflow-y-auto pb-[69px] font-noto">
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

      <ExhibitionImageSlider images={ex.images} alt={ex.title} />

      <ExhibitionDetailContent
        ex={ex}
        lang={lang}
        onStartAudio={() => setSheetOpen(true)}
        onSeeOnMap={handleSeeOnMap}
      />

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
