'use client'
import { type Language } from '@/lib/artworks'

interface LanguagePickerProps {
  lang: Language
  onChange: (l: Language) => void
}

export default function LanguagePicker({ lang, onChange }: LanguagePickerProps) {
  return (
    <div className="relative shrink-0">
      <select
        value={lang}
        onChange={(e) => onChange(e.target.value as Language)}
        className="bg-white border border-[#d9d9d9] rounded-[8px] h-[36px] w-[64px] pl-3 pr-6 text-sm text-black appearance-none cursor-pointer"
        aria-label="Language"
      >
        <option value="en">EN</option>
        <option value="zh">中文</option>
      </select>
      {/* Chevron */}
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
        <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M1 1L4.5 5L8 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}
