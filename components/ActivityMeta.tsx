export default function ActivityMeta({ duration, age }: { duration?: string; age?: string }) {
  if (!duration && !age) return null
  return (
    <div className="flex items-center gap-2">
      {duration && (
        <div className="flex items-center gap-1">
          <img src="/exhibit-clock.svg" width={12} height={12} alt="" aria-hidden="true" className="shrink-0" />
          <span className="text-xs text-[#4f4f4f] whitespace-nowrap">{duration}</span>
        </div>
      )}
      {duration && age && <span className="shrink-0 size-[3px] rounded-full bg-[#4f4f4f]" />}
      {age && (
        <div className="flex items-center gap-1">
          <img src="/activity-user.svg" width={12} height={12} alt="" aria-hidden="true" className="shrink-0" />
          <span className="text-xs text-[#4f4f4f] whitespace-nowrap">{age}</span>
        </div>
      )}
    </div>
  )
}
