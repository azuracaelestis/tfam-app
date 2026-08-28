'use client'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/useLanguage'
import { useTranslation } from '@/lib/useTranslation'

function ChevronLeft() {
  return (
    <svg width="6" height="12" viewBox="0 0 6 12" fill="none" aria-hidden="true">
      <path d="M5 1L1 6l4 5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true" className="shrink-0 mt-[2px]">
      <circle cx="5.5" cy="5.5" r="5" stroke="#4a90d9" strokeWidth="1" />
      <path d="M5.5 4.5v3" stroke="#4a90d9" strokeWidth="1" strokeLinecap="round" />
      <circle cx="5.5" cy="3.5" r="0.6" fill="#4a90d9" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true" className="shrink-0 ml-auto">
      <path d="M1 5l4 4L13 1" stroke="black" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LanguageCard({
  badge,
  title,
  subtitle,
  selected,
  onClick,
}: {
  badge: string
  title: string
  subtitle: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex gap-[18px] items-center bg-white border border-hairline rounded-card p-[18px] active:opacity-70 transition-opacity"
    >
      <div className="bg-[#d6d6d6] p-[10px] rounded-[32px] shrink-0 flex items-center justify-center">
        <span className="text-[16px] font-semibold text-black whitespace-nowrap leading-normal">{badge}</span>
      </div>
      <div className="flex flex-col gap-[4px] text-left min-w-0 flex-1">
        <span className="text-[16px] font-semibold text-black leading-normal">{title}</span>
        <span className="text-[13px] font-normal text-black leading-normal">{subtitle}</span>
      </div>
      {selected && <CheckIcon />}
    </button>
  )
}

export default function LanguageClient() {
  const router = useRouter()
  const [lang, setLanguage] = useLanguage()
  const t = useTranslation()

  return (
    <div className="min-h-screen bg-white flex flex-col font-noto">

      {/* Sticky header */}
      <header className="sticky top-0 z-10 bg-white h-[60px] px-5 flex items-end pb-[10px] shrink-0">
        <div className="flex gap-[12px] items-center w-full">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-[12px] active:opacity-60 transition-opacity"
            aria-label="Back"
          >
            <ChevronLeft />
            <span className="text-[20px] font-bold text-black leading-normal">{t.language.title}</span>
          </button>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-[24px] px-5 pt-[16px] pb-[69px] w-full">

          {/* Display Language */}
          <div className="flex flex-col gap-[12px]">
            <p className="text-heading-l text-ink">{t.language.displayLanguage}</p>
            <div className="flex flex-col gap-[8px]">
              <LanguageCard
                badge={t.language.enBadge}
                title={t.language.enTitle}
                subtitle={t.language.enSub}
                selected={lang === 'en'}
                onClick={() => setLanguage('en')}
              />
              <LanguageCard
                badge={t.language.zhBadge}
                title={t.language.zhTitle}
                subtitle={t.language.zhSub}
                selected={lang === 'zh'}
                onClick={() => setLanguage('zh')}
              />
            </div>
          </div>

          {/* Info banner */}
          <div className="bg-[#ebf6ff] rounded-card p-[18px]">
            <div className="flex gap-[10px] items-start py-[4px] w-full">
              <InfoIcon />
              <p className="flex-1 min-w-0 text-[14px] font-normal text-black leading-normal">
                {t.language.infoBanner}
              </p>
            </div>
          </div>

          {/* Audio Guide Language */}
          <div className="flex flex-col gap-[12px] mt-2">
            <p className="text-heading-l text-ink">{t.language.audioGuideLanguage}</p>
            <div className="border border-hairline rounded-card p-[18px] flex flex-col gap-[12px]">
              <p className="text-[16px] font-semibold text-black w-[260px] leading-normal">
                {t.language.audioGuideNarration}
              </p>
              <p className="text-[13px] font-normal text-black leading-normal">
                {t.language.audioGuideDesc}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
