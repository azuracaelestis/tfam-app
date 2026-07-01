'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import HomeCards from './HomeCards'
import AudioInputSheet from './AudioInputSheet'
import { useTranslation } from '@/lib/useTranslation'
import { useLanguage } from '@/lib/useLanguage'

export default function HomeClient() {
  const t = useTranslation()
  const [lang] = useLanguage()
  const router = useRouter()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [code, setCode] = useState('')

  const handleDigit = (d: string) => {
    setCode((prev) => (prev.length < 4 ? prev + d : prev))
  }
  const handleDelete = () => setCode((prev) => prev.slice(0, -1))
  const handleClose = () => { setSheetOpen(false); setCode('') }
  const handlePlay = () => router.push('/play?code=' + code)
  const handleQR = () => router.push('/play?code=1001')

  return (
    <div className="min-h-screen bg-white flex flex-col font-noto pb-[69px]">

      {/* ── Top bar: TFAM mark left / "You're here" right ── */}
      <header className="h-[60px] px-5 flex items-center justify-between shrink-0">
        <img src="/tfam-logo.png" width={56} height={38} alt="TFAM" />

        <div className="flex items-center gap-1.5 text-sm text-black">
          <svg width="10" height="13" viewBox="0 0 10 13" fill="currentColor" aria-hidden="true">
            <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8C10 2.24 7.76 0 5 0zm0 6.5C4.17 6.5 3.5 5.83 3.5 5S4.17 3.5 5 3.5 6.5 4.17 6.5 5 5.83 6.5 5 6.5z" />
          </svg>
          {t.home.youAreHere}
        </div>
      </header>

      {/* ── Hero: welcome card with museum photo background ── */}
      <section className="relative shrink-0 w-full h-[299px] overflow-hidden">
        <Image src="/hero-gallery.png" fill className="object-cover" alt="" priority />
        <div className="absolute inset-0 bg-white/30" />

        {/* Content — centered vertically with 64px top/bottom breathing room */}
        <div className="absolute inset-0 flex flex-col justify-center gap-5 px-5 py-16">
          <div className="flex flex-col gap-2 text-black">
            <p className="text-base font-normal">{t.home.welcome}</p>
            <h2
              className="font-bold leading-[1.1] max-w-[284px]"
              style={{ fontSize: lang === 'zh' ? '29px' : '2rem' }}
            >
              {t.home.heroHeading}
            </h2>
            <p className="text-sm font-normal text-black/70">
              {t.home.heroSubtitle}
            </p>
          </div>

          <button
            onClick={() => setSheetOpen(true)}
            className="flex items-center justify-center gap-1.5 w-full h-[56px] rounded-pill bg-black text-white text-base font-bold"
          >
            <img src="/audio-headphone-white.svg" width={14} height={14} alt="" aria-hidden="true" />
            {t.home.startAudioGuide}
          </button>
        </div>
      </section>

      {/* ── Tap cards ── */}
      <HomeCards />

      {/* ── Audio input sheet (logic unchanged) ── */}
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
