'use client'

function formatTime(secs: number): string {
  const s = Math.floor(Math.abs(secs))
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
  const remaining = duration > 0 ? duration - currentTime : 0

  return (
    <div className="flex flex-col gap-2 px-5">
      {/* Track + scrubber dot, stacked over invisible range input */}
      <div className="relative h-5 flex items-center">
        {/* Gray track */}
        <div className="absolute w-full h-[3px] bg-[#e5e5e5] rounded-full">
          {/* Filled portion */}
          <div
            className="h-full bg-black rounded-full transition-none"
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* Scrubber dot */}
        <div
          className="absolute w-[14px] h-[14px] bg-black rounded-full -translate-x-1/2 pointer-events-none"
          style={{ left: `${pct}%` }}
        />
        {/* Invisible range input for interaction */}
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
      {/* Time labels */}
      <div className="flex justify-between text-[10px] text-black">
        <span>{formatTime(currentTime)}</span>
        <span>-{formatTime(remaining)}</span>
      </div>
    </div>
  )
}
