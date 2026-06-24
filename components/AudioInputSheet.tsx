'use client'
import Numpad from './Numpad'

interface AudioInputSheetProps {
  code: string
  onDigit: (d: string) => void
  onDelete: () => void
  onClose: () => void
  onPlay: () => void
  onQR: () => void
  open: boolean
}

export default function AudioInputSheet({
  code,
  onDigit,
  onDelete,
  onClose,
  onPlay,
  onQR,
  open,
}: AudioInputSheetProps) {
  return (
    /* Full-screen container — always in DOM for the CSS transition */
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-end transition-all duration-300 ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          open ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Sheet panel */}
      <div
        className={`relative bg-white rounded-t-3xl px-5 pt-5 pb-8 flex flex-col gap-5 transition-transform duration-300 ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle + header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-tfam-light"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-tfam-dark" aria-hidden="true">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
          <span className="text-sm font-medium text-tfam-mid">Enter Artwork Code</span>
          <div className="w-8" />
        </div>

        {/* 4-digit display */}
        <div className="flex justify-center gap-3">
          {Array.from({ length: 4 }).map((_, i) => {
            const filled = i < code.length
            return (
              <div
                key={i}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold border-2 transition-colors ${
                  filled
                    ? 'border-tfam-red bg-red-50 text-tfam-red'
                    : 'border-tfam-border bg-tfam-light text-transparent'
                }`}
              >
                {filled ? code[i] : '–'}
              </div>
            )
          })}
        </div>

        {/* Numpad */}
        <Numpad onDigit={onDigit} onDelete={onDelete} onQR={onQR} />

        {/* CTA */}
        <button
          onClick={onPlay}
          disabled={code.length !== 4}
          className="w-full h-14 rounded-2xl bg-tfam-red text-white font-semibold text-base disabled:opacity-40 transition-opacity"
        >
          Play Audio Guide
        </button>
      </div>
    </div>
  )
}
