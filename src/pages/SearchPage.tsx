import { useEffect, useMemo, useState } from 'react'

import { useFeed } from '../features/feed/useFeed'
import { VirtualizedMasonry } from '../features/feed/VirtualizedMasonry'
import { useSocialContext } from '../features/social/SocialContext'
import { loadSearchHistory, saveSearchHistory } from '../lib/storage'
import { useDebouncedValue } from '../lib/useDebouncedValue'
import type { FeedFilters } from '../types/content'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { Input } from '../ui/Input'
import { Skeleton } from '../ui/Skeleton'

const defaultFilters: FeedFilters = {
  query: '',
  category: 'all',
}

const tagOptions = [
  'all',
  'minimal',
  'color',
  'editorial',
  'fresh',
  'pro',
  'daily',
  'cinema',
  'urban',
]

export function SearchPage() {
  const [filters, setFilters] = useState(defaultFilters)
  const [tag, setTag] = useState('all')
  const [history, setHistory] = useState<string[]>(() => loadSearchHistory())
  const [enableVirtualization] = useState(true)
  const [actionError, setActionError] = useState('')

  const debouncedQuery = useDebouncedValue(filters.query, 350)
  const debouncedFilters = useMemo(
    () => ({ ...filters, query: debouncedQuery }),
    [debouncedQuery, filters],
  )

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
    filters: debouncedFilters,
    mode: 'recommended',
    followingIds: Array.from(followingSet),
    tag,
  })

  const pushHistory = (value: string) => {
    const keyword = value.trim()
    if (!keyword) {
      return
    }
    const next = [keyword, ...history.filter((item) => item !== keyword)].slice(0, 10)
    setHistory(next)
    saveSearchHistory(next)
  }

  useEffect(() => {
    pushHistory(debouncedQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

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
    <section className="grid gap-3">
      <h1 className="m-0 text-[26px] tracking-[0.2px]">搜索</h1>
      <div className="grid grid-cols-[1fr_220px] gap-3 max-[860px]:grid-cols-1">
        <Input
          id="search-page-keyword"
          label="关键词"
          value={filters.query}
          onChange={(event) => {
            setFilters((prev) => ({ ...prev, query: event.currentTarget.value }))
          }}
          placeholder="搜索标题、标签、作者"
          data-testid="search-page-input"
        />
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] text-[var(--text-muted)]">标签</span>
          <select
            value={tag}
            onChange={(event) => setTag(event.currentTarget.value)}
            className="rounded-full border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
          >
            {tagOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      {history.length > 0 ? (
        <div>
          <p className="mb-2 mt-0 text-sm text-[var(--text-muted)]">搜索历史</p>
          <div className="flex flex-wrap items-center gap-2">
            {history.map((keyword) => (
              <button
                key={keyword}
                type="button"
                className="cursor-pointer rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-sm transition hover:bg-[#f7f7f7]"
                onClick={() => setFilters((prev) => ({ ...prev, query: keyword }))}
              >
                {keyword}
              </button>
            ))}
            <Button
              tone="ghost"
              onClick={() => {
                setHistory([])
                saveSearchHistory([])
              }}
            >
              清空历史
            </Button>
          </div>
        </div>
      ) : null}

      {actionError ? (
        <EmptyState
          title="互动失败"
          description={
            actionError === 'LOGIN_REQUIRED'
              ? '请先登录再执行点赞/收藏/关注。'
              : '操作失败，已自动回滚，请重试。'
          }
        />
      ) : null}

      {feed.isPending ? <Skeleton height={220} /> : null}
      {feed.isError ? (
        <EmptyState
          title="搜索失败"
          description="请检查网络后重试。"
          action={<Button onClick={() => feed.refetch()}>重试</Button>}
        />
      ) : null}
      {!feed.isPending && !feed.isError && feed.allItems.length === 0 ? (
        <EmptyState title="无搜索结果" description="换个关键词或标签试试。" />
      ) : null}

      {feed.allItems.length > 0 ? (
        <VirtualizedMasonry
          items={feed.allItems}
          overscan={700}
          minColumnWidth={250}
          gap={14}
          restoreKey={`search:${debouncedFilters.query}:${tag}`}
          favoriteSet={favoriteSet}
          likedSet={likedSet}
          followingSet={followingSet}
          likeCounts={likeCounts}
          onToggleFavorite={(id) => withActionError(() => toggleFavorite(id))}
          onToggleLike={(id) => withActionError(() => toggleLike(id))}
          onToggleFollow={(authorId) => withActionError(() => toggleFollow(authorId))}
          enableVirtualization={enableVirtualization}
          showPanel={false}
        />
      ) : null}
    </section>
  )
}
