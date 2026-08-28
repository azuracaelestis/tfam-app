'use client'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/useLanguage'
import { useTranslation } from '@/lib/useTranslation'

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
      className="w-full flex items-center justify-between gap-3 bg-white border border-hairline rounded-card p-[18px] active:opacity-70 transition-opacity"
    >
      <div className="flex items-start gap-[18px] min-w-0">
        <img src={icon} width={33} height={33} alt="" aria-hidden="true" className="shrink-0" />
        <div className="flex flex-col gap-[4px] text-left min-w-0">
          <span className="text-[16px] font-semibold text-black leading-normal">{title}</span>
          <span className="text-[14px] font-normal text-[#4f4f4f] leading-snug">{subtitle}</span>
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
      className="w-full flex items-center justify-between gap-3 bg-white border border-hairline rounded-card p-[18px] active:opacity-70 transition-opacity"
    >
      <div className="flex flex-col gap-[4px] text-left min-w-0">
        <span className="text-[16px] font-semibold text-black leading-normal">{title}</span>
        <span className="text-[14px] font-normal text-[#4f4f4f] leading-normal">{subtitle}</span>
      </div>
      <ChevronRight />
    </button>
  )
}

export default function SettingsClient() {
  const router = useRouter()
  const [lang] = useLanguage()
  const t = useTranslation()

  return (
    <div className="min-h-screen bg-white flex flex-col font-noto">

      {/* Header */}
      <header className="bg-white px-5 pt-3 pb-3 flex flex-col gap-1 shrink-0">
        <h1 className="text-[32px] font-semibold text-black leading-normal">{t.settings.title}</h1>
      </header>

      {/* Content */}
      <div className="flex flex-col gap-[32px] px-5 pt-[16px] pb-[69px]">

        {/* Preferences + About */}
        <div className="flex flex-col gap-[32px]">

          {/* Preferences */}
          <div className="flex flex-col gap-[12px]">
            <p className="text-[20px] font-medium text-ink">{t.settings.preferences}</p>
            <div className="flex flex-col gap-[8px]">
              <PreferenceCard
                icon="/images/notification/icon-notification.svg"
                title={t.settings.notifications}
                subtitle={t.settings.notificationsSub}
                onClick={() => router.push('/settings/notifications')}
              />
              <PreferenceCard
                icon="/images/notification/icon-language.svg"
                title={t.settings.language}
                subtitle={t.settings.languageSub}
                onClick={() => router.push('/settings/language')}
              />
            </div>
          </div>

          {/* About */}
          <div className="flex flex-col gap-[12px]">
            <p className="text-[20px] font-medium text-ink">{t.settings.about}</p>
            <div className="flex flex-col gap-[8px]">
              <AboutCard
                title={t.settings.aboutMuseum}
                subtitle={t.settings.aboutMuseumSub}
                onClick={() => window.open(ABOUT_LINKS.about[lang], '_blank')}
              />
              <AboutCard
                title={t.settings.privacyPolicy}
                subtitle={t.settings.privacyPolicySub}
                onClick={() => window.open(ABOUT_LINKS.privacy[lang], '_blank')}
              />
              <AboutCard
                title={t.settings.accessibility}
                subtitle={t.settings.accessibilitySub}
                onClick={() => window.open(ABOUT_LINKS.accessibility[lang], '_blank')}
              />
            </div>
          </div>

        </div>

        {/* App Version */}
        <div className="flex justify-between items-center">
          <span className="text-[16px] font-semibold text-ink-secondary">{t.settings.appVersion}</span>
          <span className="text-[16px] font-semibold text-ink-secondary">1.0.0</span>
        </div>

      </div>
    </div>
  )
}
