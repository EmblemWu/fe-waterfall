import { useQueryClient } from '@tanstack/react-query'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

import { fetchDetail } from './api'
import type { ContentItem } from '../../types/content'
import { Skeleton } from '../../ui/Skeleton'

interface FeedCardProps {
  item: ContentItem
  isFavorite: boolean
  isLiked: boolean
  isFollowing: boolean
  likeCount: number
  onFavoriteToggle: (id: string) => Promise<void>
  onLikeToggle: (id: string) => Promise<void>
  onFollowToggle: (authorId: string) => Promise<void>
  onMeasure: (id: string, height: number) => void
}

export function FeedCard({
  item,
  isFavorite,
  isLiked,
  isFollowing,
  likeCount,
  onFavoriteToggle,
  onLikeToggle,
  onFollowToggle,
  onMeasure,
}: FeedCardProps) {
  const location = useLocation()
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [actionError, setActionError] = useState<string>('')
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!rootRef.current) {
      return
    }

    const observer = new ResizeObserver(() => {
      if (!rootRef.current) {
        return
      }
      onMeasure(item.id, rootRef.current.getBoundingClientRect().height)
    })

    observer.observe(rootRef.current)
    return () => observer.disconnect()
  }, [item.id, onMeasure])

  return (
    <article
      ref={rootRef}
      className="overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-transform duration-200 hover:-translate-y-px"
      data-testid="feed-card"
      tabIndex={0}
      id={`card-trigger-${item.id}`}
    >
      <Link
        className="block text-inherit no-underline"
        to={`/explore/${item.id}`}
        state={{
          backgroundLocation: location,
          returnFocusId: item.id,
        }}
        onMouseEnter={() => {
          void queryClient.prefetchQuery({
            queryKey: ['detail', item.id],
            queryFn: ({ signal }) => fetchDetail(item.id, signal),
          })
        }}
      >
        <div
          className="relative w-full overflow-hidden bg-[#f0f0f0]"
          style={{ aspectRatio: `${item.imageWidth} / ${item.imageHeight}` }}
        >
          {status === 'loading' ? <Skeleton height={180} /> : null}
          {status === 'error' ? (
            <div className="grid min-h-[140px] h-full w-full place-items-center bg-[#f4f4f5] text-xs text-[#6b7280]">
              Image unavailable
            </div>
          ) : null}
          <img
            className={`block w-full transition-transform duration-200 ${
              status === 'ready' ? 'opacity-100' : 'opacity-0'
            }`}
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            onLoad={() => setStatus('ready')}
            onError={() => setStatus('error')}
          />
        </div>
        <div className="px-3 pb-2 pt-2.5">
          <h3 className="m-0 text-[15px] leading-[1.45]">{item.title}</h3>
          <p className="mb-0 mt-1.5 text-xs text-[#9ca3af]">@{item.authorName}</p>
          <p className="my-1.5 text-[13px] leading-[1.4] text-[var(--text-muted)]">
            {item.description}
          </p>
        </div>
      </Link>
      <div className="flex items-center justify-between gap-2 px-3 pb-3">
        <span className="rounded-full bg-[#f3f4f6] px-2 py-1 text-[11px] text-[#6b7280]">
          {item.category}
        </span>
        <div className="inline-flex flex-wrap justify-end gap-1.5">
          <button
            type="button"
            className="cursor-pointer rounded-full border border-[var(--border)] bg-white px-2.5 py-1.5 text-xs text-[var(--accent)]"
            onClick={() =>
              onFavoriteToggle(item.id).catch((error: Error) => setActionError(error.message))
            }
            aria-pressed={isFavorite}
            data-testid="favorite-toggle"
          >
            {isFavorite ? '已收藏' : '收藏'}
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-full border border-[var(--border)] bg-white px-2.5 py-1.5 text-xs text-[#374151]"
            onClick={() =>
              onLikeToggle(item.id).catch((error: Error) => setActionError(error.message))
            }
          >
            {isLiked ? '已赞' : '点赞'} {likeCount}
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-full border border-[var(--border)] bg-white px-2.5 py-1.5 text-xs text-[#111827]"
            onClick={() =>
              onFollowToggle(item.authorId).catch((error: Error) => setActionError(error.message))
            }
          >
            {isFollowing ? '已关注' : '关注'}
          </button>
        </div>
      </div>
      {actionError ? (
        <p className="mx-3 mb-2.5 mt-0 text-xs text-[var(--danger)]">操作失败：{actionError}</p>
      ) : null}
    </article>
  )
}
