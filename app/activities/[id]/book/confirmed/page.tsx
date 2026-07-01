import { notFound } from 'next/navigation'
import { getActivityById } from '@/lib/activities'
import BookingConfirmedClient from '@/components/BookingConfirmedClient'

export default async function BookingConfirmedPage({
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
    <BookingConfirmedClient
      activity={activity}
      date={date}
      slot={slot}
    />
  )
}
