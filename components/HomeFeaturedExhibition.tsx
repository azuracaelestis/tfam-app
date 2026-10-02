'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { getById } from '@/lib/exhibitions'
import { useTranslation } from '@/lib/useTranslation'
import { useLanguage } from '@/lib/useLanguage'
import { useExhibitionOverlay } from '@/contexts/ExhibitionOverlayContext'
import { useOnTransitionComplete } from './PageTransitionWrapper'
import { LIFT, ROW_LIFT } from '@/lib/motion'
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
  const { open, current } = useExhibitionOverlay()
  const ex = getById('forms-in-motion')

  // Row Lift (Option 06): this section has no sibling cards to part, but the
  // same beat still applies to its own header (recede) and the card's own
  // copy (fade) while the hero lifts into the overlay — see ExhibitionCarousel
  // / WhatsOnClient for the carousel's version of this choreography.
  const [isLifting, setIsLifting] = useState(false)
  useEffect(() => {
    if (!current) setIsLifting(false)
  }, [current])

  // The shared layoutId below is what makes tapping this card morph smoothly
  // into the exhibition overlay (R1). But Motion's layoutId registry isn't
  // scoped to this mount: this whole component remounts fresh on every Home
  // visit (PageTransitionWrapper keys pages by navigation instance), and a
  // PRIOR Home visit's card can still be sitting in that registry under the
  // same id. A brand-new mount picks that up as "the same element reappeared"
  // and re-runs the 0.52s LIFT transition FROM the old rect — independent of,
  // and much slower than, the page's own ~0.25s tab-switch slide. Visually:
  // the page arrives on time, and the thumbnail keeps drifting into place
  // for another ~250ms after it. Withholding `layoutId` until the page's own
  // entrance is done removes any rect for Motion to react to, so the card
  // settles rigidly with the page. It only needs to be a real layoutId
  // target once the visitor can actually tap it.
  const [liftReady, setLiftReady] = useState(false)
  useOnTransitionComplete(() => setLiftReady(true))

  if (!ex) return null

  const meta = `${ex.floor} ${ex.gallery} • ${t.home.untilPrefix} ${untilDate(ex.endDate!, lang)}`

  return (
    <div className="flex flex-col gap-2 px-5 py-4 bg-canvas">
      <motion.div
        className="splash-rise flex items-center justify-between"
        animate={isLifting ? { opacity: 0.3, scale: 0.96 } : { opacity: 1, scale: 1 }}
        transition={ROW_LIFT.recede}
      >
        <h2 className="text-heading-l text-ink">{t.home.todayAtMuseum}</h2>
        <button
          onClick={() => router.push('/whats-on')}
          className="relative flex items-center gap-0.5 text-sm text-ink before:content-[''] before:absolute before:-inset-3"
        >
          {t.home.viewAll}
          <ChevronRightIcon size={13} />
        </button>
      </motion.div>

      <button
        onClick={() => { setIsLifting(true); open(ex.id, 'home') }}
        className="splash-rise bg-white border border-hairline rounded-card p-3 flex gap-3 items-center text-left w-full"
      >
        <motion.div layoutId={liftReady ? `hero-home-${ex.id}` : undefined} transition={LIFT} className="relative shrink-0 w-[121px] h-[90px] rounded-card overflow-hidden">
          <Image src={ex.image} alt={ex.title} fill sizes="121px" className="object-cover" priority decoding="sync" />
        </motion.div>
        <motion.div
          className="flex flex-col gap-2 min-w-0"
          animate={isLifting ? { opacity: 0 } : { opacity: 1 }}
          transition={ROW_LIFT.copyFade}
        >
          <div className="flex flex-col">
            <span className="text-heading-m text-ink truncate">{ex.title}</span>
            <span className="text-label-m text-ink-secondary truncate tracking-[-0.322px]">{meta}</span>
          </div>
          <p className="text-label-m text-ink-secondary line-clamp-2">
            {lang === 'zh' && ex.descriptionZh ? ex.descriptionZh : 'Exploring transformation in contemporary art.'}
          </p>
        </motion.div>
      </button>
    </div>
  )
}
