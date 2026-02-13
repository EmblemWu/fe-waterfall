import type { Category, ContentItem } from '../types/content'

const categories: Category[] = ['nature', 'technology', 'art', 'people', 'travel']
const titleTokens = [
  'Aurora',
  'Blueprint',
  'Pulse',
  'Canvas',
  'Echo',
  'Frame',
  'Atlas',
  'Signal',
  'Orbit',
  'Drift',
]
const tagTokens = ['minimal', 'color', 'editorial', 'fresh', 'pro', 'daily', 'cinema', 'urban']
const authorPool = Array.from({ length: 48 }, (_, index) => ({
  id: `author-${index + 1}`,
  name: `Creator ${index + 1}`,
}))

function seeded(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function pick<T>(list: T[], random: () => number): T {
  const index = Math.floor(random() * list.length)
  return list[index]!
}

function buildImageUrls(seed: number, width: number, height: number): string[] {
  return [0, 1, 2].map(
    (offset) => `https://picsum.photos/seed/waterfall-${seed + offset}/${width}/${height}`,
  )
}

function generateMockContent(count: number): ContentItem[] {
  const random = seeded(20260213)

  return Array.from({ length: count }, (_, index) => {
    const id = `item-${index + 1}`
    const category = pick(categories, random)
    const author = pick(authorPool, random)
    const imageWidth = 260 + Math.floor(random() * 180)
    const imageHeight = 220 + Math.floor(random() * 420)
    const first = pick(titleTokens, random)
    const second = pick(titleTokens, random)
    const tags = Array.from(new Set([pick(tagTokens, random), pick(tagTokens, random)]))
    const imageUrls = buildImageUrls(index + 1, imageWidth, imageHeight)

    return {
      id,
      title: `${first} ${second} #${index + 1}`,
      description:
        'High-interaction content sample used for virtualization, search, detail and social actions.',
      authorId: author.id,
      authorName: author.name,
      category,
      tags,
      imageWidth,
      imageHeight,
      imageUrl: imageUrls[0]!,
      imageUrls,
      likedCount: 20 + Math.floor(random() * 900),
    }
  })
}

export const CONTENT_DATASET = generateMockContent(12000)
export const CONTENT_BY_ID = new Map(CONTENT_DATASET.map((item) => [item.id, item]))
export const AUTHORS = authorPool
