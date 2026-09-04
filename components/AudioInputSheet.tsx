'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'motion/react'
import Numpad from './Numpad'
import { getArtworkByCode } from '@/lib/artworks'
import { useTranslation } from '@/lib/useTranslation'
import { SHEET, MODE } from '@/lib/motion'

const SHEET_TITLE_ID = 'audio-guide-sheet-title'

// Walks from `target` up to <body>, marking every sibling along the way
// inert — this sheet isn't portaled (it's just a `fixed` sibling wherever
// its two consumers, HomeClient and ExhibitionOverlay, happen to render
// it), so there's no single "background root" node to hand off to a
// library; walking the ancestor chain finds one without needing to know
// either consumer's DOM shape. Returns a cleanup that undoes exactly the
// elements this call touched — one already inert for an unrelated reason
// is left alone, both going in and on cleanup.
function hideOthers(target: Element | null): () => void {
  if (!target) return () => {}
  const madeInert: Element[] = []
  let node: Element | null = target
  while (node && node !== document.body) {
    const parent: Element | null = node.parentElement
    if (parent) {
      Array.from(parent.children).forEach(sibling => {
        if (sibling !== node && !sibling.hasAttribute('inert')) {
          sibling.setAttribute('inert', '')
          madeInert.push(sibling)
        }
      })
    }
    node = parent
  }
  return () => {
    madeInert.forEach(el => el.removeAttribute('inert'))
  }
}

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
      className={`relative w-[30px] h-[30px] flex items-center justify-center rounded-full border border-hairline bg-white shrink-0 before:content-[''] before:absolute before:-inset-[8px] ${className}`}
      aria-label="Close"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M1 1L11 11M11 1L1 11" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </button>
  )
}

// Component-local timing — mirrors the CONTENT_ENTER/CONTENT_EXIT pattern in
// ExhibitionOverlay.tsx. The backdrop fades on its own, faster, 240ms curve —
// NOT the SHEET token, which only times the panel (and the parent recede,
// owned by this component's two consumers). The sheet's own content settles
// in a beat after the panel arrives, same principle as R1's content-delay fade.
const SCRIM_TRANSITION = { duration: 0.24, ease: 'easeOut' } as const
const CONTENT_ENTER = { duration: 0.22, ease: 'easeOut', delay: 0.12 } as const
const CONTENT_EXIT = { duration: 0.22, ease: 'easeOut' } as const

