'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { type Activity, type ActivityCategory, activities } from '@/lib/activities'
import ActivityCarousel from './ActivityCarousel'
import { useTranslation } from '@/lib/useTranslation'
import { useLanguage } from '@/lib/useLanguage'
import { translateTag } from '@/lib/translateTag'

// ── Tag pill (shared by list card) ────────────────────────────────────────────

function TagPill({ label, isFree }: { label: string; isFree?: boolean }) {
  return (
    <div className={`bg-[#f2f2f2] flex items-center justify-center px-[8px] py-[4px] rounded-[8px] shrink-0 ${isFree ? 'gap-[8px]' : ''}`}>
      {isFree && (
        <img src="/tag.svg" width={8} height={8} alt="" aria-hidden="true" className="shrink-0" />
      )}
      <span className="text-[12px] text-black whitespace-nowrap">{label}</span>
    </div>
  )
}

function CalendarIconWhite() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="3" width="14" height="11" rx="1.5" stroke="white" strokeWidth="1.4" />
      <path d="M1 7h14" stroke="white" strokeWidth="1.4" />
      <path d="M5 1v4M11 1v4" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

// ── List card (no image) ──────────────────────────────────────────────────────

function ActivityListCard({ activity: a, bookThis, lang, t }: {
  activity: Activity
  bookThis: string
  lang: 'en' | 'zh'
  t: ReturnType<typeof useTranslation>
}) {
  const router = useRouter()
  const title       = lang === 'zh' && a.titleZh       ? a.titleZh       : a.title
  const description = lang === 'zh' && a.descriptionZh ? a.descriptionZh : a.description
  return (
    <div className="bg-white border border-[#d6d6d6] rounded-[16px] p-[24px] flex flex-col gap-[10px]">
      <div className="flex flex-col gap-[4px]">
        <h3 className="text-[20px] font-semibold text-black leading-snug">{title}</h3>
        <div className="flex gap-[4px] flex-wrap">
          {a.tags.map(raw => <TagPill key={raw} label={translateTag(raw, t)} isFree={raw === 'Free'} />)}
        </div>
      </div>
      <p className="text-[15px] text-black leading-snug">{description}</p>
      <button
        onClick={() => router.push(`/activities/${a.id}/book`)}
        className="flex items-center justify-center gap-[8px] p-[8px] w-full rounded-pill bg-black active:bg-[#494848] text-white text-[16px] font-bold transition-colors duration-75"
      >
        <CalendarIconWhite />
        {bookThis}
      </button>
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
  const popular  = filtered.filter(a => a.popular)
  const others   = filtered.filter(a => !a.popular)

  return (
    <div className="min-h-screen bg-white flex flex-col font-noto pb-[69px]">

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-10 bg-white h-[47px] px-5 flex items-end pb-[10px] shrink-0">
        <h1 className="text-[20px] font-bold text-black leading-none">{t.activities.title}</h1>
      </header>

      {/* ── Filter pills ── */}
      <div className="px-[18px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-[8px] pb-1">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-[32px] py-[10px] rounded-[32px] border text-[14px] font-medium whitespace-nowrap transition-colors duration-100 ${
                filter === f.value
                  ? 'bg-[rgba(26,26,26,0.85)] text-white border-transparent'
                  : 'bg-white text-black border-[#d9d9d9]'
              }`}
            >
              {t.activities[f.tKey]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Most Popular carousel ── */}
      {popular.length > 0 && (
        <section className="mt-[20px] flex flex-col gap-[18px]">
          <h2 className="px-[18px] text-[24px] font-bold text-black leading-none">{t.activities.mostPopular}</h2>
          {/* key=filter forces carousel remount (reset to index 0) on filter change */}
          <ActivityCarousel key={filter} activities={popular} />
        </section>
      )}

      {/* ── Other Activities list ── */}
      {others.length > 0 && (
        <section className="mt-[32px] flex flex-col gap-[18px] px-[18px] pb-4">
          <h2 className="text-[16px] font-normal text-black leading-none">{t.activities.otherActivities}</h2>
          {others.map(a => (
            <ActivityListCard key={a.id} activity={a} bookThis={t.activities.bookThis} lang={lang} t={t} />
          ))}
        </section>
      )}

      {/* Empty state */}
      {popular.length === 0 && others.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center px-8 mt-16">
          <p className="text-[16px] font-semibold text-black">{t.activities.noActivities}</p>
          <p className="text-[14px] text-tfam-mid">{t.activities.noActivitiesSub}</p>
        </div>
      )}

    </div>
  )
}
