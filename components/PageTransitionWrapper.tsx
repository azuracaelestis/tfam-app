'use client'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useIsPresent } from 'motion/react'
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react'
import { PEER, DEEPER, MODE } from '@/lib/motion'

type Listener = () => void

interface TransitionContextValue {
  subscribe: (fn: Listener) => () => void
  skeletonEligible: boolean
}

const TransitionContext = createContext<TransitionContextValue>({
  subscribe: () => () => {},
  skeletonEligible: false,
})

// Hook for page components to register a callback that fires once the
// enter animation completes (or immediately if no animation ran).
export function useOnTransitionComplete(fn: Listener) {
  const { subscribe } = useContext(TransitionContext)
  const fnRef = useRef(fn)
  fnRef.current = fn
  useEffect(() => subscribe(() => fnRef.current()), [subscribe])
}

// True only for a genuine sub-screen reached by pushing deeper or coming
// back — never a bottom-nav tab (even when a tab is the target of a 'back',
// e.g. Notifications -> Settings), and never 'lift' or 'mode', which already
// have their own shared-element choreography a skeleton would compete with.
// See SkeletonReveal.tsx for what consumes this.
export function useSkeletonEligible(): boolean {
  return useContext(TransitionContext).skeletonEligible
}

// The five bottom-nav destinations are peers with no hierarchy — matched
// exactly, not by prefix, so e.g. '/whats-on/[id]' is never mistaken for one.
const TAB_ROUTES = new Set(['/', '/whats-on', '/map', '/activities', '/settings'])

// The exact /activities <-> /activities/[id]/book pair, and no other segment
// depth — /activities/[id]/book/confirm is one level further and must stay a
// plain DEEPER push. This is R1-b: the activity card contracts into the
// booking screen's summary chip instead of expanding into a room.
const BOOK_PATTERN = /^\/activities\/[^/]+\/book$/

// /book/confirm and /book/confirmed sit at the same path depth (4), so the
// generic depth fallback below can't tell them apart and was defaulting both
// directions to 'peer' — the submit that actually completes a booking read
// as a tab-switch cross-dissolve. Same carve-out shape as BOOK_PATTERN above,
// checked before the depth fallback.
const CONFIRM_PATTERN = /^\/activities\/[^/]+\/book\/confirm$/
const CONFIRMED_PATTERN = /^\/activities\/[^/]+\/book\/confirmed$/

// /play is R5, "Mode change" — deliberately the rarest, heaviest move in the
// system. A fixed literal path, not a pattern: no other route should ever
// classify this way. Both directions map to the same 'mode' label (see
// exitVariants below for why that's still asymmetric in practice).
type Direction = 'peer' | 'deeper' | 'back' | 'lift' | 'mode'

function depth(path: string): number {
  return path.split('/').filter(Boolean).length
}

function classify(prev: string, next: string): Direction {
  if (next === '/play') return 'mode'
  if (prev === '/play') return 'mode'
  if (prev === '/activities' && BOOK_PATTERN.test(next)) return 'lift'
  if (BOOK_PATTERN.test(prev) && next === '/activities') return 'lift'
  if (CONFIRM_PATTERN.test(prev) && CONFIRMED_PATTERN.test(next)) return 'deeper'
  if (CONFIRMED_PATTERN.test(prev) && CONFIRM_PATTERN.test(next)) return 'back'
  if (TAB_ROUTES.has(prev) && TAB_ROUTES.has(next)) return 'peer'
  const prevDepth = depth(prev)
  const nextDepth = depth(next)
  if (nextDepth > prevDepth) return 'deeper'
  if (nextDepth < prevDepth) return 'back'
  return 'peer'
}

// 'lift' applies no transform of any kind — the wrapper is a no-op
// pass-through. It's an ancestor of both the source card and the destination
// chip, so any slide/fade it applied would compound with Motion's own
// layout-projection math for the shared layoutId element living inside it.
// The chip and the per-page content-delay fades do all the visible work.
//
// 'mode' gets the SAME inert entrance treatment for the same reason: the
// entering /play root is doing its own layoutId-driven grow (the button
// becoming the player), and a wrapper-level transform here would compound
// with that. But unlike 'lift', 'mode' is NOT a no-op on exit — see
// exitVariants below.
function initialFor(direction: Direction) {
  if (direction === 'lift' || direction === 'mode') return false
  if (direction === 'deeper') return { x: '100%', opacity: 1 }
  if (direction === 'back') return { x: '-28%', opacity: 0.45 }
  return { opacity: 0 }
}

function animateFor(direction: Direction) {
  if (direction === 'lift' || direction === 'mode') return {}
  if (direction === 'peer') return { opacity: 1, transition: PEER }
  return { x: 0, opacity: 1, transition: DEEPER }
}

