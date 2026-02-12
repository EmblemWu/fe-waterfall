import styles from './VirtualizedMasonry.module.css'
import { FeedCard } from './FeedCard'
import { PerformancePanel } from './PerformancePanel'
import { useVirtualMasonry } from './useVirtualMasonry'
import type { ContentItem } from '../../types/content'

interface VirtualizedMasonryProps {
  items: ContentItem[]
  overscan: number
  minColumnWidth: number
  gap: number
  restoreKey: string
  favoriteSet: Set<string>
  onToggleFavorite: (id: string) => void
}

export function VirtualizedMasonry({
  items,
  overscan,
  minColumnWidth,
  gap,
  restoreKey,
  favoriteSet,
  onToggleFavorite,
}: VirtualizedMasonryProps) {
  const { containerRef, layout, visiblePositions, onMeasure, cacheSize } = useVirtualMasonry({
    items,
    overscan,
    minColumnWidth,
    gap,
    restoreKey,
  })

  return (
    <section ref={containerRef} className={styles.container} aria-label="内容流">
      <div className={styles.viewport} style={{ height: layout.totalHeight }}>
        {visiblePositions.map((position) => (
          <div
            key={position.id}
            className={styles.item}
            style={{
              width: position.width,
              transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            }}
          >
            <FeedCard
              item={position.item}
              isFavorite={favoriteSet.has(position.id)}
              onFavoriteToggle={onToggleFavorite}
              onMeasure={onMeasure}
            />
          </div>
        ))}
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
        虚拟渲染: 当前渲染 {visiblePositions.length} / 总计 {items.length}，高度缓存 {cacheSize}
      </p>
      <PerformancePanel
        rendered={visiblePositions.length}
        total={items.length}
        cacheSize={cacheSize}
      />
    </section>
  )
}
