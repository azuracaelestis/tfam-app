export type Language = 'en' | 'zh'

export interface ArtworkLocale {
  title: string
  description: string
}

export interface Artwork {
  code: string
  imageUrl: string
  audioSrc: string
  locales: Record<Language, ArtworkLocale>
}

export const artworks: Artwork[] = [
  {
    code: '1001',
    imageUrl: '/images/artwork-1.svg',
    audioSrc: '/audio/guide.wav',
    locales: {
      en: {
        title: 'Untitled No. 7',
        description:
          'A seminal work from the 1980s exploring the tension between urban memory and natural form. The artist layers industrial materials against organic textures, inviting viewers to reconsider the boundaries between the built and the living.',
      },
      zh: {
        title: '無題第七號',
        description:
          '1980年代的重要作品，探索城市記憶與自然形式之間的張力。藝術家將工業材料與有機質感相互疊加，邀請觀者重新思考人造環境與自然生命之間的界線。',
      },
    },
  },
  {
    code: '2043',
    imageUrl: '/images/artwork-2.svg',
    audioSrc: '/audio/guide.wav',
    locales: {
      en: {
        title: 'Passage Through Light',
        description:
          'An installation using neon tubing and hand-made rice paper to examine translucency and cultural threshold. Light bleeds through the fibre of the paper in ways that evoke lantern festivals and the passage of memory across generations.',
      },
      zh: {
        title: '光之通道',
        description:
          '使用霓虹燈管與手工宣紙的裝置作品，探討半透明性與文化臨界的關係。光線穿透紙張纖維的方式，令人聯想到燈節的景象，以及記憶跨越世代的流傳。',
      },
    },
  },
]

export function getArtworkByCode(code: string): Artwork | undefined {
  return artworks.find((a) => a.code === code)
}
