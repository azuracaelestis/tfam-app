interface ArtworkCardProps {
  title: string
  description: string
  imageUrl: string
}

export default function ArtworkCard({ title, description, imageUrl }: ArtworkCardProps) {
  return (
    <div className="flex flex-col">
      <div className="w-full aspect-[4/3] bg-tfam-light overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="px-5 pt-5 pb-4">
        <h1 className="text-xl font-bold text-tfam-dark leading-snug mb-2">{title}</h1>
        <p className="text-sm text-tfam-mid leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
