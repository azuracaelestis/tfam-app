'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNotificationSettings, ALL_CATEGORIES, type Category } from '@/lib/useNotificationSettings'

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

function RemoveIcon() {
  return (
    <svg width="6" height="6" viewBox="0 0 6 6" fill="none" aria-hidden="true">
      <path d="M1 1l4 4M5 1L1 5" stroke="black" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
      <path d="M4.5 1v7M1 4.5h7" stroke="black" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative w-[50px] h-[28px] rounded-full border border-[#d9d9d9] p-[4px] flex items-center shrink-0 transition-colors ${value ? 'bg-black justify-end' : 'bg-[#9c9c9c] justify-start'}`}
    >
      <span className="block size-[19px] bg-white rounded-full shrink-0" />
    </button>
  )
}

function AlertCard({ title, subtitle, value, onChange }: {
  title: string
  subtitle: string | React.ReactNode
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="w-full flex items-center justify-between bg-white border border-[#d6d6d6] rounded-[16px] p-[18px]">
      <div className="flex flex-col gap-[4px] w-[207px]">
        <span className="text-[16px] font-semibold text-black leading-normal">{title}</span>
        <div className="text-[13px] font-normal text-black leading-normal">{subtitle}</div>
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  )
}

export default function NotificationsClient() {
  const router = useRouter()
  const [settings, update] = useNotificationSettings()
  const [pickerOpen, setPickerOpen] = useState(false)

  const available = ALL_CATEGORIES.filter(c => !settings.interests.includes(c as Category))

  function removeInterest(cat: Category) {
    update({ interests: settings.interests.filter(c => c !== cat) })
  }

  function addInterest(cat: Category) {
    update({ interests: [...settings.interests, cat] })
    setPickerOpen(false)
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
          <span className="text-[20px] font-bold text-black leading-none">Notifications</span>
        </button>
      </header>

      {/* Content */}
      <div className="flex flex-col gap-[24px] px-[15px] pt-[16px] pb-[69px]">

        {/* Alert Types */}
        <div className="flex flex-col gap-[12px]">
          <p className="text-[20px] font-medium text-black leading-normal">Alert Types</p>
          <div className="flex flex-col gap-[12px]">
            <AlertCard
              title="Exhibition alerts"
              subtitle="Notified when a new exhibition matching your interests opens"
              value={settings.exhibitionAlerts}
              onChange={v => update({ exhibitionAlerts: v })}
            />
            <AlertCard
              title="New activities"
              subtitle="Notified when new dates open for activities you follow"
              value={settings.newActivities}
              onChange={v => update({ newActivities: v })}
            />
            <AlertCard
              title="Saturday reminder"
              subtitle={
                <>
                  <p>Every Friday at 16:00</p>
                  <p>Free entry reminder for Saturday night</p>
                </>
              }
              value={settings.saturdayReminder}
              onChange={v => update({ saturdayReminder: v })}
            />
          </div>
        </div>

        {/* Your Interests */}
        <div className="flex flex-col gap-[12px]">
          <p className="text-[20px] font-medium text-black leading-normal">Your Interests</p>
          <div className="border border-[#d6d6d6] rounded-[16px] p-[18px] flex flex-col gap-[12px]">
            <p className="text-[16px] font-semibold text-black w-[260px] leading-normal">
              Exhibition alerts are sent based on these categories
            </p>
            {/* Pills */}
            <div className="flex flex-col gap-[12px]">
              <div className="flex flex-wrap gap-[8px]">
                {settings.interests.map(cat => (
                  <span
                    key={cat}
                    className="flex items-center gap-[9px] bg-[#f2f2f2] border border-[#d9d9d9] rounded-[32px] px-[24px] py-[8px]"
                  >
                    <span className="text-[14px] font-normal text-black whitespace-nowrap">{cat}</span>
                    <button
                      onClick={() => removeInterest(cat as Category)}
                      className="shrink-0 active:opacity-60"
                      aria-label={`Remove ${cat}`}
                    >
                      <RemoveIcon />
                    </button>
                  </span>
                ))}

                {/* + Add pill */}
                {available.length > 0 && (
                  <button
                    onClick={() => setPickerOpen(o => !o)}
                    className="flex items-center gap-[9px] bg-white border border-dashed border-[#d9d9d9] rounded-[32px] px-[24px] py-[8px] active:opacity-60 transition-opacity"
                  >
                    <PlusIcon />
                    <span className="text-[14px] font-normal text-black whitespace-nowrap">Add</span>
                  </button>
                )}
              </div>

              {/* Inline picker */}
              {pickerOpen && available.length > 0 && (
                <div className="border border-[#d6d6d6] rounded-[12px] overflow-hidden">
                  {available.map((cat, i) => (
                    <button
                      key={cat}
                      onClick={() => addInterest(cat as Category)}
                      className={`w-full text-left px-[16px] py-[12px] text-[14px] font-normal text-black active:bg-[#f5f5f5] transition-colors ${i > 0 ? 'border-t border-[#ebebeb]' : ''}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-[#ebf6ff] rounded-[16px] p-[18px] flex gap-[10px] items-start">
          <InfoIcon />
          <p className="text-[14px] font-normal text-black leading-normal">
            Notifications require permission from your device. To change this, go to phone settings → TFAM → Notification
          </p>
        </div>

      </div>
    </div>
  )
}
