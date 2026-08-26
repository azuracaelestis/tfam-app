'use client'
import { useState } from 'react'
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

function HeadphoneIcon({ size = 27 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 11V7C1 5.4087 1.63214 3.88258 2.75736 2.75736C3.88258 1.63214 5.4087 1 7 1C8.5913 1 10.1174 1.63214 11.2426 2.75736C12.3679 3.88258 13 5.4087 13 7V11" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 11.6666C13 12.0203 12.8595 12.3594 12.6095 12.6095C12.3594 12.8595 12.0203 13 11.6667 13H11C10.6464 13 10.3072 12.8595 10.0572 12.6095C9.80714 12.3594 9.66667 12.0203 9.66667 11.6666V9.66665C9.66667 9.31302 9.80714 8.97389 10.0572 8.72384C10.3072 8.47379 10.6464 8.33331 11 8.33331H13V11.6666ZM1 11.6666C1 12.0203 1.14048 12.3594 1.39052 12.6095C1.64057 12.8595 1.97971 13 2.33333 13H3C3.35362 13 3.69276 12.8595 3.94281 12.6095C4.19286 12.3594 4.33333 12.0203 4.33333 11.6666V9.66665C4.33333 9.31302 4.19286 8.97389 3.94281 8.72384C3.69276 8.47379 3.35362 8.33331 3 8.33331H1V11.6666Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function CloseButton({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-[30px] h-[30px] flex items-center justify-center rounded-full border border-hairline bg-white shrink-0 ${className}`}
      aria-label="Close"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M1 1L11 11M11 1L1 11" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </button>
  )
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
  const [mode, setMode] = useState<'qr' | 'manual'>('qr')

  const handleClose = () => {
    onClose()
    setMode('qr')
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-end overflow-hidden transition-all duration-300 ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          open ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Sheet panel */}
      <div
        className={`relative bg-white rounded-t-[32px] pt-6 pb-8 px-5 flex flex-col gap-6 font-noto transition-transform duration-300 ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <CloseButton onClick={handleClose} className="self-end" />

        {mode === 'qr' ? (
          <>
            {/* Header: icon + title + subtitle */}
            <div className="flex flex-col items-center gap-3 w-full -mt-2">
              <div className="bg-icon-bg rounded-[8px] size-[54px] flex items-center justify-center">
                <HeadphoneIcon />
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <h2 className="text-[20px] font-bold text-ink leading-normal">Audio Guide</h2>
                <p className="text-body-l text-ink max-w-[260px]">
                  Scan the QR code next to the artwork label to begin listening.
                </p>
              </div>
            </div>

            {/* QR viewfinder */}
            <button
              onClick={onQR}
              aria-label="Scan QR code"
              className="relative bg-icon-bg rounded-[8px] size-[362px] mx-auto shrink-0"
            >
              <img src="/qr-corner-frame.svg" alt="" className="absolute left-[32px] top-[40px] w-[291px] h-[41px]" />
              <img
                src="/qr-corner-frame.svg"
                alt=""
                className="absolute left-[32px] top-[284px] w-[291px] h-[41px] -scale-y-100"
              />
              <div className="absolute left-[130px] top-[108px] bg-white rounded-2xl size-[103px] flex items-center justify-center">
                <img src="/qr-scan-icon.svg" alt="" className="w-[68px] h-[68px]" />
              </div>
              <p className="absolute left-[70px] top-[226px] text-sm text-ink whitespace-nowrap">
                Point your camera at the QR code
              </p>
            </button>

            {/* Enter code manually */}
            <div className="flex flex-col gap-3 items-center w-full">
              <button
                onClick={() => setMode('manual')}
                className="w-full h-12 rounded-pill bg-white border border-ink flex items-center justify-center gap-2 text-label-l text-ink"
              >
                <HeadphoneIcon size={16} />
                Enter code manually
              </button>
              <p className="text-xs text-ink text-center">
                Use this if the label cannot be scanned.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Header: icon + title + subtitle */}
            <div className="flex flex-col items-center gap-3 w-full -mt-2">
              <div className="bg-icon-bg rounded-[8px] size-[54px] flex items-center justify-center">
                <HeadphoneIcon />
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <h2 className="text-[20px] font-bold text-ink leading-normal">Audio Guide</h2>
                <p className="text-label-m text-ink max-w-[260px]">
                  Find the number next to any artwork label and enter it below
                </p>
              </div>
            </div>

            {/* Artwork Code input section */}
            <div className="bg-white border border-hairline rounded-card h-[69px] flex items-center px-5 w-full">
              <div className="flex items-center gap-8 flex-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="text-[24px] font-semibold text-black w-6 text-center leading-none">
                    {i < code.length ? code[i] : '—'}
                  </span>
                ))}
              </div>
              <button onClick={onQR} className="shrink-0 ml-2 p-1" aria-label="Scan QR code">
                <img src="/scan-icon-small.svg" alt="" className="w-5 h-5" />
              </button>
            </div>

            {/* Numpad */}
            <Numpad onDigit={onDigit} onDelete={onDelete} />

            {/* Play button */}
            <button
              onClick={onPlay}
              disabled={code.length !== 4}
              className="w-full h-12 rounded-pill bg-black text-white text-label-l flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
            >
              <img src="/audio-headphone-white.svg" width={14} height={14} alt="" aria-hidden="true" />
              Play audio guide
            </button>

            <button
              onClick={() => setMode('qr')}
              className="text-xs text-ink-secondary text-center w-full"
            >
              Back to QR scan
            </button>
          </>
        )}
      </div>
    </div>
  )
}
