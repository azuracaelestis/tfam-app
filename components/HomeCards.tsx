'use client'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/useTranslation'
import ChevronRightIcon from './icons/ChevronRightIcon'

export default function HomeCards() {
  const router = useRouter()
  const t = useTranslation()

  const GRID_ITEMS = [
    { label: t.home.floorMap, icon: 'floor-map.svg', href: '/map' },
    { label: t.home.whatsOn, icon: 'whats-on.svg', href: '/whats-on' },
  ]

  const item = (label: string, icon: string, href?: string) => {
    const inner = (
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="flex items-center gap-3 min-w-0">
          <img src={`/${icon}`} width={20} height={20} alt="" aria-hidden="true" className="shrink-0" />
          <span className="text-heading-m text-ink">{label}</span>
        </div>
        <ChevronRightIcon size={24} className="text-ink shrink-0" />
      </div>
    )

    // min-h, not h: at 200% text size "Floor Map" needs two lines' worth of
    // height, and a fixed height would just clip it instead of growing.
    const className = 'bg-white border border-hairline rounded-card min-h-11 px-3 py-2 flex items-center w-full'

    return href ? (
      <button key={label} onClick={() => router.push(href)} className={className}>
        {inner}
      </button>
    ) : (
      <div key={label} className={className}>
        {inner}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 px-5 py-4 bg-canvas">
      <h2 className="splash-rise text-heading-l text-ink">{t.home.exploreMuseum}</h2>
      <div className="splash-rise flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          {GRID_ITEMS.map((c) => item(c.label, c.icon, c.href))}
        </div>
        {item(t.home.suggestedRoute, 'location.svg', '/map')}
      </div>
    </div>
  )
}
