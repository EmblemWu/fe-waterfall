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

function generateMockContent(count: number): ContentItem[] {
  const random = seeded(20260212)

  return Array.from({ length: count }, (_, index) => {
    const id = `item-${index + 1}`
    const category = pick(categories, random)
    const imageWidth = 260 + Math.floor(random() * 180)
    const imageHeight = 220 + Math.floor(random() * 420)
    const first = pick(titleTokens, random)
    const second = pick(titleTokens, random)
    const tags = Array.from(new Set([pick(tagTokens, random), pick(tagTokens, random)]))

    return {
      id,
      title: `${first} ${second} #${index + 1}`,
      description:
        'High-interaction content sample used for virtualization, search and detail exploration.',
      category,
      tags,
      imageWidth,
      imageHeight,
      imageUrl: `https://picsum.photos/id/${(index % 1000) + 1}/${imageWidth}/${imageHeight}`,
      likedCount: 20 + Math.floor(random() * 900),
    }
  })
}

export const CONTENT_DATASET = generateMockContent(12000)
export const CONTENT_BY_ID = new Map(CONTENT_DATASET.map((item) => [item.id, item]))
