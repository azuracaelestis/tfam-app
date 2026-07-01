'use client'
import { useState } from 'react'

export const ALL_CATEGORIES = [
  'Contemporary',
  'Installation Art',
  'Photography',
  'Sculpture',
  'Tours',
  'Festivals',
] as const

export type Category = typeof ALL_CATEGORIES[number]

export type NotificationSettings = {
  exhibitionAlerts: boolean
  newActivities: boolean
  saturdayReminder: boolean
  interests: Category[]
}

const DEFAULTS: NotificationSettings = {
  exhibitionAlerts: true,
  newActivities: true,
  saturdayReminder: true,
  interests: ['Installation Art', 'Photography', 'Sculpture'],
}

function load(): NotificationSettings {
  if (typeof window === 'undefined') return DEFAULTS
  try {
    const raw = localStorage.getItem('tfam-notif')
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return DEFAULTS
  }
}

export function useNotificationSettings(): [
  NotificationSettings,
  (patch: Partial<NotificationSettings>) => void,
] {
  const [settings, setSettings] = useState<NotificationSettings>(load)

  function update(patch: Partial<NotificationSettings>) {
    const next = { ...settings, ...patch }
    localStorage.setItem('tfam-notif', JSON.stringify(next))
    setSettings(next)
  }

  return [settings, update]
}
