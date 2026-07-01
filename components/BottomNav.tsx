'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/useTranslation'

const ITEMS = [
  { key: 'home',       icon: 'bottom-nav-home.svg',       w: 16, h: 17, href: '/' },
  { key: 'whatsOn',    icon: 'bottom-nav-whats-on.svg',   w: 17, h: 17, href: '/whats-on' },
  { key: 'map',        icon: 'bottom-nav-map.svg',        w: 19, h: 17, href: null },
  { key: 'activities', icon: 'bottom-nav-activities.svg', w: 21, h: 17, href: '/activities' },
  { key: 'settings',   icon: 'bottom-nav-setting.svg',    w: 17, h: 17, href: '/settings' },
] as const

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslation()
  const active = pathname === '/' ? 0
    : pathname.startsWith('/whats-on') ? 1
    : pathname.startsWith('/activities') ? 3
    : pathname.startsWith('/settings') ? 4
    : -1

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 h-[69px] bg-white border-t border-border-card flex items-center justify-between px-3 z-40"
      aria-label="Main navigation"
    >
      {ITEMS.map((item, i) => {
        const isActive = i === active
        const label = t.nav[item.key]
        const inner = (
          <>
            {isActive && (
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-[52px] bg-black rounded-full"
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
              className={`text-2xs leading-tight text-center whitespace-nowrap ${
                isActive ? 'text-black font-medium' : 'text-gray-400'
              }`}
            >
              {label}
            </span>
          </>
        )

        if (item.href) {
          return (
            <button
              key={item.key}
              onClick={() => router.push(item.href!)}
              className="relative flex-1 h-full flex flex-col items-center justify-center gap-2 py-2.5"
              aria-current={isActive ? 'page' : undefined}
            >
              {inner}
            </button>
          )
        }

        return (
          <div
            key={item.key}
            className="relative flex-1 h-full flex flex-col items-center justify-center gap-2 py-2.5"
            aria-hidden="true"
          >
            {inner}
          </div>
        )
      })}
    </nav>
  )
}
