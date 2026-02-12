import { describe, expect, it } from 'vitest'

import { buildMasonryLayout, getVisiblePositions } from './masonry'
import type { ContentItem } from '../../types/content'

function mockItem(id: string, height: number): ContentItem {
  return {
    id,
    title: id,
    description: 'desc',
    category: 'art',
    tags: ['tag'],
    imageUrl: 'https://example.com',
    imageWidth: 300,
    imageHeight: height,
    likedCount: 100,
  }
}

describe('masonry layout', () => {
  it('builds positions with valid total height', () => {
    const items = [mockItem('1', 300), mockItem('2', 500), mockItem('3', 220), mockItem('4', 460)]
    const layout = buildMasonryLayout(items, 1000, 12, 240, new Map())

    expect(layout.positions).toHaveLength(items.length)
    expect(layout.columnCount).toBeGreaterThan(1)
    expect(layout.totalHeight).toBeGreaterThan(0)
  })

  it('returns only visible positions', () => {
    const items = Array.from({ length: 30 }, (_, i) => mockItem(`id-${i}`, 300 + i))
    const layout = buildMasonryLayout(items, 900, 10, 260, new Map())

    const visible = getVisiblePositions(layout.positions, 0, 600, 200)
    const invisible = getVisiblePositions(layout.positions, 5000, 600, 0)

    expect(visible.length).toBeGreaterThan(0)
    expect(invisible.length).toBeLessThan(visible.length)
  })
})
