'use client'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/useTranslation'

export default function HomeCards() {
  const router = useRouter()
  const t = useTranslation()

  const CARDS = [
    { label: t.home.floorMap,       subtitle: t.home.floorMapDesc,       icon: 'floor-map.svg' },
    { label: t.home.whatsOn,        subtitle: t.home.whatsOnDesc,        icon: 'whats-on.svg',  href: '/whats-on' },
    { label: t.home.suggestedRoute, subtitle: t.home.suggestedRouteDesc, icon: 'location.svg'  },
    { label: t.home.bookGuidedTour, subtitle: t.home.bookGuidedTourDesc, icon: 'ticket.svg'    },
  ]

  return (
    <div className="flex flex-col gap-3 px-[18px] py-2">
      {CARDS.map((card) => {
        const inner = (
          <div className="flex items-center gap-6 w-full">
            <img
              src={`/${card.icon}`}
              width={40}
              height={40}
              alt=""
              aria-hidden="true"
              className="shrink-0"
            />
            <div className="flex flex-col leading-normal text-black min-w-0">
              <span className="text-base font-bold truncate">{card.label}</span>
              <span className="text-sm font-normal text-tfam-mid truncate">{card.subtitle}</span>
            </div>
          </div>
        )

        if (card.href) {
          return (
            <button
              key={card.label}
              onClick={() => router.push(card.href!)}
              className="bg-white border border-border-card rounded-2xl h-[80px] px-10 py-5 flex items-center text-left w-full"
            >
              {inner}
            </button>
          )
        }

        return (
          <div
            key={card.label}
            className="bg-white border border-border-card rounded-2xl h-[80px] px-10 py-5 flex items-center"
          >
            {inner}
          </div>
        )
      })}
    </div>
  )
}
