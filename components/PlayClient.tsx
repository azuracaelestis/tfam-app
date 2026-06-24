'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getArtworkByCode, type Language } from '@/lib/artworks'
import { useAudio } from '@/hooks/useAudio'
import ArtworkCard from './ArtworkCard'
import AudioControls from './AudioControls'
import ProgressBar from './ProgressBar'
import LanguagePicker from './LanguagePicker'

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-tfam-dark" aria-hidden="true">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  )
}

export default function PlayClient({ code }: { code: string }) {
  const router = useRouter()
  const [lang, setLang] = useState<Language>('en')
  const artwork = getArtworkByCode(code)

  const { isPlaying, currentTime, duration, play, pause, seek, replay, skipForward } = useAudio(
    artwork?.audioSrc ?? '',
  )

  // Auto-play on mount
  useEffect(() => {
    if (artwork) play()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!artwork) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-tfam-dark font-semibold text-lg">Artwork not found</p>
        <p className="text-tfam-mid text-sm">Code &ldquo;{code}&rdquo; doesn&apos;t match any artwork in this guide.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-2 px-6 py-3 rounded-2xl bg-tfam-red text-white font-medium text-sm"
        >
          Back to Home
        </button>
      </div>
    )
  }

  const locale = artwork.locales[lang]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => router.push('/')}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-tfam-light"
          aria-label="Back to Home"
        >
          <BackIcon />
        </button>
        <span className="text-xs font-medium text-tfam-mid tracking-widest uppercase">
          Audio Guide
        </span>
        <LanguagePicker lang={lang} onChange={setLang} />
      </div>

      {/* Artwork image + info */}
      <ArtworkCard
        title={locale.title}
        description={locale.description}
        imageUrl={artwork.imageUrl}
      />

      {/* Divider */}
      <div className="mx-5 border-t border-tfam-border" />

      {/* Audio controls */}
      <div className="flex flex-col mt-2">
        <ProgressBar currentTime={currentTime} duration={duration} onSeek={seek} />
        <AudioControls
          isPlaying={isPlaying}
          onToggle={isPlaying ? pause : play}
          onSkip={() => skipForward(15)}
          onReplay={replay}
        />
      </div>

      {/* Artwork code badge */}
      <div className="flex justify-center pb-8">
        <span className="text-xs text-tfam-mid bg-tfam-light px-3 py-1 rounded-full">
          Code {code}
        </span>
      </div>
    </div>
  )
}
