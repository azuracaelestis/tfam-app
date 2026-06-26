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

function HeadphoneIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 11V7C1 5.4087 1.63214 3.88258 2.75736 2.75736C3.88258 1.63214 5.4087 1 7 1C8.5913 1 10.1174 1.63214 11.2426 2.75736C12.3679 3.88258 13 5.4087 13 7V11" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 11.6666C13 12.0203 12.8595 12.3594 12.6095 12.6095C12.3594 12.8595 12.0203 13 11.6667 13H11C10.6464 13 10.3072 12.8595 10.0572 12.6095C9.80714 12.3594 9.66667 12.0203 9.66667 11.6666V9.66665C9.66667 9.31302 9.80714 8.97389 10.0572 8.72384C10.3072 8.47379 10.6464 8.33331 11 8.33331H13V11.6666ZM1 11.6666C1 12.0203 1.14048 12.3594 1.39052 12.6095C1.64057 12.8595 1.97971 13 2.33333 13H3C3.35362 13 3.69276 12.8595 3.94281 12.6095C4.19286 12.3594 4.33333 12.0203 4.33333 11.6666V9.66665C4.33333 9.31302 4.19286 8.97389 3.94281 8.72384C3.69276 8.47379 3.35362 8.33331 3 8.33331H1V11.6666Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function QRScanIcon() {
  return (
    <svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 8V3H9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 8V3H17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 14V19H9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 14V19H17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
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
        onClick={onClose}
      />

      {/* Sheet panel */}
      <div
        className={`relative bg-[#f5f5f5] rounded-t-3xl pt-[22px] pb-8 px-4 flex flex-col gap-6 font-noto transition-transform duration-300 ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* X close button */}
        <button
          onClick={onClose}
          className="absolute top-[22px] left-4 w-[30px] h-[30px] flex items-center justify-center rounded-full border border-[#d9d9d9] bg-white"
          aria-label="Close"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M1 1L11 11M11 1L1 11" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Header: icon + title + subtitle */}
        <div className="flex flex-col items-center gap-3 mt-8">
          <div className="bg-[#e4e4e4] rounded-[8px] w-[54px] h-[54px] flex items-center justify-center">
            <HeadphoneIcon />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <h2 className="text-[24px] font-bold text-black leading-normal">Audio Guide</h2>
            <p className="text-sm font-normal text-tfam-mid leading-snug max-w-[260px]">
              Find the number next to any artwork label and enter it below
            </p>
          </div>
        </div>

        {/* Artwork Code input section */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-black">Artwork Code</p>
          <div className="bg-white border border-[#d9d9d9] rounded-2xl h-[69px] flex items-center px-5">
            {/* 4 digit / dash slots */}
            <div className="flex items-center gap-8 flex-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className="text-[24px] font-semibold text-black w-6 text-center leading-none">
                  {i < code.length ? code[i] : '—'}
                </span>
              ))}
            </div>
            {/* QR scan */}
            <button onClick={onQR} className="shrink-0 ml-2 p-1" aria-label="Scan QR code">
              <QRScanIcon />
            </button>
          </div>
        </div>

        {/* Numpad */}
        <Numpad onDigit={onDigit} onDelete={onDelete} />

        {/* Play button */}
        <button
          onClick={onPlay}
          disabled={code.length !== 4}
          className="w-full h-12 rounded-[80px] bg-black text-white font-bold text-base flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
        >
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M1 1L9 6L1 11V1Z" fill="white" stroke="white" strokeWidth="1" strokeLinejoin="round"/>
          </svg>
          Play audio guide
        </button>
      </div>
    </div>
  )
}
