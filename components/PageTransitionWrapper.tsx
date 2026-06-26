'use client'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react'

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

// Per-pathname instance: own listener set + motion.div + context provider.
// Keyed by pathname so each navigation gets a fresh instance — prevents
// the exiting page's onAnimationComplete from firing the entering page's listeners.
function AnimatedPage({ children }: { children: ReactNode }) {
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
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '-20%', opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        onAnimationComplete={notify}
      >
        {children}
      </motion.div>
    </TransitionContext.Provider>
  )
}

export default function PageTransitionWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="relative flex-1 overflow-hidden">
      <AnimatePresence mode="sync" initial={false}>
        <AnimatedPage key={pathname}>
          {children}
        </AnimatedPage>
      </AnimatePresence>
    </div>
  )
}
