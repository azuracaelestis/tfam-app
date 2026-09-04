'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from '@/lib/useTranslation'
import { useExhibitionOverlay } from '@/contexts/ExhibitionOverlayContext'

// Standalone timing for the active-tab indicator, not lib/motion.ts's STATE —
// unlike the FloorSwitcher/Activities filter pills, a real route change is
// happening underneath this (handled separately by PageTransitionWrapper's
// R2 peer cross-dissolve), so it isn't the same relationship as those two
// same-screen-state pills and shouldn't silently inherit their token.
const INDICATOR_GLIDE = { duration: 0.22, ease: [0.3, 0.85, 0.3, 1] } as const

const ITEMS = [
  { key: 'home',       icon: 'bottom-nav-home.svg',       w: 16, h: 17, href: '/' },
  { key: 'whatsOn',    icon: 'bottom-nav-whats-on.svg',   w: 17, h: 17, href: '/whats-on' },
  { key: 'map',        icon: 'bottom-nav-map.svg',        w: 19, h: 17, href: '/map' },
  { key: 'activities', icon: 'bottom-nav-activities.svg', w: 21, h: 17, href: '/activities' },
  { key: 'settings',   icon: 'bottom-nav-setting.svg',    w: 17, h: 17, href: '/settings' },
] as const

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslation()
  const { current, close } = useExhibitionOverlay()
  // Set when a tab is tapped while the overlay is open: close() consumes its
  // own history entry via history.back(), which resolves asynchronously, so
  // the actual navigation waits for that to finish rather than racing it —
  // a same-tick close()-then-push would leave the two history writes
  // interleaved in an undefined order.
  const pendingHrefRef = useRef<string | null>(null)

  useEffect(() => {
    if (current === null && pendingHrefRef.current) {
      const href = pendingHrefRef.current
      pendingHrefRef.current = null
      router.push(href)
    }
  }, [current, router])

  const handleTap = (href: string) => {
    if (current) {
      pendingHrefRef.current = href
      close()
    } else {
      router.push(href)
    }
  }

  const active = pathname === '/' ? 0
    : pathname.startsWith('/whats-on') ? 1
    : pathname.startsWith('/map') ? 2
    : pathname.startsWith('/activities') ? 3
    : pathname.startsWith('/settings') ? 4
    : -1

  return (
    <nav
      // min-h, not h: at 200% text size five labels ("Activities",
      // "Settings", ...) don't all fit their own tab's width on one line —
      // a fixed height forced them to overlap into neighbouring tabs
      // instead of wrapping to a second line and growing the bar.
      className="splash-rise fixed bottom-0 left-0 right-0 min-h-[4.3125rem] bg-white border-t border-border-card flex items-center justify-between px-3 z-40"
      aria-label="Main navigation"
    >
      {ITEMS.map((item, i) => {
        const isActive = i === active
        const label = t.nav[item.key]
        const inner = (
          <>
            {isActive && (
              <motion.span
                layoutId="bottom-nav-indicator"
                className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-[52px] bg-black rounded-full"
                transition={INDICATOR_GLIDE}
                aria-hidden="true"
              />
            )}
            <img
              src={`/${item.icon}`}
              width={item.w}
              height={item.h}
              alt=""
              className={isActive ? 'opacity-100' : 'opacity-[0.35]'}
              aria-hidden="true"
            />
            <span
              className={`text-2xs leading-tight text-center ${
                isActive ? 'text-black font-medium' : 'text-gray-400'
              }`}
            >
              {label}
            </span>
          </>
        )

        return (
          <button
            key={item.key}
            onClick={() => handleTap(item.href)}
            className="relative flex-1 min-w-0 h-full flex flex-col items-center justify-center gap-2 py-2.5"
            aria-current={isActive ? 'page' : undefined}
          >
            {inner}
          </button>
        )
      })}
    </nav>
  )
}
