'use client'
import { useRouter } from 'next/navigation'
import { type Activity } from '@/lib/activities'
import { useTranslation } from '@/lib/useTranslation'
import { useLanguage } from '@/lib/useLanguage'

function formatDate(iso: string, locale: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  }).format(date)
}

function pad2(n: number) { return String(n).padStart(2, '0') }

function toIcsDate(iso: string, time: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const [h, min] = time.split(':').map(Number)
  return `${y}${pad2(m)}${pad2(d)}T${pad2(h)}${pad2(min)}00`
}

function downloadIcs(activity: Activity, date: string, slot: string) {
  const [startTime, endTime] = slot.split('-')
  const dtStart = toIcsDate(date, startTime)
  const dtEnd   = toIcsDate(date, endTime)
  const uid     = `${date}-${slot.replace(/:/g, '')}-tfam@tfam.gov.tw`
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TFAM//Audio Guide//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    'DTSTAMP:20260101T000000Z',
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${activity.title}`,
    'LOCATION:Taipei Fine Arts Museum',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = 'tfam-booking.ics'
  a.click()
  URL.revokeObjectURL(url)
}

function CheckCircleIcon() {
  return (
    <div className="size-[72px] rounded-full bg-[#f0f0f0] flex items-center justify-center shrink-0">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M7 16l6 6L25 10" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function HouseIcon() {
  return <img src="/images/activities/home-white.svg" width={16} height={16} alt="" aria-hidden="true" />
}

function CalendarIcon() {
  return <img src="/images/activities/calendar-black.svg" width={22} height={22} alt="" aria-hidden="true" />
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-[14px] font-semibold text-black shrink-0">{label}</span>
      <span className="text-[14px] font-normal text-black text-right">{value}</span>
    </div>
  )
}

export default function BookingConfirmedClient({
  activity,
  date,
  slot,
}: {
  activity: Activity
  date: string
  slot: string
}) {
  const router = useRouter()
  const t = useTranslation()
  const [lang] = useLanguage()
  const locale = lang === 'zh' ? 'zh-TW' : 'en-US'

  const slotDisplay   = slot.replace('-', '–')
  const fee           = activity.tags.includes('Free') ? t.activities.tagFree : (activity.tags.find(tag => tag.startsWith('NT$')) ?? '—')
  const activityTitle = lang === 'zh' && activity.titleZh ? activity.titleZh : activity.title

  return (
    <div className="min-h-screen bg-white flex flex-col font-noto">
      <div className="flex flex-col items-center gap-[24px] px-[18px] pt-[48px] pb-[69px]">

        {/* Check icon */}
        <CheckCircleIcon />

        {/* Title */}
        <p className="text-[20px] font-bold text-black text-center leading-none">{t.bookingConfirmed.title}</p>

        {/* Summary card */}
        <div className="w-full bg-[#f5f5f5] border border-[#d6d6d6] rounded-[16px] px-[24px] py-[16px] flex flex-col gap-[8px]">
          <SummaryRow label={t.confirmBooking.labelClass}    value={activityTitle} />
          <SummaryRow label={t.confirmBooking.labelDate}     value={formatDate(date, locale)} />
          <SummaryRow label={t.confirmBooking.labelTime}     value={slotDisplay} />
          <SummaryRow label={t.confirmBooking.labelFee}      value={fee} />
        </div>

        {/* Info banner */}
        <div className="w-full bg-[#ebf6ff] rounded-[12px] px-[16px] py-[14px] flex items-start gap-[8px]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 mt-[1px]">
            <circle cx="8" cy="8" r="7" stroke="#4a90d9" strokeWidth="1.4" />
            <path d="M8 7v4" stroke="#4a90d9" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="8" cy="5" r="0.8" fill="#4a90d9" />
          </svg>
          <p className="text-[13px] text-black leading-relaxed">
            {t.bookingConfirmed.banner}
            <span className="font-bold">{t.bookingConfirmed.bannerBold}</span>
            {t.bookingConfirmed.bannerEnd}
          </p>
        </div>

        {/* Back to Home */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center justify-center gap-[8px] h-[48px] w-full rounded-[80px] bg-black text-white text-[16px] font-bold active:bg-[#333] transition-colors"
        >
          <HouseIcon />
          {t.bookingConfirmed.backHome}
        </button>

        {/* Add to Calendar */}
        <button
          onClick={() => downloadIcs(activity, date, slot)}
          className="flex items-center justify-center gap-[8px] h-[48px] w-full rounded-[80px] border border-black bg-white text-black text-[16px] font-bold active:bg-[#f5f5f5] transition-colors"
        >
          <CalendarIcon />
          {t.bookingConfirmed.addToCalendar}
        </button>

      </div>
    </div>
  )
}
