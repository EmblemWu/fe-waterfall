import type { ContentItem } from '../../types/content'
import { measure } from '../../lib/perf'

export interface MasonryPosition {
  id: string
  x: number
  y: number
  width: number
  height: number
  index: number
  item: ContentItem
}

export interface MasonryLayout {
  positions: MasonryPosition[]
  totalHeight: number
  columnCount: number
  columnWidth: number
}

function estimateHeight(item: ContentItem, columnWidth: number): number {
  const mediaHeight = Math.max(120, (item.imageHeight / item.imageWidth) * columnWidth)
  const metadata = 108
  return mediaHeight + metadata
}

export function buildMasonryLayout(
  items: ContentItem[],
  containerWidth: number,
  gap: number,
  minColumnWidth: number,
  heightCache: Map<string, number>,
): MasonryLayout {
  return measure('buildMasonryLayout', () => {
    const effectiveWidth = Math.max(containerWidth, minColumnWidth)
    const columnCount = Math.max(1, Math.floor((effectiveWidth + gap) / (minColumnWidth + gap)))
    const columnWidth = (effectiveWidth - gap * (columnCount - 1)) / columnCount
    const columnHeights = new Array<number>(columnCount).fill(0)

    const positions = items.map((item, index) => {
      let targetColumn = 0
      for (let i = 1; i < columnCount; i += 1) {
        if (columnHeights[i]! < columnHeights[targetColumn]!) {
          targetColumn = i
        }
      }

      const cachedHeight = heightCache.get(item.id)
      const height = cachedHeight ?? estimateHeight(item, columnWidth)
      const x = targetColumn * (columnWidth + gap)
      const y = columnHeights[targetColumn]!
      columnHeights[targetColumn] = y + height + gap

      return {
        id: item.id,
        x,
        y,
        width: columnWidth,
        height,
        index,
        item,
      }
    })

    const totalHeight = Math.max(0, ...columnHeights) - gap

    return { positions, totalHeight, columnCount, columnWidth }
  })
}

export function getVisiblePositions(
  positions: MasonryPosition[],
  scrollTop: number,
  viewportHeight: number,
  overscan: number,
): MasonryPosition[] {
  const min = Math.max(0, scrollTop - overscan)
  const max = scrollTop + viewportHeight + overscan

  return positions.filter((position) => position.y + position.height >= min && position.y <= max)
}
