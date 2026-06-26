'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getArtworkByCode, type Language } from '@/lib/artworks'
import { useMockAudio } from '@/hooks/useMockAudio'
import { useOnTransitionComplete } from './PageTransitionWrapper'
import AudioControls from './AudioControls'
import ProgressBar from './ProgressBar'
import LanguagePicker from './LanguagePicker'
import Image from 'next/image'

function ChevronLeftIcon() {
  return (
    <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 1L1 6.5L6 12" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M1 1L7 7L1 13" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="0.75" y="5.25" width="9.5" height="7" rx="1.25" stroke="black" strokeWidth="1.2"/>
      <path d="M3.5 5.25V3.25C3.5 2.007 4.507 1 5.75 1C6.993 1 8 2.007 8 3.25V5.25" stroke="black" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

export default function PlayClient({ code }: { code: string }) {
  const router = useRouter()
  const [lang, setLang] = useState<Language>('en')
  const artwork = getArtworkByCode(code)

  const { isPlaying, currentTime, duration, play, pause, seek, replay, skipForward } = useMockAudio()

  // Start audio after the slide-in animation completes.
  // audioStartedRef ensures exactly one play() call between the two paths below.
  const audioStartedRef = useRef(false)

  // Primary: fires when PageTransitionWrapper's motion.div enter animation ends.
  useOnTransitionComplete(() => {
    if (!artwork || audioStartedRef.current) return
    audioStartedRef.current = true
    play()
  })

  // Fallback: AnimatePresence initial={false} skips animation on direct URL
  // navigation, so onAnimationComplete never fires. Start after 400ms in that case.
  useEffect(() => {
    const id = setTimeout(() => {
      if (!artwork || audioStartedRef.current) return
      audioStartedRef.current = true
      play()
    }, 400)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  if (!artwork) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6 text-center font-noto">
        <p className="text-tfam-dark font-semibold text-lg">Artwork not found</p>
        <p className="text-tfam-mid text-sm">Code &ldquo;{code}&rdquo; doesn&apos;t match any artwork in this guide.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-2 px-6 py-3 rounded-2xl bg-black text-white font-medium text-sm"
        >
          Back to Home
        </button>
      </div>
    )
  }

  const locale = artwork.locales[lang]

  return (
    <div className="min-h-screen bg-white flex flex-col font-noto pb-[69px]">

      {/* ── Top bar: back chevron + "Audio Guide" title ── */}
      <header className="h-[60px] px-5 flex items-end pb-[10px] shrink-0">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-3"
          aria-label="Back to Home"
        >
          <ChevronLeftIcon />
          <span className="text-[20px] font-bold text-black leading-none">Audio Guide</span>
        </button>
      </header>

      {/* ── Artwork image ── */}
      <div className="relative w-full h-[286px] bg-tfam-light overflow-hidden shrink-0">
        <Image src={artwork.imageUrl} fill className="object-cover" alt={locale.title} priority />
      </div>

      {/* ── Metadata + language picker ── */}
      <div className="px-[18px] pt-6 pb-3 flex flex-col gap-3 shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-3 flex-1 min-w-0 pr-3">
            <p className="text-sm font-normal text-tfam-mid">ENTANGLEMENTS | 3F GALLERY B</p>
            <div className="flex flex-col gap-1">
              <h1 className="text-[24px] font-semibold text-black leading-tight">{locale.title}</h1>
              <p className="text-xs font-normal text-black">Céline CLANET, 2023</p>
            </div>
          </div>
          <LanguagePicker lang={lang} onChange={setLang} />
        </div>

        {/* Info banner */}
        <div className="bg-[#ebf6ff] rounded-[8px] px-[10px] py-[10px] flex items-center gap-2">
          <LockIcon />
          <p className="text-xs font-normal text-black leading-snug">
            Audio continues when screen locks, keep it in your pocket
          </p>
        </div>
      </div>

      {/* ── Progress bar + transport controls ── */}
      <div className="flex flex-col gap-[18px] py-[12px] shrink-0">
        <ProgressBar currentTime={currentTime} duration={duration} onSeek={seek} />
        <AudioControls
          isPlaying={isPlaying}
          onToggle={isPlaying ? pause : play}
          onSkip={() => skipForward(15)}
          onReplay={replay}
        />
      </div>

      {/* ── Next Artwork card ── */}
      <div className="px-4 pb-4 shrink-0">
        <div className="bg-white border border-[#d6d6d6] rounded-[16px] px-10 py-3 flex items-center gap-6">
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-base font-bold text-black">Next Artwork</span>
            <span className="text-sm font-normal text-black truncate">
              Untitled Series No. 4 · Céline Clanet
            </span>
          </div>
          <ChevronRightIcon />
        </div>
      </div>

    </div>
  )
}
