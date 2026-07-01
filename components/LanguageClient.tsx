'use client'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/useLanguage'

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
      className="w-full flex gap-[24px] items-center bg-white border border-[#d6d6d6] rounded-[16px] p-[18px] active:opacity-70 transition-opacity"
    >
      <div className="bg-[#d6d6d6] p-[10px] rounded-[32px] shrink-0 flex items-center justify-center">
        <span className="text-[16px] font-semibold text-black whitespace-nowrap leading-normal">{badge}</span>
      </div>
      <div className="flex flex-col gap-[4px] w-[207px] text-left shrink-0">
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

  return (
    <div className="min-h-screen bg-white flex flex-col font-noto">

      {/* Sticky header */}
      <header className="sticky top-0 z-10 bg-white px-[20px] py-[10px] flex items-end shrink-0">
        <div className="flex gap-[12px] items-center w-full">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-[12px] active:opacity-60 transition-opacity"
            aria-label="Back"
          >
            <ChevronLeft />
            <span className="text-[20px] font-bold text-black leading-normal">Language</span>
          </button>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-[24px] px-[15px] pt-[16px] pb-[69px] w-full">

          {/* Display Language */}
          <div className="flex flex-col gap-[12px]">
            <p className="text-[20px] font-medium text-black leading-normal">Display Language</p>
            <div className="flex flex-col gap-[12px]">
              <LanguageCard
                badge="EN"
                title="English"
                subtitle="All screens, labels, and content in English"
                selected={lang === 'en'}
                onClick={() => setLanguage('en')}
              />
              <LanguageCard
                badge="中文"
                title="繁體中文"
                subtitle="Traditional Chinese"
                selected={lang === 'zh'}
                onClick={() => setLanguage('zh')}
              />
            </div>
          </div>

          {/* Info banner */}
          <div className="bg-[#ebf6ff] rounded-[16px] p-[18px]">
            <div className="flex gap-[10px] items-start py-[4px] w-[319px]">
              <InfoIcon />
              <p className="text-[14px] font-normal text-black leading-normal">
                Your language preferences is saved and will not change mid-session. Restart the app after switching the language.
              </p>
            </div>
          </div>

          {/* Audio Guide Language */}
          <div className="flex flex-col gap-[12px]">
            <p className="text-[20px] font-medium text-black leading-normal">Audio Guide Language</p>
            <div className="border border-[#d6d6d6] rounded-[16px] p-[18px] flex flex-col gap-[12px]">
              <p className="text-[16px] font-semibold text-black w-[260px] leading-normal">
                Audio guide narration
              </p>
              <p className="text-[13px] font-normal text-black leading-normal">
                Curator recording are available in both English and Mandarin. Select your preferred language on the playback screen.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
