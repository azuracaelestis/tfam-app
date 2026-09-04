// Shared primitive for every per-screen skeleton (see SkeletonReveal.tsx).
// A single pulsing gray block — screens compose these into their own rough
// layout rather than sharing one generic placeholder shape.
export default function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`bg-[#ececec] rounded-[8px] animate-pulse ${className}`} />
}
