'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { type Activity, scheduledDates } from '@/lib/activities'

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function buildCalendarGrid(year: number, month: number): (number | null)[] {
  const firstDow = new Date(year, month, 1).getDay()  // 0=Sun
  const offset = (firstDow + 6) % 7                   // Mo-first offset
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = Array(offset).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function toIso(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="white" strokeWidth="1.4" />
      <path d="M8 5v3.5l2 2" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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

function ChevronRight() {
  return (
    <svg width="6" height="12" viewBox="0 0 6 12" fill="none" aria-hidden="true">
      <path d="M1 1l4 5-4 5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ChooseDateClient({
  activityId,
  activity,
}: {
  activityId: string
  activity: Activity
}) {
  const router = useRouter()
  const now = new Date()
  const todayIso = toIso(now.getFullYear(), now.getMonth(), now.getDate())

  // Start calendar at the first month that has a scheduled date in the future,
  // defaulting to current month.
  const firstFuture = (scheduledDates[activityId] ?? []).find(s => s.date >= todayIso)
  const startDate = firstFuture ? new Date(firstFuture.date + 'T00:00:00') : now
  const [year, setYear] = useState(startDate.getFullYear())
  const [month, setMonth] = useState(startDate.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()
  const cells = buildCalendarGrid(year, month)
  const rows: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7))

  const activitySchedule = scheduledDates[activityId] ?? []

  function prevMonth() {
    if (isCurrentMonth) return
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelectedDate(null)
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelectedDate(null)
  }

  function handleDayClick(day: number) {
    const iso = toIso(year, month, day)
    const scheduled = activitySchedule.find(s => s.date === iso)
    const isPast = iso < todayIso
    if (!scheduled || scheduled.full || isPast) return
    setSelectedDate(iso === selectedDate ? null : iso)
  }

  function handleCTA() {
    if (!selectedDate) return
    router.push(`/activities/${activityId}/book/confirm?date=${selectedDate}`)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-noto pb-[69px]">

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-10 bg-white h-[47px] px-5 flex items-center shrink-0">
        <button
          onClick={() => router.push('/activities')}
          className="flex items-center gap-[12px] active:opacity-60 transition-opacity"
          aria-label="Back to Activities"
        >
          <ChevronLeft />
          <span className="text-[20px] font-bold text-black leading-none">Activities</span>
        </button>
      </header>

      {/* ── Main content ── */}
      <div className="flex flex-col gap-[48px] px-[16px] pt-[16px]">

        {/* ── Activity summary card ── */}
        <div className="bg-[#f5f5f5] border border-[#d6d6d6] rounded-[16px] px-[24px] py-[12px] flex flex-col gap-[4px]">
          <p className="text-[20px] font-semibold text-black leading-snug">{activity.title}</p>
          <p className="text-[15px] font-normal text-black leading-snug">
            {activity.tags.join(' · ')}
          </p>
        </div>

        {/* ── Calendar ── */}
        <div className="flex flex-col gap-[24px]">

          {/* Calendar header */}
          <div className="flex items-center gap-[29px]">
            <button
              onClick={prevMonth}
              disabled={isCurrentMonth}
              className="size-[32px] flex items-center justify-center rounded-full active:bg-[#f0f0f0] disabled:opacity-20 transition-opacity"
              aria-label="Previous month"
            >
              <ChevronLeft />
            </button>
            <p className="flex-1 text-[16px] font-semibold text-black text-center leading-none">
              {MONTHS[month]} {year}
            </p>
            <button
              onClick={nextMonth}
              className="size-[32px] flex items-center justify-center rounded-full active:bg-[#f0f0f0] transition-opacity"
              aria-label="Next month"
            >
              <ChevronRight />
            </button>
          </div>

          {/* Calendar grid */}
          <div className="flex flex-col gap-[24px]">
            {/* Weekday headers */}
            <div className="flex justify-between">
              {WEEKDAYS.map(d => (
                <div key={d} className="size-[24px] flex items-center justify-center">
                  <span className="text-[16px] font-medium text-black leading-none">{d}</span>
                </div>
              ))}
            </div>

            {/* Date rows */}
            {rows.map((row, ri) => (
              <div key={ri} className="flex gap-[32px] items-center">
                {row.map((day, ci) => {
                  if (day === null) {
                    return <div key={ci} className="size-[24px] shrink-0" />
                  }

                  const iso = toIso(year, month, day)
                  const scheduled = activitySchedule.find(s => s.date === iso)
                  const isPast = iso < todayIso
                  const isSelected = selectedDate === iso
                  const isFull = !!scheduled && scheduled.full
                  const isAvailable = !!scheduled && !scheduled.full && !isPast

                  if (isSelected) {
                    return (
                      <button
                        key={ci}
                        onClick={() => handleDayClick(day)}
                        className="bg-black p-[4px] rounded-[8px] shrink-0 active:opacity-70"
                      >
                        <div className="size-[24px] rounded-[4px] flex items-center justify-center">
                          <span className="text-[14px] font-bold text-white leading-none">{day}</span>
                        </div>
                      </button>
                    )
                  }

                  if (isAvailable) {
                    return (
                      <button
                        key={ci}
                        onClick={() => handleDayClick(day)}
                        className="bg-[#f5f5f5] border border-[#d9d9d9] p-[4px] rounded-[8px] shrink-0 active:opacity-70"
                      >
                        <div className="size-[24px] rounded-[4px] flex items-center justify-center">
                          <span className="text-[14px] font-bold text-black leading-none">{day}</span>
                        </div>
                      </button>
                    )
                  }

                  if (isFull) {
                    return (
                      <div key={ci} className="size-[24px] rounded-[4px] shrink-0 flex items-center justify-center">
                        <span className="text-[14px] font-normal text-black line-through leading-none">{day}</span>
                      </div>
                    )
                  }

                  // Plain day (no schedule) or past
                  return (
                    <div key={ci} className={`size-[24px] rounded-[4px] shrink-0 flex items-center justify-center ${isPast ? 'opacity-30' : ''}`}>
                      <span className="text-[14px] font-normal text-black leading-none">{day}</span>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-[18px]">
            <div className="flex items-center gap-[4px]">
              <div className="bg-black size-[10px] rounded-[2px] shrink-0" />
              <span className="text-[14px] text-black leading-none">Selected</span>
            </div>
            <div className="flex items-center gap-[4px]">
              <div className="bg-[#f5f5f5] border-[0.5px] border-[#d9d9d9] size-[10px] rounded-[2px] shrink-0" />
              <span className="text-[14px] text-black leading-none">Available</span>
            </div>
            <div className="flex items-center gap-[4px]">
              <div className="bg-[#f5f5f5] size-[10px] rounded-[2px] shrink-0" />
              <span className="text-[14px] text-black line-through leading-none">Full</span>
            </div>
          </div>
        </div>

        {/* ── CTA button ── */}
        <button
          onClick={handleCTA}
          disabled={!selectedDate}
          className="flex items-center justify-center gap-[8px] h-[48px] w-full rounded-[80px] bg-black text-white text-[16px] font-bold disabled:opacity-40 transition-opacity active:bg-[#333]"
        >
          <ClockIcon />
          Choose a time slot
        </button>
      </div>
    </div>
  )
}
