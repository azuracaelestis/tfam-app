'use client'
import { useEffect, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useSkeletonEligible } from './PageTransitionWrapper'
import { PEER } from '@/lib/motion'

// How long the skeleton holds before crossfading to real content. Content
// here is always local and renders instantly — this is a deliberate beat,
// not a wait for data — sized to roughly match DEEPER's own 0.34s slide so
// the skeleton reads as part of the same arrival rather than a separate,
// noticeably-tacked-on step.
const SKELETON_HOLD_MS = 340
const SWAP_TRANSITION = PEER

/**
 * Shows `skeleton` for a fixed beat on a genuine "deeper"/"back" arrival at
 * a sub-screen (see useSkeletonEligible — never a bottom-nav tab, never the
 * shared-element `lift`/`mode` transitions, which already have their own
 * choreography), then crossfades to the real content. On any other kind of
 * render — a direct/fresh load of this route, a peer tab switch, back-nav
 * that lands on a tab — it renders `children` immediately with no skeleton,
 * no overlay, no delay at all.
 *
 * `children` stays in normal flow the entire time (it's what gives this
 * screen its real height); the skeleton is an opaque absolute overlay on
 * top of it, so however content underneath is rendering, the overlay fully
 * masks it until its own fade-out actually finishes — no dependence on
 * getting two independently-animated opacities to cross at exactly the
 * right moment. `inert` on whichever side is momentarily hidden keeps it
 * out of the tab order and the accessibility tree either way.
 */
export default function SkeletonReveal({ skeleton, children }: { skeleton: ReactNode; children: ReactNode }) {
  const eligible = useSkeletonEligible()
  const [showSkeleton, setShowSkeleton] = useState(eligible)

  useEffect(() => {
    if (!eligible) return
    const id = setTimeout(() => setShowSkeleton(false), SKELETON_HOLD_MS)
    return () => clearTimeout(id)
  }, [eligible])

  if (!eligible) return <>{children}</>

  return (
    <div className="relative">
      <div inert={showSkeleton} aria-hidden={showSkeleton}>
        {children}
      </div>
      <AnimatePresence>
        {showSkeleton && (
          <motion.div
            className="absolute inset-0 bg-white"
            exit={{ opacity: 0 }}
            transition={SWAP_TRANSITION}
          >
            {skeleton}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
