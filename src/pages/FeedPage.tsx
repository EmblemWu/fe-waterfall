import { useEffect, useMemo, useState } from 'react'

import styles from './FeedPage.module.css'
import { FeedToolbar } from '../features/feed/FeedToolbar'
import { useFeed } from '../features/feed/useFeed'
import { VirtualizedMasonry } from '../features/feed/VirtualizedMasonry'
import { useFavoritesContext } from '../features/favorites/FavoritesContext'
import type { FeedFilters } from '../types/content'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { Skeleton } from '../ui/Skeleton'

const defaultFilters: FeedFilters = {
  query: '',
  category: 'all',
}

export function FeedPage() {
  const [filters, setFilters] = useState<FeedFilters>(defaultFilters)
  const deferredFilters = useMemo(() => filters, [filters])
  const feed = useFeed(deferredFilters)
  const { favoriteSet, toggleFavorite } = useFavoritesContext()
  const { hasNextPage, isFetchingNextPage, fetchNextPage, prefetchNextPage } = feed

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY > document.body.scrollHeight - 1200
      if (nearBottom && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage()
        void prefetchNextPage()
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, prefetchNextPage])

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>高性能瀑布流</h1>
      <p className={styles.sub}>12000 条 mock 数据，支持筛选、收藏、详情与窗口化渲染。</p>

      <FeedToolbar
        filters={filters}
        onFilterChange={setFilters}
        onReset={() => setFilters(defaultFilters)}
        total={feed.total}
        loaded={feed.allItems.length}
      />

      {feed.isPending ? <Skeleton height={220} /> : null}
      {feed.isError ? (
        <EmptyState
          title="加载失败"
          description="网络异常，请稍后重试。"
          action={<Button onClick={() => feed.refetch()}>重试</Button>}
        />
      ) : null}
      {!feed.isPending && !feed.isError && feed.allItems.length === 0 ? (
        <EmptyState title="没有匹配内容" description="尝试调整搜索词或筛选条件。" />
      ) : null}

      {feed.allItems.length > 0 ? (
        <VirtualizedMasonry
          items={feed.allItems}
          overscan={900}
          minColumnWidth={250}
          gap={14}
          restoreKey={`scroll:${filters.query}:${filters.category}`}
          favoriteSet={favoriteSet}
          onToggleFavorite={toggleFavorite}
        />
      ) : null}

      {feed.hasNextPage ? (
        <div className={styles.actionRow}>
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? '加载中...' : '加载更多'}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
