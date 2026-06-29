import { notFound } from 'next/navigation'
import { getActivityById } from '@/lib/activities'

// Frame 2: Choose Date — stub (TODO: build next)
export default async function ChooseDatePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const activity = getActivityById(id)
  if (!activity) notFound()

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-noto pb-[69px] px-6 text-center">
      <p className="text-[20px] font-bold text-black">Choose a Date</p>
      <p className="text-[14px] text-[#666] mt-2">{activity.title}</p>
      <p className="text-[13px] text-[#999] mt-6">Frame 2 — coming soon</p>
    </div>
  )
}
