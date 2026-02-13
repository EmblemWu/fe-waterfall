import { useEffect, useMemo, useState } from 'react'

import styles from './FeedPage.module.css'
import { FeedToolbar } from '../features/feed/FeedToolbar'
import { useFeed } from '../features/feed/useFeed'
import { VirtualizedMasonry } from '../features/feed/VirtualizedMasonry'
import { useSocialContext } from '../features/social/SocialContext'
import type { FeedFilters } from '../types/content'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { Skeleton } from '../ui/Skeleton'

const defaultFilters: FeedFilters = {
  query: '',
  category: 'all',
}

type FeedTab = 'recommended' | 'following'

export function FeedPage() {
  const [tab, setTab] = useState<FeedTab>('recommended')
  const [filtersByTab, setFiltersByTab] = useState<Record<FeedTab, FeedFilters>>({
    recommended: defaultFilters,
    following: defaultFilters,
  })
  const [showPerf, setShowPerf] = useState(false)
  const [enableVirtualization, setEnableVirtualization] = useState(true)
  const [actionError, setActionError] = useState('')
  const activeFilters = filtersByTab[tab]
  const deferredFilters = useMemo(() => activeFilters, [activeFilters])
  const {
    favoriteSet,
    likedSet,
    followingSet,
    likeCounts,
    toggleFavorite,
    toggleLike,
    toggleFollow,
  } = useSocialContext()

  const feed = useFeed({
    filters: deferredFilters,
    mode: tab,
    followingIds: Array.from(followingSet),
  })
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

  const withActionError = async (task: () => Promise<void>) => {
    try {
      setActionError('')
      await task()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ACTION_FAILED'
      setActionError(message)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>内容社区首页</h1>
          <p className={styles.sub}>推荐 / 关注双信息流，瀑布流虚拟化渲染。</p>
        </div>
        <Button tone="ghost" onClick={() => setShowPerf((v) => !v)}>
          {showPerf ? '隐藏性能面板' : '性能面板'}
        </Button>
      </div>

      <div className={styles.tabs}>
        <button
          type="button"
          className={tab === 'recommended' ? styles.activeTab : styles.tab}
          onClick={() => setTab('recommended')}
        >
          推荐
        </button>
        <button
          type="button"
          className={tab === 'following' ? styles.activeTab : styles.tab}
          onClick={() => setTab('following')}
        >
          关注
        </button>
      </div>

      <FeedToolbar
        filters={activeFilters}
        onFilterChange={(next) =>
          setFiltersByTab((previous) => ({
            ...previous,
            [tab]: next,
          }))
        }
        onReset={() =>
          setFiltersByTab((previous) => ({
            ...previous,
            [tab]: defaultFilters,
          }))
        }
        total={feed.total}
        loaded={feed.allItems.length}
      />

      {showPerf ? (
        <label className={styles.virtualToggle}>
          <input
            type="checkbox"
            checked={enableVirtualization}
            onChange={(event) => setEnableVirtualization(event.currentTarget.checked)}
          />
          开启虚拟化
        </label>
      ) : null}

      {actionError ? (
        <EmptyState
          title="互动失败"
          description={
            actionError === 'LOGIN_REQUIRED'
              ? '请先点击右上角登录，再进行点赞/收藏/关注。'
              : '操作失败，已自动回滚，可重试。'
          }
        />
      ) : null}

      {feed.isPending ? <Skeleton height={220} /> : null}
      {feed.isError ? (
        <EmptyState
          title="加载失败"
          description="网络异常，请稍后重试。"
          action={<Button onClick={() => feed.refetch()}>重试</Button>}
        />
      ) : null}
      {!feed.isPending && !feed.isError && feed.allItems.length === 0 ? (
        <EmptyState
          title={tab === 'following' ? '关注流为空' : '没有匹配内容'}
          description={
            tab === 'following'
              ? '先在卡片上关注创作者，再回来查看关注流。'
              : '尝试调整搜索词或筛选条件。'
          }
        />
      ) : null}

      {feed.allItems.length > 0 ? (
        <VirtualizedMasonry
          items={feed.allItems}
          overscan={900}
          minColumnWidth={250}
          gap={14}
          restoreKey={`home:${tab}:${activeFilters.query}:${activeFilters.category}`}
          favoriteSet={favoriteSet}
          likedSet={likedSet}
          followingSet={followingSet}
          likeCounts={likeCounts}
          onToggleFavorite={(id) => withActionError(() => toggleFavorite(id))}
          onToggleLike={(id) => withActionError(() => toggleLike(id))}
          onToggleFollow={(authorId) => withActionError(() => toggleFollow(authorId))}
          enableVirtualization={enableVirtualization}
          showPanel={showPerf}
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
