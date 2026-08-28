// Single source of truth for page/element transition timing. Every
// motion/react choreography in the app imports its duration + ease from
// here — never retype either inline, so retiming one thing can't
// silently desync something else that assumed the old numbers (e.g. the
// audio auto-play fallback in PlayClient).

export const PEER = { duration: 0.18, ease: 'linear' } as const

export const DEEPER = { duration: 0.34, ease: [0.32, 0.72, 0, 1] } as const

// Reserved — not yet consumed. Landing with R1 (LIFT), R4 (SHEET),
// R5 (MODE), R6 (STATE).
export const LIFT = { duration: 0.52, ease: [0.2, 0.85, 0.25, 1] } as const
export const SHEET = { duration: 0.38, ease: [0.32, 0.94, 0.36, 1] } as const
export const MODE = { duration: 0.62, ease: [0.22, 1, 0.3, 1] } as const
export const STATE = { duration: 0.22, ease: 'easeOut' } as const
