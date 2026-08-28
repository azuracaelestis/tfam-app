'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import HomeFeaturedExhibition from './HomeFeaturedExhibition'
import HomeCards from './HomeCards'
import HomePlanVisit from './HomePlanVisit'
import AudioInputSheet from './AudioInputSheet'
import { useTranslation } from '@/lib/useTranslation'

export default function HomeClient() {
  const t = useTranslation()
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
    <div className="min-h-screen bg-canvas flex flex-col font-noto pb-[69px]">

      {/* ── Top bar: TFAM mark left / "You're here" right ── */}
      <header className="h-[60px] px-5 flex items-center justify-between shrink-0 bg-white">
        <img
          src="/Taipei_Fine_Arts_Museum_logo.svg"
          width={160}
          height={24}
          alt="Taipei Fine Arts Museum"
          className="w-[160px] h-[24px]"
        />

        <div className="flex items-center gap-1.5 text-sm text-ink">
          <svg width="10" height="13" viewBox="0 0 10 13" fill="currentColor" aria-hidden="true">
            <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8C10 2.24 7.76 0 5 0zm0 6.5C4.17 6.5 3.5 5.83 3.5 5S4.17 3.5 5 3.5 6.5 4.17 6.5 5 5.83 6.5 5 6.5z" />
          </svg>
          {t.home.youAreHere}
        </div>
      </header>

      {/* ── Hero: full-bleed museum photo, fading into the canvas below ── */}
      <section className="relative shrink-0 w-[402px] h-[241px] overflow-hidden">
        <Image src="/homepage2.png" width={402} height={241} className="w-[402px] h-[241px] object-cover" alt="" preload />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(177deg, rgba(255,255,255,0) 60%, var(--color-canvas) 78%)' }}
        />
      </section>

      {/* ── Welcome copy + primary CTA — normal flow below the photo ── */}
      <section className="relative flex flex-col gap-3 px-5 pt-3 pb-4 bg-canvas -mt-8">
        <div className="flex flex-col gap-2 text-ink">
          <h2 className="text-[32px] leading-[2.5rem] font-semibold max-w-[284px]">
            {t.home.heroHeading}
          </h2>
          <p className="text-body-l text-ink-secondary">
            {t.home.heroSubtitle}
          </p>
        </div>

        <button
          onClick={() => setSheetOpen(true)}
          className="flex items-center justify-center gap-1.5 w-full h-[48px] rounded-pill bg-ink text-white text-label-l"
        >
          <img src="/audio-headphone-white.svg" width={14} height={14} alt="" aria-hidden="true" />
          {t.home.startAudioGuide}
        </button>
      </section>

      {/* ── Today at the Museum ── */}
      <HomeFeaturedExhibition />

      {/* ── Explore the Museum ── */}
      <HomeCards />

      {/* ── Plan Your Visit ── */}
      <HomePlanVisit />

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
