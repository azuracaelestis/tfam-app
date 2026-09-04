'use client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getActivityById } from '@/lib/activities'
import { useTranslation } from '@/lib/useTranslation'
import ChevronRightIcon from './icons/ChevronRightIcon'

export default function HomePlanVisit() {
  const router = useRouter()
  const t = useTranslation()
  const activity = getActivityById('guided-exhibition-tour')

  return (
    <div className="flex flex-col gap-2 px-5 py-4 bg-canvas">
      <h2 className="splash-rise text-heading-l text-ink">{t.home.planYourVisit}</h2>
      <button
        onClick={() => router.push('/activities')}
        className="splash-rise bg-white border border-hairline rounded-card shadow-[0px_0px_2.5px_rgba(0,0,0,0.1)] p-2 flex items-center justify-between gap-3 w-full text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0 size-[45px] rounded-xl overflow-hidden bg-hairline">
            {activity && (
              <Image src={activity.image} alt="" fill sizes="45px" className="object-cover" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-heading-m text-ink">{t.home.bookGuidedTour}</span>
            <span className="text-label-m text-ink-secondary">{t.home.bookGuidedTourDesc}</span>
          </div>
        </div>
        <ChevronRightIcon size={24} className="text-ink shrink-0" />
      </button>
    </div>
  )
}
