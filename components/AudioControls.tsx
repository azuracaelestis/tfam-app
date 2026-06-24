'use client'

interface AudioControlsProps {
  isPlaying: boolean
  onToggle: () => void
  onSkip: () => void
  onReplay: () => void
}

function ReplayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-tfam-dark" aria-hidden="true">
      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
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

function SkipIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-tfam-dark" aria-hidden="true">
      <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
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
    <div className="flex items-center justify-center gap-8 px-5 py-4">
      <button
        onClick={onReplay}
        className="flex flex-col items-center gap-1"
        aria-label="Replay from start"
      >
        <ReplayIcon />
        <span className="text-[10px] text-tfam-mid">Replay</span>
      </button>

      <button
        onClick={onToggle}
        className="w-16 h-16 rounded-full bg-tfam-red flex items-center justify-center shadow-md active:opacity-90 transition-opacity"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <button
        onClick={onSkip}
        className="flex flex-col items-center gap-1"
        aria-label="Skip forward 15 seconds"
      >
        <SkipIcon />
        <span className="text-[10px] text-tfam-mid">+15s</span>
      </button>
    </div>
  )
}
