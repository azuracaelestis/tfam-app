'use client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'motion/react'
import { getById } from '@/lib/exhibitions'
import { useTranslation } from '@/lib/useTranslation'
import { useLanguage } from '@/lib/useLanguage'
import { useExhibitionOverlay } from '@/contexts/ExhibitionOverlayContext'
import { LIFT } from '@/lib/motion'
import ChevronRightIcon from './icons/ChevronRightIcon'

function untilDate(iso: string, lang: 'en' | 'zh') {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const locale = lang === 'zh' ? 'zh-TW' : 'en-US'
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

export default function HomeFeaturedExhibition() {
  const router = useRouter()
  const t = useTranslation()
  const [lang] = useLanguage()
  const { open } = useExhibitionOverlay()
  const ex = getById('forms-in-motion')

  if (!ex) return null

  const meta = `${ex.floor} ${ex.gallery} • ${t.home.untilPrefix} ${untilDate(ex.endDate!, lang)}`

  return (
    <div className="flex flex-col gap-2 px-5 py-4 bg-canvas">
      <div className="splash-rise flex items-center justify-between">
        <h2 className="text-heading-l text-ink">{t.home.todayAtMuseum}</h2>
        <button
          onClick={() => router.push('/whats-on')}
          className="flex items-center gap-0.5 text-sm text-ink"
        >
          {t.home.viewAll}
          <ChevronRightIcon size={13} />
        </button>
      </div>

      <button
        onClick={() => open(ex.id, 'home')}
        className="splash-rise bg-white border border-hairline rounded-card p-3 flex gap-3 items-center text-left w-full"
      >
        <motion.div layoutId={`hero-home-${ex.id}`} transition={LIFT} className="relative shrink-0 w-[121px] h-[90px] rounded-card overflow-hidden">
          <Image src={ex.image} alt={ex.title} fill sizes="121px" className="object-cover" />
        </motion.div>
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex flex-col">
            <span className="text-heading-m text-ink truncate">{ex.title}</span>
            <span className="text-label-m text-ink-secondary truncate tracking-[-0.322px]">{meta}</span>
          </div>
          <p className="text-label-m text-ink-secondary line-clamp-2">
            {lang === 'zh' && ex.descriptionZh ? ex.descriptionZh : 'Exploring transformation in contemporary art.'}
          </p>
        </div>
      </button>
    </div>
  )
}
