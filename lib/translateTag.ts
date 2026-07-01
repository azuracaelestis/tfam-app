import type { T } from './translations'

export function translateTag(raw: string, t: T): string {
  if (raw === 'Free')      return t.activities.tagFree
  if (raw === 'Classes')   return t.activities.tagClasses
  if (raw === 'Tours')     return t.activities.tagTours
  if (raw === 'Festivals') return t.activities.tagFestivals
  if (raw === 'All ages')  return t.activities.tagAllAges
  const hrs = raw.match(/^(\d+(?:\.\d+)?) hrs$/)
  if (hrs) return t.activities.hrsSuffix.replace('{n}', hrs[1])
  const hr = raw.match(/^(\d+(?:\.\d+)?) hr$/)
  if (hr) return t.activities.hrsSingular.replace('{n}', hr[1])
  const age = raw.match(/^Age (\d+)\+$/)
  if (age) return t.activities.ageSuffix.replace('{n}', age[1])
  return raw
}
