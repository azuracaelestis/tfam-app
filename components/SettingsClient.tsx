'use client'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/useLanguage'

const ABOUT_LINKS = {
  about: {
    en: 'https://www.tfam.museum/Common/editor.aspx?id=230&ddlLang=en-us',
    zh: 'https://www.tfam.museum/Common/editor.aspx?id=230&ddlLang=zh-tw',
  },
  privacy: {
    en: 'https://www.tfam.museum/Common/Page.aspx?m=5&ddlLang=en-us',
    zh: 'https://www.tfam.museum/Common/Page.aspx?m=5&ddlLang=zh-tw',
  },
  accessibility: {
    en: 'https://english.tfam.gov.taipei/?ddlLang=en-us',
    zh: 'https://tfam.gov.taipei/?ddlLang=zh-tw',
  },
}

function ChevronRight() {
  return (
    <svg width="7" height="14" viewBox="0 0 7 14" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M1 1l5 6-5 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PreferenceCard({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: string
  title: string
  subtitle: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between gap-[85px] bg-white border border-[#d6d6d6] rounded-[16px] p-[18px] active:opacity-70 transition-opacity"
    >
      <div className="flex items-start gap-[18px] shrink-0">
        <img src={icon} width={33} height={33} alt="" aria-hidden="true" className="shrink-0" />
        <div className="flex flex-col gap-[4px] text-left w-[179px]">
          <span className="text-[16px] font-semibold text-black leading-normal">{title}</span>
          <span className="text-[13px] font-normal text-black leading-snug">{subtitle}</span>
        </div>
      </div>
      <ChevronRight />
    </button>
  )
}

function AboutCard({
  title,
  subtitle,
  onClick,
}: {
  title: string
  subtitle: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between gap-[85px] bg-white border border-[#d6d6d6] rounded-[16px] p-[18px] active:opacity-70 transition-opacity"
    >
      <div className="flex flex-col gap-[4px] text-left">
        <span className="text-[16px] font-semibold text-black leading-normal">{title}</span>
        <span className="text-[13px] font-normal text-black leading-normal">{subtitle}</span>
      </div>
      <ChevronRight />
    </button>
  )
}

export default function SettingsClient() {
  const router = useRouter()
  const [lang] = useLanguage()

  return (
    <div className="min-h-screen bg-white flex flex-col font-noto">

      {/* Sticky header */}
      <header className="sticky top-0 z-10 bg-white px-[20px] py-[10px] flex items-end shrink-0">
        <p className="text-[20px] font-bold text-black leading-normal">Settings</p>
      </header>

      {/* Content */}
      <div className="flex flex-col gap-[24px] px-[16px] pt-[16px] pb-[69px]">

        {/* Preferences + About */}
        <div className="flex flex-col gap-[28px]">

          {/* Preferences */}
          <div className="flex flex-col gap-[12px]">
            <p className="text-[20px] font-medium text-black leading-normal">Preferences</p>
            <div className="flex flex-col gap-[12px]">
              <PreferenceCard
                icon="/images/notification/icon-notification.svg"
                title="Notifications"
                subtitle="Exhibition alerts, class sessions, Saturday reminder"
                onClick={() => router.push('/settings/notifications')}
              />
              <PreferenceCard
                icon="/images/notification/icon-language.svg"
                title="Language"
                subtitle="App display language"
                onClick={() => router.push('/settings/language')}
              />
            </div>
          </div>

          {/* About */}
          <div className="flex flex-col gap-[12px]">
            <p className="text-[20px] font-medium text-black leading-normal">About</p>
            <div className="flex flex-col gap-[12px]">
              <AboutCard
                title="About Taipei Fine Arts Museum"
                subtitle="Visit info, contact, opening hours"
                onClick={() => window.open(ABOUT_LINKS.about[lang], '_blank')}
              />
              <AboutCard
                title="Privacy Policy"
                subtitle="How your data is used"
                onClick={() => window.open(ABOUT_LINKS.privacy[lang], '_blank')}
              />
              <AboutCard
                title="Accessibility"
                subtitle="Physical access, service at TFAM"
                onClick={() => window.open(ABOUT_LINKS.accessibility[lang], '_blank')}
              />
            </div>
          </div>

        </div>

        {/* App Version */}
        <div className="flex justify-between items-center">
          <span className="text-[16px] font-semibold text-[#767676]">App Version</span>
          <span className="text-[16px] font-semibold text-[#767676]">1.0.0</span>
        </div>

      </div>
    </div>
  )
}
