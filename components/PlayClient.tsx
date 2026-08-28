'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getArtworkByCode, getNextArtwork, type Language } from '@/lib/artworks'
import { useMockAudio } from '@/hooks/useMockAudio'
import { useOnTransitionComplete } from './PageTransitionWrapper'
import { DEEPER } from '@/lib/motion'
import { useTranslation } from '@/lib/useTranslation'
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

function FileTextIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M11.0833 1.58333H4.75C4.33007 1.58333 3.92735 1.75015 3.63041 2.04708C3.33348 2.34401 3.16667 2.74674 3.16667 3.16667V15.8333C3.16667 16.2533 3.33348 16.656 3.63041 16.9529C3.92735 17.2499 4.33007 17.4167 4.75 17.4167H14.25C14.6699 17.4167 15.0727 17.2499 15.3696 16.9529C15.6665 16.656 15.8333 16.2533 15.8333 15.8333V6.33333L11.0833 1.58333Z" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.0833 1.58333V6.33333H15.8333" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.6667 10.2917H6.33333" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.6667 13.4583H6.33333" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.91667 7.125H7.125H6.33333" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ExpandChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`transition-transform duration-200 ${expanded ? '-rotate-90' : 'rotate-90'}`}
    >
      <path d="M3 1.5L8 6L3 10.5" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function FastForwardIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10.2917 15.0417L17.4167 9.5L10.2917 3.95833V15.0417Z" fill="#4F4F4F"/>
      <path d="M1.58333 15.0417L8.70833 9.5L1.58333 3.95833V15.0417Z" fill="#4F4F4F"/>
    </svg>
  )
}

export default function PlayClient({ code }: { code: string }) {
  const router = useRouter()
  const t = useTranslation()
  const [lang, setLang] = useState<Language>('en')
  const [transcriptExpanded, setTranscriptExpanded] = useState(false)
  const artwork = getArtworkByCode(code)
  const nextArtwork = artwork ? getNextArtwork(artwork.code) : undefined

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
  // navigation, so onAnimationComplete never fires. Start shortly after the
  // slide-in transition would have completed in that case. /play is only ever
  // entered via a DEEPER or BACK navigation (both timed off DEEPER), so that's
  // the duration to key off — never PEER's, and never a retyped literal.
  const AUDIO_FALLBACK_MS = DEEPER.duration * 1000 + 50
  useEffect(() => {
    const id = setTimeout(() => {
      if (!artwork || audioStartedRef.current) return
      audioStartedRef.current = true
      play()
    }, AUDIO_FALLBACK_MS)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  if (!artwork) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6 text-center font-noto">
        <p className="text-tfam-dark font-semibold text-lg">{t.play.artworkNotFound}</p>
        <p className="text-tfam-mid text-sm">{t.play.artworkNotFoundDetail.replace('__CODE__', code)}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-2 px-6 py-3 rounded-2xl bg-black text-white font-medium text-sm"
        >
          {t.play.backToHome}
        </button>
      </div>
    )
  }

  const locale = artwork.locales[lang]
  const nextLocale = nextArtwork?.locales[lang]

  return (
    <div className="min-h-screen bg-white flex flex-col font-noto pb-[69px]">

      {/* ── Top bar: back chevron + "Audio Guide" title ── */}
      <header className="h-[60px] px-5 flex items-end pb-[10px] shrink-0">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-3"
          aria-label={t.play.backToHome}
        >
          <ChevronLeftIcon />
          <span className="text-[20px] font-bold text-black leading-none">{t.play.title}</span>
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
            <p className="text-xs font-normal text-[#4f4f4f]">{artwork.section} | {artwork.gallery}</p>
            <div className="flex flex-col gap-1">
              <h1 className="text-[24px] font-semibold text-black leading-tight">{locale.title}</h1>
              <p className="text-xs font-normal text-[#4f4f4f]">{artwork.artist}, {artwork.year}</p>
            </div>
          </div>
          <LanguagePicker lang={lang} onChange={setLang} />
        </div>

        {/* Info banner */}
        <div className="bg-[#ebf6ff] rounded-[8px] px-[10px] py-[10px] flex items-center gap-2">
          <LockIcon />
          <p className="text-xs font-normal text-black leading-snug">
            {t.play.infoBanner}
          </p>
        </div>
      </div>

      {/* ── Progress bar + transport controls ── */}
      <div className="flex flex-col gap-[18px] pt-[12px] shrink-0">
        <ProgressBar currentTime={currentTime} duration={duration} onSeek={seek} />
        <AudioControls
          isPlaying={isPlaying}
          onToggle={isPlaying ? pause : play}
          onSkip={() => skipForward(15)}
          onReplay={replay}
        />
      </div>

      {/* ── Transcript Preview ── */}
      <div className="px-5 pt-8 shrink-0">
        <div className="bg-white border border-[#ddd] rounded-[8px] px-3 py-5 flex gap-4">
          <FileTextIcon />
          <div className="flex flex-col gap-6 flex-1 min-w-0">
            <div className="flex flex-col gap-3">
              <p className="text-base font-semibold text-black">{t.play.transcriptPreview}</p>
              <p className={`text-sm text-[#4f4f4f] leading-5 ${transcriptExpanded ? '' : 'line-clamp-4'}`}>
                {locale.description}
              </p>
            </div>
            <button
              onClick={() => setTranscriptExpanded(v => !v)}
              className="flex items-center gap-2"
            >
              <span className="text-sm font-semibold text-black">
                {transcriptExpanded ? t.play.hideTranscript : t.play.readFullTranscript}
              </span>
              <ExpandChevron expanded={transcriptExpanded} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Next Artwork card ── */}
      {nextArtwork && nextLocale && (
        <div className="px-5 pt-8 pb-3 shrink-0">
          <button
            onClick={() => router.push('/play?code=' + nextArtwork.code)}
            className="w-full bg-white border border-[#d6d6d6] rounded-[8px] px-5 py-3 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="bg-[#d6d6d6] rounded-[8px] size-[37px] flex items-center justify-center shrink-0">
                <FastForwardIcon />
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="text-base font-bold text-black">{t.play.nextArtwork}</span>
                <span className="text-xs font-normal text-[#4f4f4f] truncate">
                  {nextLocale.title} · {nextArtwork.artist}
                </span>
              </div>
            </div>
            <ChevronRightIcon />
          </button>
        </div>
      )}

    </div>
  )
}
