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
  likedSet: Set<string>
  followingSet: Set<string>
  likeCounts: Map<string, number>
  onToggleFavorite: (id: string) => Promise<void>
  onToggleLike: (id: string) => Promise<void>
  onToggleFollow: (authorId: string) => Promise<void>
  enableVirtualization: boolean
  showPanel?: boolean
}

export function VirtualizedMasonry({
  items,
  overscan,
  minColumnWidth,
  gap,
  restoreKey,
  favoriteSet,
  likedSet,
  followingSet,
  likeCounts,
  onToggleFavorite,
  onToggleLike,
  onToggleFollow,
  enableVirtualization,
  showPanel = false,
}: VirtualizedMasonryProps) {
  const { containerRef, layout, visiblePositions, onMeasure, cacheSize } = useVirtualMasonry({
    items,
    overscan,
    minColumnWidth,
    gap,
    restoreKey,
  })
  const renderPositions = enableVirtualization ? visiblePositions : layout.positions

  return (
    <section ref={containerRef} className="relative w-full" aria-label="内容流">
      <div className="relative w-full" style={{ height: layout.totalHeight }}>
        {renderPositions.map((position) => (
          <div
            key={position.id}
            className="absolute will-change-transform [contain:layout_style_paint]"
            style={{
              width: position.width,
              transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            }}
          >
            <FeedCard
              item={position.item}
              isFavorite={favoriteSet.has(position.id)}
              isLiked={likedSet.has(position.id)}
              isFollowing={followingSet.has(position.item.authorId)}
              likeCount={likeCounts.get(position.id) ?? position.item.likedCount}
              onFavoriteToggle={onToggleFavorite}
              onLikeToggle={onToggleLike}
              onFollowToggle={onToggleFollow}
              onMeasure={onMeasure}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-[var(--text-muted)]">
        {enableVirtualization ? '虚拟渲染' : '全量渲染'}: 当前渲染 {renderPositions.length} / 总计{' '}
        {items.length}，高度缓存 {cacheSize}
      </p>
      {showPanel ? (
        <PerformancePanel
          rendered={renderPositions.length}
          total={items.length}
          cacheSize={cacheSize}
          overscan={overscan}
          virtualizationEnabled={enableVirtualization}
        />
      ) : null}
    </section>
  )
}
