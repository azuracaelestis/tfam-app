'use client'

import { motion } from 'motion/react'

interface AudioControlsProps {
  isPlaying: boolean
  onToggle: () => void
  onSkip: () => void
  onReplay: () => void
}

function SkipBackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="27" height="38" fill="black" aria-hidden="true">
      <path d="M6 6h2v12H6zm3.5 6L18 6v12z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" aria-hidden="true">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}

function SkipForwardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="27" height="38" fill="black" aria-hidden="true">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  )
}

export default function AudioControls({
  isPlaying,
  onToggle,
  onSkip,
  onReplay,
}: AudioControlsProps) {
  return (
    <div className="flex items-center justify-center gap-[45px]">
      <button onClick={onReplay} aria-label="Previous / Replay from start">
        <SkipBackIcon />
      </button>

      <motion.button
        onClick={onToggle}
        className="w-14 h-14 rounded-full bg-black flex items-center justify-center active:opacity-80 transition-opacity"
        aria-label={isPlaying ? 'Pause' : 'Play'}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.15 }}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </motion.button>

      <button onClick={onSkip} aria-label="Skip forward">
        <SkipForwardIcon />
      </button>
    </div>
  )
}