export default function AudioInputSheet({
  code,
  onDigit,
  onDelete,
  onClose,
  onPlay,
  onQR,
  open,
}: AudioInputSheetProps) {
  const t = useTranslation()
  const [mode, setMode] = useState<'qr' | 'manual'>('qr')
  const [invalidCode, setInvalidCode] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  // Editing the code (even by one digit) is the visitor acting on the
  // error — clear it immediately rather than waiting for another Play tap,
  // so the message doesn't linger over digits it no longer describes.
  useEffect(() => {
    setInvalidCode(false)
  }, [code])

  const handlePlayClick = () => {
    if (code.length !== 4) return
    if (getArtworkByCode(code)) {
      onPlay()
    } else {
      setInvalidCode(true)
    }
  }

  const handleClose = useCallback(() => {
    onClose()
    setMode('qr')
  }, [onClose])

  // Move focus into the sheet on open; on close, undo everything in the
  // order that makes the trigger focusable again BEFORE trying to focus
  // it — restoring focus while it's still `inert` is a silent no-op, so
  // this has to be one effect (cleanups run top-to-bottom, same as the
  // effects that registered them) rather than separate ones that could
  // race in the wrong order.
  useEffect(() => {
    if (!open) return
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    const restoreInert = hideOthers(rootRef.current)
    panelRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
      restoreInert()
      previouslyFocusedRef.current?.focus()
    }
  }, [open])

  // Escape dismisses, same as tapping the backdrop or the close button.
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, handleClose])

  return (
    <div
      ref={rootRef}
      className={`fixed inset-0 z-50 flex flex-col justify-end overflow-hidden ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      // Closed just means translated off-screen at opacity:0 — the sheet is
      // "always mounted" (see the panel's own comment below) so its close
      // animation has something to animate from next time it opens. Without
      // this, its three controls (Close, Scan QR code, Enter code manually)
      // stay in the tab order and the accessibility tree indefinitely, on
      // every screen that renders this component, whether or not anyone's
      // ever opened it. Same inert + aria-hidden pairing as the page
      // transition's outgoing-screen fix — not animation-gated, since ax
      // tree membership isn't something a sighted visitor perceives.
      inert={!open}
      aria-hidden={!open || undefined}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 0.5 : 0, transition: SCRIM_TRANSITION }}
        onClick={handleClose}
      />

      {/* Sheet panel — always mounted, animate reacts to `open` (no
          AnimatePresence) so this stays a plain animate-prop toggle.
          Fixed height (not content-driven) so the sheet reads as a
          consistent portion of a phone viewport instead of growing to cover
          the full screen. Sized so both modes' content fits without an
          internal scroll — see the `shrink-0` note below for why that
          matters more than just "make it tall enough". */}
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={SHEET_TITLE_ID}
        tabIndex={-1}
        className="relative bg-white rounded-t-[32px] pt-4 pb-6 px-5 flex flex-col gap-4 font-noto h-[650px] max-h-[75vh] outline-none"
        initial={{ y: '100%' }}
        animate={{ y: open ? 0 : '100%', transition: SHEET }}
      >
        <CloseButton onClick={handleClose} className="self-end shrink-0" />

        {/* Content assembles a beat after the panel — mode-switching (qr <->
            manual) doesn't touch `open`, so it can't retrigger this.
            `shrink-0` on every direct child below is load-bearing: without
            it, flexbox's default min-height:auto + this wrapper's
            overflow-y-auto silently COMPRESS children below their coded
            size (e.g. an h-12 button rendering at half height) instead of
            the wrapper actually scrolling. overflow-y-auto stays only as a
            safety net for content that doesn't fit despite that. */}
        <motion.div
          className="flex flex-col gap-3 overflow-y-auto"
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: open ? 1 : 0,
            y: open ? 0 : 8,
            transition: open ? CONTENT_ENTER : CONTENT_EXIT,
          }}
        >
        {mode === 'qr' ? (
          <>
            {/* Header: icon + title + subtitle */}
            <div className="flex flex-col items-center gap-2 w-full -mt-2 shrink-0">
              <div className="bg-icon-bg rounded-[8px] size-[54px] flex items-center justify-center">
                <HeadphoneIcon />
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <h2 id={SHEET_TITLE_ID} className="text-[20px] font-bold text-ink leading-normal">Audio Guide</h2>
                <p className="text-label-m text-ink max-w-[260px]">
                  Scan the QR code next to the artwork label to begin listening.
                </p>
              </div>
            </div>

            {/* QR viewfinder — R5: this button becomes the player (mode-player
                layoutId, shared with the manual Play pill and inline QR icon
                below, and with PlayClient's own root). Only one of qr/manual
                is ever mounted, and only one AudioInputSheet is ever open at
                once, so a single constant id is safe — no origin-namespacing
                needed the way R1's hero-${origin}-${id} required. */}
            <motion.button
              layoutId="mode-player"
              transition={MODE}
              onClick={onQR}
              aria-label="Scan QR code"
              className="relative bg-icon-bg rounded-[8px] size-[240px] mx-auto shrink-0"
            >
              <img src="/qr-corner-frame.svg" alt="" className="absolute left-[21px] top-[27px] w-[193px] h-[27px]" />
              <img
                src="/qr-corner-frame.svg"
                alt=""
                className="absolute left-[21px] top-[188px] w-[193px] h-[27px] -scale-y-100"
              />
              <div className="absolute left-[86px] top-[72px] bg-white rounded-2xl size-[68px] flex items-center justify-center">
                <img src="/qr-scan-icon.svg" alt="" className="w-[45px] h-[45px]" />
              </div>
              <p className="absolute left-[46px] top-[150px] text-[9px] text-ink whitespace-nowrap">
                Point your camera at the QR code
              </p>
            </motion.button>

            {/* Enter code manually — mt-3 adds 12px on top of the content
                wrapper's own gap-3, so this section sits noticeably further
                from the QR box than the header-to-QR spacing above it. */}
            <div className="flex flex-col gap-2 items-center w-full shrink-0 mt-3">
              <button
                onClick={() => setMode('manual')}
                className="w-full h-12 rounded-pill bg-white border border-ink flex items-center justify-center gap-2 text-label-l text-ink shrink-0"
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
            <div className="flex flex-col items-center gap-2 w-full -mt-2 shrink-0">
              <div className="bg-icon-bg rounded-[8px] size-[54px] flex items-center justify-center">
                <HeadphoneIcon />
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <h2 id={SHEET_TITLE_ID} className="text-[20px] font-bold text-ink leading-normal">Audio Guide</h2>
                <p className="text-label-m text-ink max-w-[260px]">
                  Find the number next to any artwork label and enter it below
                </p>
              </div>
            </div>

            {/* Artwork Code input section */}
            <div className="bg-white border border-hairline rounded-card h-[69px] flex items-center px-5 w-full shrink-0">
              <div className="flex items-center justify-center gap-8 flex-1" role="status">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="text-[24px] font-semibold text-black w-6 text-center leading-none">
                    {i < code.length ? code[i] : '—'}
                  </span>
                ))}
              </div>
              {/* Same mode-player treatment as the QR viewfinder above — its
                  shape makes for a more dramatic size change into the player,
                  which is expected, not a bug (same principle as R1-b's
                  crop-shift note). */}
              <motion.button layoutId="mode-player" transition={MODE} onClick={onQR} className="shrink-0 ml-2 p-1" aria-label="Scan QR code">
                <img src="/scan-icon-small.svg" alt="" className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Inline error — an unrecognised code used to replace this
                entire screen with a full-page dead end (only "Back to
                Home", no way to retry). Showing it here instead keeps the
                keypad on screen with the digits still there to edit, and
                role="alert" announces it the moment it appears. */}
            {invalidCode && (
              <div role="alert" className="bg-[#fdecea] border border-[#f3b4ac] rounded-card px-4 py-1 shrink-0">
                <p className="text-xs text-[#8a2c22] leading-snug">
                  {t.play.artworkNotFoundDetail.replace('__CODE__', code)}
                </p>
              </div>
            )}

            {/* Numpad — sized down from its 60px/14px default so the whole
                pad fits this sheet's fixed height alongside everything else,
                without the wrapper needing to scroll. */}
            <div className="shrink-0">
              <Numpad onDigit={onDigit} onDelete={onDelete} keySize={44} gap={4} />
            </div>

            {/* Play button — same h-12 as "Enter code manually" in QR mode,
                deliberately kept in sync so the two primary actions read as
                the same weight across modes. */}
            <motion.button
              layoutId="mode-player"
              transition={MODE}
              onClick={handlePlayClick}
              disabled={code.length !== 4}
              className="w-full h-12 rounded-pill bg-black text-white text-label-l flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity shrink-0"
            >
              <img src="/audio-headphone-white.svg" width={14} height={14} alt="" aria-hidden="true" />
              Play audio guide
            </motion.button>

            <button
              onClick={() => setMode('qr')}
              // Invisible hit-slop, not real padding: this sheet's fixed
              // height is already tightly budgeted (see the shrink-0 note
              // above) to fit both modes without scrolling — extra layout
              // padding here would blow that budget, so the tap target
              // grows without the row itself growing.
              className="relative text-xs text-ink-secondary text-center w-full shrink-0 before:content-[''] before:absolute before:-inset-y-[14px] before:inset-x-0"
            >
              Back to QR scan
            </button>
          </>
        )}
        </motion.div>
      </motion.div>
    </div>
  )
}
