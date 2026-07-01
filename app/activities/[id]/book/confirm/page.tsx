import { notFound } from 'next/navigation'
import { getActivityById } from '@/lib/activities'
import ConfirmBookingClient from '@/components/ConfirmBookingClient'

export default async function ConfirmPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ date?: string; slot?: string }>
}) {
  const { id } = await params
  const { date, slot } = await searchParams
  const activity = getActivityById(id)
  if (!activity || !date || !slot) notFound()

  return (
    <ConfirmBookingClient
      activityId={id}
      activity={activity}
      date={date}
      slot={slot}
    />
  )
}
