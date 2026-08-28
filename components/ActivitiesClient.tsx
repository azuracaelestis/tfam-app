'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { type Activity, type ActivityCategory, activities, getDurationTag, getAgeTag } from '@/lib/activities'
import ActivityCarousel from './ActivityCarousel'
import ActivityMeta from './ActivityMeta'
import ChevronRightIcon from './icons/ChevronRightIcon'
import { useTranslation } from '@/lib/useTranslation'
import { useLanguage } from '@/lib/useLanguage'
import { translateTag } from '@/lib/translateTag'
import { STATE, LIFT } from '@/lib/motion'

// ── List card ──────────────────────────────────────────────────────────────────

function ActivityListCard({ activity: a, bookThis, lang, t }: {
  activity: Activity
  bookThis: string
  lang: 'en' | 'zh'
  t: ReturnType<typeof useTranslation>
}) {
  const router = useRouter()
  const title       = lang === 'zh' && a.titleZh       ? a.titleZh       : a.title
  const description = lang === 'zh' && a.descriptionZh ? a.descriptionZh : a.description
  const durationTag = getDurationTag(a)
  const ageTag      = getAgeTag(a)
  return (
    <div
      onClick={() => router.push(`/activities/${a.id}/book?from=list`)}
      className="w-full flex items-stretch gap-4 bg-white active:bg-[#f5f5f5] border border-hairline rounded-card overflow-hidden pr-5 transition-colors duration-75 cursor-pointer"
    >
      <motion.div layoutId={`chip-list-${a.id}`} transition={LIFT} className="relative w-[126px] min-h-[120px] shrink-0 overflow-hidden rounded-card">
        <Image src={a.image} alt={a.title} fill sizes="126px" className="object-cover" />
      </motion.div>
      <div className="flex-1 min-w-0 flex flex-col gap-4 justify-center py-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-black leading-snug">{title}</h3>
          <ActivityMeta
            duration={durationTag ? translateTag(durationTag, t) : undefined}
            age={ageTag ? translateTag(ageTag, t) : undefined}
          />
          <p className="text-xs text-black leading-4 h-12 line-clamp-3">{description}</p>
        </div>
        <div className="flex items-center gap-0.5 text-sm font-semibold text-black">
          {bookThis}
          <ChevronRightIcon size={17} />
        </div>
      </div>
    </div>
  )
}

// ── Filter config ─────────────────────────────────────────────────────────────

const FILTERS: { tKey: 'filterAll' | 'filterClasses' | 'filterTours' | 'filterFestivals'; value: 'all' | ActivityCategory }[] = [
  { tKey: 'filterAll',       value: 'all'      },
  { tKey: 'filterClasses',   value: 'class'    },
  { tKey: 'filterTours',     value: 'tour'     },
  { tKey: 'filterFestivals', value: 'festival' },
]

// ── Main screen ───────────────────────────────────────────────────────────────

export default function ActivitiesClient() {
  const t = useTranslation()
  const [lang] = useLanguage()
  const [filter, setFilter] = useState<'all' | ActivityCategory>('all')

  const filtered = filter === 'all' ? activities : activities.filter(a => a.category === filter)
  const popular  = activities.filter(a => a.popular)
  const others   = filtered.filter(a => !a.popular)

  return (
    <div className="min-h-screen bg-white flex flex-col font-noto pb-[69px]">

      {/* ── Header ── */}
      <header className="bg-white px-5 pt-3 pb-0 flex flex-col gap-1 shrink-0">
        <h1 className="text-[32px] font-semibold text-black leading-normal">{t.activities.title}</h1>
        <p className="text-sm text-ink-secondary">{t.activities.subtitle}</p>
      </header>

      {/* ── Featured This Week carousel ── */}
      {popular.length > 0 && (
        <section className="pt-6 mb-[32px] flex flex-col gap-3">
          <h2 className="px-5 text-heading-l text-black">{t.activities.mostPopular}</h2>
          <ActivityCarousel activities={popular} />
        </section>
      )}

      {/* ── Filter pills ── */}
      <div className="px-5">
        <div className="bg-icon-bg rounded-pill p-1 flex overflow-hidden">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="relative flex-1 min-w-0 h-[40px] rounded-pill flex items-center justify-center text-sm font-semibold text-black truncate px-1 outline-none focus:outline-none focus-visible:outline-none"
            >
              {filter === f.value && (
                <motion.div
                  layoutId="activities-filter-pill"
                  className="absolute inset-0 rounded-pill bg-white"
                  transition={STATE}
                />
              )}
              <span className="relative z-10">{t.activities[f.tKey]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Activity list — true R6 cross-fade; height animates via `layout`
          so a filter with a different result count never snaps the page.
          `relative` anchors mode="popLayout"'s absolute-positioned exit. ── */}
      <motion.div layout transition={STATE} className="relative flex-1 flex flex-col">
        <AnimatePresence mode="popLayout" initial={false}>
          {others.length > 0 ? (
            <motion.section
              key={filter}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={STATE}
              className="flex flex-col gap-2 px-5 pb-5 pt-[18px]"
            >
              {others.map(a => (
                <ActivityListCard key={a.id} activity={a} bookThis={t.activities.bookThis} lang={lang} t={t} />
              ))}
            </motion.section>
          ) : (
            // Empty state — the featured carousel is unfiltered, so this only reflects the filtered list
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={STATE}
              className="flex-1 flex flex-col items-center justify-center gap-2 text-center px-8 mt-16"
            >
              <p className="text-[16px] font-semibold text-black">{t.activities.noActivities}</p>
              <p className="text-[14px] text-tfam-mid">{t.activities.noActivitiesSub}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  )
}
