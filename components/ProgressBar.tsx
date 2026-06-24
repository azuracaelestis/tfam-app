'use client'

function formatTime(secs: number): string {
  const s = Math.floor(secs)
  const m = Math.floor(s / 60)
  const rem = s % 60
  return `${m}:${rem.toString().padStart(2, '0')}`
}

interface ProgressBarProps {
  currentTime: number
  duration: number
  onSeek: (t: number) => void
}

export default function ProgressBar({ currentTime, duration, onSeek }: ProgressBarProps) {
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="flex flex-col gap-2 px-5">
      {/* Visual track + invisible range input stacked */}
      <div className="relative h-5 flex items-center">
        <div className="absolute w-full h-1 bg-tfam-border rounded-full">
          <div
            className="h-full bg-tfam-red rounded-full transition-none"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={duration || 1}
          step={0.1}
          value={currentTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="absolute w-full h-5 opacity-0 cursor-pointer"
          aria-label="Seek"
        />
      </div>
      <div className="flex justify-between text-xs text-tfam-mid">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}
