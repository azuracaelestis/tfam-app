'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from './BottomNav'
import HomeCards from './HomeCards'
import AudioInputSheet from './AudioInputSheet'

export default function HomeClient() {
  const router = useRouter()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [code, setCode] = useState('')

  const handleDigit = (d: string) => {
    setCode((prev) => (prev.length < 4 ? prev + d : prev))
  }
  const handleDelete = () => setCode((prev) => prev.slice(0, -1))
  const handleClose = () => { setSheetOpen(false); setCode('') }
  const handlePlay = () => router.push('/play?code=' + code)
  const handleQR = () => router.push('/play?code=1001')  // stub: always demo artwork

  return (
    <div className="min-h-screen bg-white flex flex-col pb-16">
      {/* Top bar */}
      <div className="px-5 pt-8 pb-4 flex items-start justify-between">
        <div>
          <p className="text-[10px] font-medium tracking-[0.2em] text-tfam-mid uppercase">
            Taipei Fine Arts Museum
          </p>
          <h1 className="text-2xl font-bold text-tfam-red mt-0.5 tracking-tight">TFAM</h1>
        </div>
        <button
          className="w-9 h-9 flex flex-col justify-center gap-1.5 items-end"
          aria-label="Menu"
        >
          <span className="block w-5 h-0.5 bg-tfam-dark rounded" />
          <span className="block w-7 h-0.5 bg-tfam-dark rounded" />
        </button>
      </div>

      {/* Hero section */}
      <div className="mx-4 mb-5 rounded-3xl bg-tfam-dark overflow-hidden relative">
        <div className="px-6 pt-8 pb-6">
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">
            Collection Guide
          </p>
          <h2 className="text-2xl font-bold text-white leading-snug mb-1">
            Discover the<br />Collection
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Enter an artwork code to hear the curator&apos;s guide.
          </p>
          <button
            onClick={() => setSheetOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-tfam-red text-white text-sm font-semibold"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
              <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
            </svg>
            Start Audio Guide
          </button>
        </div>
        {/* Decorative circle */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-tfam-red opacity-20" />
      </div>

      {/* Info cards */}
      <HomeCards />

      {/* Bottom nav */}
      <BottomNav active={0} />

      {/* Audio input sheet */}
      <AudioInputSheet
        open={sheetOpen}
        code={code}
        onDigit={handleDigit}
        onDelete={handleDelete}
        onClose={handleClose}
        onPlay={handlePlay}
        onQR={handleQR}
      />
    </div>
  )
}
