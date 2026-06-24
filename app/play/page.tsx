import PlayClient from '@/components/PlayClient'

export default async function PlayPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { code = '' } = await searchParams
  const resolvedCode = Array.isArray(code) ? code[0] : code

  return <PlayClient code={resolvedCode} />
}
