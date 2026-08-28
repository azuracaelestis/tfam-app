import { notFound } from 'next/navigation'
import { getById } from '@/lib/exhibitions'
import ExhibitionDetailClient from '@/components/ExhibitionDetailClient'

export default async function ExhibitionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const exhibition = getById(id)
  if (!exhibition) notFound()
  return <ExhibitionDetailClient ex={exhibition} />
}
