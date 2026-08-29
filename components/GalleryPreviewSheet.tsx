'use client'
import { motion } from 'motion/react'
import { SHEET } from '@/lib/motion'
import { metaLine, type Exhibition } from '@/lib/exhibitions'

// Mirrors AudioInputSheet.tsx's slide-up pattern exactly — same backdrop/
// panel split, same content-settles-a-beat-later timing. See that file's
// header comment for why the backdrop uses its own faster curve instead of
// SHEET (which only ever times the panel).
const SCRIM_TRANSITION = { duration: 0.24, ease: 'easeOut' } as const
const CONTENT_ENTER = { duration: 0.22, ease: 'easeOut', delay: 0.12 } as const
const CONTENT_EXIT = { duration: 0.22, ease: 'easeOut' } as const

function InfoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="8.25" stroke="#0A0A0A" strokeWidth="1.5" />
      <path d="M12 11.25V16.25" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1.1" fill="#0A0A0A" />
    </svg>
  )
}

export default function GalleryPreviewSheet({
  exhibition,
  open,
  onClose,
  onMoreInfo,
}: {
  exhibition: Exhibition | null
  open: boolean
  onClose: () => void
  onMoreInfo: () => void
}) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-end overflow-hidden ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 0.5 : 0, transition: SCRIM_TRANSITION }}
        onClick={onClose}
      />

      {/* Sheet panel — always mounted, animate reacts to `open` (no
          AnimatePresence), same as AudioInputSheet. */}
      <motion.div
        className="relative bg-white rounded-t-[8px] pt-6 pb-6 px-5 flex flex-col font-noto"
        initial={{ y: '100%' }}
        animate={{ y: open ? 0 : '100%', transition: SHEET }}
      >
        <motion.div
          className="flex flex-col gap-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: open ? 1 : 0,
            y: open ? 0 : 8,
            transition: open ? CONTENT_ENTER : CONTENT_EXIT,
          }}
        >
          {exhibition && (
            <>
              <div className="flex items-start justify-between gap-4">
                <img
                  src={exhibition.image}
                  alt=""
                  className="w-[137px] h-[106px] rounded-lg object-cover shrink-0"
                />
                <div className="flex flex-col gap-[9px] flex-1 min-w-0 pt-0.5">
                  <p className="text-base font-bold text-[#0a0a0a] leading-normal">{exhibition.gallery}</p>
                  <p className="text-xl font-bold text-[#0a0a0a] leading-tight">{exhibition.title}</p>
                  <p className="text-sm text-[#4f4f4f] leading-normal">{metaLine(exhibition)}</p>
                </div>
              </div>

              <button
                onClick={onMoreInfo}
                className="w-full h-12 rounded-full border border-[#0a0a0a] flex items-center justify-center gap-2 text-base font-bold text-[#0a0a0a]"
              >
                <InfoIcon />
                More Info
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
