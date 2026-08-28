'use client'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react'
import { PEER, DEEPER } from '@/lib/motion'

type Listener = () => void

interface TransitionContextValue {
  subscribe: (fn: Listener) => () => void
}

const TransitionContext = createContext<TransitionContextValue>({
  subscribe: () => () => {},
})

// Hook for page components to register a callback that fires once the
// enter animation completes (or immediately if no animation ran).
export function useOnTransitionComplete(fn: Listener) {
  const { subscribe } = useContext(TransitionContext)
  const fnRef = useRef(fn)
  fnRef.current = fn
  useEffect(() => subscribe(() => fnRef.current()), [subscribe])
}

// The five bottom-nav destinations are peers with no hierarchy — matched
// exactly, not by prefix, so e.g. '/whats-on/[id]' is never mistaken for one.
const TAB_ROUTES = new Set(['/', '/whats-on', '/map', '/activities', '/settings'])

type Direction = 'peer' | 'deeper' | 'back'

function depth(path: string): number {
  return path.split('/').filter(Boolean).length
}

function classify(prev: string, next: string): Direction {
  if (TAB_ROUTES.has(prev) && TAB_ROUTES.has(next)) return 'peer'
  const prevDepth = depth(prev)
  const nextDepth = depth(next)
  if (nextDepth > prevDepth) return 'deeper'
  if (nextDepth < prevDepth) return 'back'
  return 'peer'
}

function initialFor(direction: Direction) {
  if (direction === 'deeper') return { x: '100%', opacity: 1 }
  if (direction === 'back') return { x: '-28%', opacity: 0.45 }
  return { opacity: 0 }
}

function animateFor(direction: Direction) {
  if (direction === 'peer') return { opacity: 1, transition: PEER }
  return { x: 0, opacity: 1, transition: DEEPER }
}

// Only `exit` needs to be a variant FUNCTION (see note below) — variant
// functions can only be referenced via a `variants` object + label, not
// passed directly as a prop, so this is the one case that keeps that shape.
const exitVariants = {
  exit: (direction: Direction) => {
    if (direction === 'deeper') return { x: '-28%', opacity: 0.45, transition: DEEPER }
    if (direction === 'back') return { x: '100%', opacity: 1, transition: DEEPER }
    return { opacity: 0, transition: PEER }
  },
}

// Per-pathname instance: own listener set + motion.div + context provider.
// Keyed by pathname so each navigation gets a fresh instance — prevents
// the exiting page's onAnimationComplete from firing the entering page's listeners.
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
function AnimatedPage({ children, direction }: { children: ReactNode; direction: Direction }) {
  const listenersRef = useRef(new Set<Listener>())
  const hasEnteredRef = useRef(false)

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
    <TransitionContext.Provider value={{ subscribe }}>
      <motion.div
        className="absolute inset-0 overflow-y-auto"
        initial={initialFor(direction)}
        animate={animateFor(direction)}
        variants={exitVariants}
        exit="exit"
        onAnimationComplete={notify}
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

  useEffect(() => {
    prevPathnameRef.current = pathname
  }, [pathname])

  return (
    <div className="relative flex-1 overflow-hidden">
      <AnimatePresence mode="sync" initial={false} custom={direction}>
        <AnimatedPage key={pathname} direction={direction}>
          {children}
        </AnimatedPage>
      </AnimatePresence>
    </div>
  )
}
