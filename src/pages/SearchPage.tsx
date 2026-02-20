import { useEffect, useMemo, useState } from 'react'

import { useFeed } from '../features/feed/useFeed'
import { VirtualizedMasonry } from '../features/feed/VirtualizedMasonry'
import { useSocialContext } from '../features/social/SocialContext'
import { CONTENT_DATASET } from '../lib/mockData'
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

const hotKeywords = Array.from(
  new Set(
    CONTENT_DATASET.flatMap((item) => [
      item.tags[0],
      item.tags[1],
      item.category,
      item.authorName,
    ]).filter((value): value is string => Boolean(value)),
  ),
).slice(0, 10)

export function SearchPage() {
  const [filters, setFilters] = useState(defaultFilters)
  const [tag, setTag] = useState('all')
  const [sort, setSort] = useState<'relevant' | 'latest'>('relevant')
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
  const sortedItems = useMemo(() => {
    if (sort === 'relevant') {
      return feed.allItems
    }
    return [...feed.allItems].sort((a, b) => Number(b.id.slice(5)) - Number(a.id.slice(5)))
  }, [feed.allItems, sort])

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
    <section className="grid gap-4">
      <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[0_6px_24px_rgba(18,23,33,0.05)]">
        <h1 className="m-0 text-[28px] font-black tracking-[0.2px]">搜索发现</h1>
        <p className="mb-0 mt-1 text-sm text-[var(--text-muted)]">
          用关键词和标签找内容，支持历史记录快速回搜。
        </p>
      </div>

      <div className="grid grid-cols-[1fr_220px] gap-3 rounded-2xl border border-[var(--border)] bg-white p-3 shadow-[0_4px_18px_rgba(18,23,33,0.04)] max-[860px]:grid-cols-1">
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
            className="rounded-full border border-[var(--border)] bg-white px-3 py-2.5 text-sm outline-none transition focus-visible:border-[#ff9bab] focus-visible:ring-2 focus-visible:ring-[#ff244233]"
          >
            {tagOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className={
            sort === 'relevant'
              ? 'rounded-full bg-[#ffe8ec] px-4 py-1.5 text-sm font-semibold text-[var(--accent)]'
              : 'rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)]'
          }
          onClick={() => setSort('relevant')}
        >
          综合
        </button>
        <button
          type="button"
          className={
            sort === 'latest'
              ? 'rounded-full bg-[#ffe8ec] px-4 py-1.5 text-sm font-semibold text-[var(--accent)]'
              : 'rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)]'
          }
          onClick={() => setSort('latest')}
        >
          最新
        </button>
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

      <div className="rounded-2xl border border-[var(--border)] bg-white p-3">
        <p className="mb-2 mt-0 text-sm font-semibold text-[var(--text)]">热门搜索</p>
        <div className="flex flex-wrap gap-2">
          {hotKeywords.map((keyword) => (
            <button
              key={keyword}
              type="button"
              className="rounded-full bg-[#f4f6fa] px-3 py-1.5 text-xs text-[#6b7280] hover:bg-[#eceff4]"
              onClick={() => setFilters((prev) => ({ ...prev, query: keyword }))}
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>

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
      {!feed.isPending && !feed.isError && sortedItems.length === 0 ? (
        <EmptyState title="无搜索结果" description="换个关键词或标签试试。" />
      ) : null}

      {sortedItems.length > 0 ? (
        <VirtualizedMasonry
          items={sortedItems}
          overscan={700}
          minColumnWidth={250}
          gap={14}
          restoreKey={`search:${debouncedFilters.query}:${tag}:${sort}`}
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
