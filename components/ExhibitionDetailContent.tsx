'use client'
import { type Exhibition, fmtLong } from '@/lib/exhibitions'
import { useTranslation } from '@/lib/useTranslation'

function MetaDot() {
  return <span className="shrink-0 size-[3px] rounded-full bg-[#4f4f4f]" />
}

export default function ExhibitionDetailContent({
  ex,
  lang,
  onStartAudio,
  onSeeOnMap,
}: {
  ex: Exhibition
  lang: 'en' | 'zh'
  onStartAudio: () => void
  onSeeOnMap: () => void
}) {
  const t = useTranslation()
  const locationLabel = `${ex.floor} ${ex.gallery}`.trim()
  const dateLabel = ex.endDate ? fmtLong(ex.endDate, lang === 'zh' ? 'zh-TW' : 'en-GB') : null
  const durationLabel = t.exhibitionDetail.durationMins.replace('{n}', String(ex.duration))
  const description = lang === 'zh' && ex.descriptionZh ? ex.descriptionZh : ex.description

  return (
    <div className="px-5 py-6 flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] font-semibold text-black leading-normal">{ex.title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <img src="/exhibit-location.svg" width={15} height={14} alt="" aria-hidden="true" className="shrink-0" />
                <span className="text-sm text-[#4f4f4f] whitespace-nowrap">{locationLabel}</span>
              </div>
              {dateLabel && (
                <>
                  <MetaDot />
                  <div className="flex items-center gap-2">
                    <img src="/exhibit-date.svg" width={15} height={15} alt="" aria-hidden="true" className="shrink-0" />
                    <span className="text-sm text-[#4f4f4f] whitespace-nowrap">{dateLabel}</span>
                  </div>
                </>
              )}
              <MetaDot />
              <div className="flex items-center gap-2">
                <img src="/exhibit-clock.svg" width={15} height={15} alt="" aria-hidden="true" className="shrink-0" />
                <span className="text-sm text-[#4f4f4f] whitespace-nowrap">{durationLabel}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-black leading-normal">{description}</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onStartAudio}
            className="h-[48px] w-full rounded-pill bg-[#0a0a0a] text-white text-base font-semibold flex items-center justify-center gap-2 active:bg-[#2a2a2a] transition-colors duration-75"
          >
            <img src="/audio-headphone-white.svg" width={16} height={16} alt="" aria-hidden="true" />
            {t.home.startAudioGuide}
          </button>
          <button
            onClick={onSeeOnMap}
            className="h-[48px] w-full rounded-pill bg-white border border-[#0a0a0a] text-[#0a0a0a] text-base font-semibold flex items-center justify-center gap-2 active:bg-[#f5f5f5] transition-colors duration-75"
          >
            <img src="/exhibit-map.svg" width={18} height={16} alt="" aria-hidden="true" />
            {t.exhibitionDetail.seeOnMap}
          </button>
        </div>
      </div>

      <div className="h-px w-full bg-hairline" />

      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-black">{t.exhibitionDetail.aboutTitle}</h2>
        <p className="text-sm text-black leading-normal whitespace-pre-line">{ex.fullDescription}</p>
      </div>
    </div>
  )
}
