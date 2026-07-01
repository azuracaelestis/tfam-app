'use client'
import { useState } from 'react'

export type Language = 'en' | 'zh'

export function useLanguage(): [Language, (l: Language) => void] {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en'
    return localStorage.getItem('tfam-lang') === 'zh' ? 'zh' : 'en'
  })

  function setLanguage(l: Language) {
    localStorage.setItem('tfam-lang', l)
    setLangState(l)
  }

  return [lang, setLanguage]
}
