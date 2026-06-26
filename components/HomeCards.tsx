'use client'
import { useRouter } from 'next/navigation'

const CARDS = [
  { label: 'Floor Map',                 subtitle: 'Find any gallery offline',          icon: 'floor-map.svg' },
  { label: "What's On",                 subtitle: '6 exhibitions today',               icon: 'whats-on.svg',  href: '/whats-on' },
  { label: 'Suggested Route',           subtitle: 'First time visitor visiting path',  icon: 'location.svg'  },
  { label: 'Book Guided Tour or Class', subtitle: 'Slots available today',             icon: 'ticket.svg'    },
]

export default function HomeCards() {
  const router = useRouter()

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
