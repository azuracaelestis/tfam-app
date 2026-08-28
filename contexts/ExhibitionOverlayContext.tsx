'use client'
import { usePathname } from 'next/navigation'
import { AnimatePresence } from 'motion/react'
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import ExhibitionOverlay from '@/components/ExhibitionOverlay'

// Namespaced by the surface the tap came from, not just the exhibition id —
// see ExhibitionOverlayContext usage sites: this is what keeps the R1 shared
// element (layoutId={`hero-${origin}-${id}`}) from matching the wrong source
// thumbnail when two surfaces that could show the same exhibition are mounted
// at once (e.g. mid tab-switch, Home and What's On both present for ~180ms).
export type Origin = 'whats-on' | 'carousel' | 'home' | 'map'

interface OverlayState {
  id: string
  origin: Origin
}

interface ExhibitionOverlayContextValue {
  open: (id: string, origin: Origin) => void
  close: () => void
  current: OverlayState | null
}

const ExhibitionOverlayContext = createContext<ExhibitionOverlayContextValue | null>(null)

export function useExhibitionOverlay() {
  const ctx = useContext(ExhibitionOverlayContext)
  if (!ctx) throw new Error('useExhibitionOverlay must be used within ExhibitionOverlayProvider')
  return ctx
}

export function ExhibitionOverlayProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<OverlayState | null>(null)
  const pathname = usePathname()
  // Tracks whether we've pushed a same-URL history entry for the CURRENTLY
  // open overlay, so close() knows whether there's an entry to consume and
  // the push effect below never double-pushes for one open/close cycle.
  const pushedRef = useRef(false)

  const open = useCallback((id: string, origin: Origin) => {
    setCurrent({ id, origin })
  }, [])

  const close = useCallback(() => {
    if (pushedRef.current) {
      pushedRef.current = false
      // Consumes the history entry pushed on open, via the popstate listener
      // below, so repeated open/close cycles don't grow history unbounded.
      window.history.back()
    } else {
      setCurrent(null)
    }
  }, [])

  // Hardware/browser back closes the overlay instead of leaving the app or
  // changing the URL: push a same-URL entry when it opens, and treat any
  // popstate while it's open as a close.
  useEffect(() => {
    if (!current) return
    window.history.pushState(null, '', window.location.href)
    pushedRef.current = true
    const onPopState = () => {
      pushedRef.current = false
      setCurrent(null)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
    // Keyed on whether the overlay is open, not on which exhibition — the
    // push must happen exactly once per open/close cycle, not once per id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current !== null])

  // The overlay must never strand itself on top of an unrelated screen:
  // BottomNav is z-40 and stays tappable while it's open, so a tab switch has
  // to close it. The route itself already changed via the router, so this
  // just clears our state without touching history.
  useEffect(() => {
    pushedRef.current = false
    setCurrent(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Only while the overlay is open — cleaned up on close via the effect return.
  useEffect(() => {
    if (!current) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [current])

  return (
    <ExhibitionOverlayContext.Provider value={{ open, close, current }}>
      {children}
      <AnimatePresence>
        {current && (
          <ExhibitionOverlay
            key={`${current.origin}-${current.id}`}
            id={current.id}
            origin={current.origin}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </ExhibitionOverlayContext.Provider>
  )
}
