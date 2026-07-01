'use client'
import { useSyncExternalStore } from 'react'

export type Language = 'en' | 'zh'

// Read persisted value once at module evaluation — safe because this
// module is only ever evaluated in the browser ('use client').
let current: Language =
  typeof window !== 'undefined' && localStorage.getItem('tfam-lang') === 'zh'
    ? 'zh'
    : 'en'

const listeners = new Set<() => void>()

function notify() {
  listeners.forEach(fn => fn())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function getSnapshot(): Language { return current }
function getServerSnapshot(): Language { return 'en' }

export function setLanguage(l: Language) {
  current = l
  localStorage.setItem('tfam-lang', l)
  notify()
}

export function useLanguage(): [Language, (l: Language) => void] {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return [lang, setLanguage]
}
