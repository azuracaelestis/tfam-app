import { notFound } from 'next/navigation'
import { getActivityById } from '@/lib/activities'
import ChooseDateClient from '@/components/ChooseDateClient'

export default async function ChooseDatePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const activity = getActivityById(id)
  if (!activity) notFound()

  return <ChooseDateClient activityId={id} activity={activity} />
}