// Only `exit` needs to be a variant FUNCTION (see note below) — variant
// functions can only be referenced via a `variants` object + label, not
// passed directly as a prop, so this is the one case that keeps that shape.
const exitVariants = {
  exit: (direction: Direction) => {
    if (direction === 'lift') return {}
    // The page being left behind (or left behind by /play arriving) has no
    // competing layoutId animation on its own side, so — unlike 'lift' — the
    // wrapper is free to actually fall back and dim: real motion, not a
    // pass-through. Reference values from the prototype, not approximations.
    if (direction === 'mode') return { scale: 0.92, opacity: 0.25, filter: 'brightness(0.4)', transition: MODE }
    if (direction === 'deeper') return { x: '-28%', opacity: 0.45, transition: DEEPER }
    if (direction === 'back') return { x: '100%', opacity: 1, transition: DEEPER }
    return { opacity: 0, transition: PEER }
  },
}

// Per-navigation instance: own listener set + motion.div + context provider.
// Keyed by pathname *plus a navigation nonce* — not pathname alone — so each
// navigation gets a genuinely fresh instance. Pathname alone breaks on an
// A -> B -> A round trip on a slow exit (e.g. 'mode', 620ms): if the visitor
// returns to A before its still-mounted, mid-exit instance has been pruned,
// React reconciles the new render against that SAME pending-exit fiber
// instead of mounting a new one (matching key = same fiber, by React's own
// rules — AnimatePresence only prunes an exiting child, it doesn't force a
// new key to get a new instance). Since `initial` only ever applies at a
// TRUE mount, that reused instance keeps whatever live values its exit had
// already animated to (e.g. opacity 0.25, scale 0.92) — permanently, because
// nothing in the update path resets them. Bumping the nonce on every
// pathname change makes the key different even on a revisit, so this case
// can never reconcile against a stale instance — guaranteed fresh mount,
// guaranteed correct `initial`. (Also still prevents the exiting page's
// onAnimationComplete from firing the entering page's listeners, as before.)
//
// `direction` is read two different ways here, and that split is load-bearing:
// initial/animate use the plain `direction` prop, because this component only
// re-renders (with a fresh, correct prop) while it's the current entering page.
// `exit` is instead a variant FUNCTION whose argument comes from AnimatePresence's
// `custom` prop — motion/react resolves exit-variant functions against that
// context value specifically so an already-exiting element (whose own props are
// frozen at whatever they were when it was mounted, since React no longer
// re-renders it once it's dropped from the tree) can still learn the direction
// of the navigation that is removing it right now.
function AnimatedPage({ children, direction, skeletonEligible }: { children: ReactNode; direction: Direction; skeletonEligible: boolean }) {
  const listenersRef = useRef(new Set<Listener>())
  const hasEnteredRef = useRef(false)
  // AnimatePresence keeps an exiting page mounted (opacity fading toward 0,
  // per exitVariants above) for however long its exit transition takes —
  // during that whole window it was staying fully focusable and readable by
  // a screen reader, an invisible duplicate of whatever's entering. `inert`
  // pulls it out of both tab order and the accessibility tree for exactly
  // that window; `useIsPresent` flips false the instant AnimatePresence
  // starts this exit, no separate timer to keep in sync with the fade.
  const isPresent = useIsPresent()

  const subscribe = useCallback((fn: Listener) => {
    listenersRef.current.add(fn)
    return () => { listenersRef.current.delete(fn) }
  }, [])

  // Only fires once per instance: the enter animation.
  // onAnimationComplete also fires for exit, but hasEnteredRef blocks it.
  const notify = useCallback(() => {
    if (hasEnteredRef.current) return
    hasEnteredRef.current = true
    listenersRef.current.forEach(fn => fn())
  }, [])

  return (
    <TransitionContext.Provider value={{ subscribe, skeletonEligible }}>
      <motion.div
        className="absolute inset-0 overflow-y-auto"
        initial={initialFor(direction)}
        animate={animateFor(direction)}
        variants={exitVariants}
        exit="exit"
        onAnimationComplete={notify}
        inert={!isPresent}
        aria-hidden={!isPresent || undefined}
      >
        {children}
      </motion.div>
    </TransitionContext.Provider>
  )
}

export default function PageTransitionWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const prevPathnameRef = useRef(pathname)
  const direction = classify(prevPathnameRef.current, pathname)
  const skeletonEligible = (direction === 'deeper' || direction === 'back') && !TAB_ROUTES.has(pathname)

  // Bumped once per actual pathname change (see navKeyRef below) — read
  // during render, so the very same navigation's key stays stable across
  // that navigation's re-renders, but the NEXT distinct pathname change
  // always gets a new value, even if it revisits a pathname seen before.
  const navKeyRef = useRef(0)

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      navKeyRef.current += 1
    }
    prevPathnameRef.current = pathname
  }, [pathname])

  return (
    <div className="relative flex-1 overflow-hidden">
      <AnimatePresence mode="sync" initial={false} custom={direction}>
        <AnimatedPage key={`${pathname}-${navKeyRef.current}`} direction={direction} skeletonEligible={skeletonEligible}>
          {children}
        </AnimatedPage>
      </AnimatePresence>
    </div>
  )
}
