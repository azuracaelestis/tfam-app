'use client'
import { type Language } from '@/lib/artworks'

interface LanguagePickerProps {
  lang: Language
  onChange: (l: Language) => void
}

export default function LanguagePicker({ lang, onChange }: LanguagePickerProps) {
  return (
    <select
      value={lang}
      onChange={(e) => onChange(e.target.value as Language)}
      className="text-sm font-medium text-tfam-dark bg-white border border-tfam-border rounded-lg px-3 py-1.5 appearance-none cursor-pointer"
      aria-label="Language"
    >
      <option value="en">EN</option>
      <option value="zh">中文</option>
    </select>
  )
}
