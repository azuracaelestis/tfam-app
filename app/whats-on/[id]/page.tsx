import { notFound } from 'next/navigation'
import { getById } from '@/lib/exhibitions'
import ExhibitionDetailClient from '@/components/ExhibitionDetailClient'

export default async function ExhibitionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ from?: string }>
}) {
  const { id } = await params
  const { from } = await searchParams
  const exhibition = getById(id)
  if (!exhibition) notFound()
  return <ExhibitionDetailClient ex={exhibition} fromCard={from === 'card'} />
}
