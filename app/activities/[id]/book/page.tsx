import { notFound } from 'next/navigation'
import { getActivityById } from '@/lib/activities'
import ChooseDateClient from '@/components/ChooseDateClient'

export default async function ChooseDatePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ from?: string }>
}) {
  const { id } = await params
  const { from } = await searchParams
  const activity = getActivityById(id)
  if (!activity) notFound()

  return <ChooseDateClient activityId={id} activity={activity} from={from} />
}
