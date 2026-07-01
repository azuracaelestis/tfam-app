'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAnimate } from 'motion/react'
import { type Activity } from '@/lib/activities'
import { useTranslation } from '@/lib/useTranslation'
import { useLanguage } from '@/lib/useLanguage'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function formatDate(iso: string, locale: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  }).format(date)
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 mt-[1px]">
      <circle cx="8" cy="8" r="7" stroke="#4a90d9" strokeWidth="1.4" />
      <path d="M8 7v4" stroke="#4a90d9" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.8" fill="#4a90d9" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg width="6" height="12" viewBox="0 0 6 12" fill="none" aria-hidden="true">
      <path d="M5 1L1 6l4 5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-[14px] font-semibold text-black shrink-0">{label}</span>
      <span className="text-[14px] font-normal text-black text-right">{value}</span>
    </div>
  )
}

export default function ConfirmBookingClient({
  activityId,
  activity,
  date,
  slot,
}: {
  activityId: string
  activity: Activity
  date: string
  slot: string
}) {
  const router = useRouter()
  const t = useTranslation()
  const [lang] = useLanguage()
  const locale = lang === 'zh' ? 'zh-TW' : 'en-US'
  const [name, setName]     = useState('')
  const [email, setEmail]   = useState('')
  const [emailError, setEmailError] = useState(false)
  const [emailScope, animateEmail] = useAnimate()
  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && !emailError

  function handleEmailBlur() {
    const trimmed = email.trim()
    if (trimmed.length > 0 && !EMAIL_RE.test(trimmed)) {
      setEmailError(true)
      animateEmail(emailScope.current, { x: [0, -6, 6, -4, 4, 0] }, { duration: 0.35 })
    }
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
    if (emailError) setEmailError(false)
  }

  const slotDisplay = slot.replace('-', '–')
  const duration    = (activity.tags.find(tag => tag.includes('hr')) ?? '—').replace(/\bhrs\b/, 'hours').replace(/\bhr\b/, 'hour')
  const fee         = activity.tags.includes('Free') ? t.activities.tagFree : (activity.tags.find(tag => tag.startsWith('NT$')) ?? '—')
  const activityTitle = lang === 'zh' && activity.titleZh ? activity.titleZh : activity.title

  function handleSubmit() {
    if (!canSubmit) return
    router.push(
      `/activities/${activityId}/book/confirmed?date=${date}&slot=${encodeURIComponent(slot)}&name=${encodeURIComponent(name.trim())}`
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-noto">

      {/* Sticky header */}
      <header className="sticky top-0 z-10 bg-white h-[47px] px-[18px] flex items-center shrink-0">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-[12px] active:opacity-60 transition-opacity"
          aria-label="Back"
        >
          <ChevronLeft />
          <span className="text-[20px] font-bold text-black leading-none">{t.confirmBooking.back}</span>
        </button>
      </header>

      {/* Main content */}
      <div className="flex flex-col gap-[24px] px-[18px] pt-[48px] pb-[69px]">

        {/* Title */}
        <p className="text-[20px] font-bold text-black text-center leading-none">{t.confirmBooking.title}</p>

        {/* Booking summary card */}
        <div className="bg-[#f5f5f5] border border-[#d6d6d6] rounded-[16px] px-[24px] py-[16px] flex flex-col gap-[8px]">
          <SummaryRow label={t.confirmBooking.labelClass}    value={activityTitle} />
          <SummaryRow label={t.confirmBooking.labelDate}     value={formatDate(date, locale)} />
          <SummaryRow label={t.confirmBooking.labelTime}     value={slotDisplay} />
          <SummaryRow label={t.confirmBooking.labelDuration} value={duration} />
          <SummaryRow label={t.confirmBooking.labelFee}      value={fee} />
        </div>

        {/* Your Details */}
        <div className="flex flex-col gap-[12px]">
          <p className="text-[16px] font-semibold text-black leading-none">{t.confirmBooking.yourDetails}</p>
          <input
            type="text"
            placeholder={t.confirmBooking.namePlaceholder}
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-[#f5f5f5] border border-[#d6d6d6] rounded-[12px] px-[16px] py-[14px] text-[15px] text-black placeholder:text-[#aaa] outline-none focus:border-black transition-colors"
          />
          <input
            ref={emailScope}
            type="email"
            placeholder={t.confirmBooking.emailPlaceholder}
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            className={`w-full bg-[#f5f5f5] rounded-[12px] px-[16px] py-[14px] text-[15px] text-black placeholder:text-[#aaa] outline-none transition-colors border ${emailError ? 'border-red-500 focus:border-red-500' : 'border-[#d6d6d6] focus:border-black'}`}
          />
        </div>

        {/* Info banner */}
        <div className="bg-[#ebf6ff] rounded-[12px] px-[16px] py-[14px] flex items-start gap-[8px]">
          <InfoIcon />
          <p className="text-[13px] text-black leading-relaxed">
            {t.confirmBooking.banner}
            <span className="font-bold">{t.confirmBooking.bannerBold}</span>
            {t.confirmBooking.bannerPost}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="flex items-center justify-center gap-[8px] h-[48px] w-full rounded-[80px] bg-black text-white text-[16px] font-bold disabled:opacity-40 transition-opacity active:bg-[#333]"
        >
          <CheckIcon />
          {t.confirmBooking.confirmButton}
        </button>

      </div>
    </div>
  )
}
