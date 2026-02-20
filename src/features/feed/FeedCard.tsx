import { useQueryClient } from '@tanstack/react-query'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

import { fetchDetail } from './api'
import type { ContentItem } from '../../types/content'
import { Skeleton } from '../../ui/Skeleton'

function ActionIcon({
  kind,
  active = false,
}: {
  kind: 'like' | 'favorite' | 'comment'
  active?: boolean
}) {
  if (kind === 'comment') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
        <path
          d="M5 6.8A2.8 2.8 0 0 1 7.8 4h8.4A2.8 2.8 0 0 1 19 6.8v5.4a2.8 2.8 0 0 1-2.8 2.8h-6L7 18.2V15A2.8 2.8 0 0 1 5 12.2V6.8Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (kind === 'favorite') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
        <path
          d="M6.8 4h10.4A1.8 1.8 0 0 1 19 5.8V20l-7-3.4L5 20V5.8A1.8 1.8 0 0 1 6.8 4Z"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
      <path
        d="M12 20.2 4.9 13.5a4.4 4.4 0 0 1 6.2-6.2L12 8.2l.9-.9a4.4 4.4 0 0 1 6.2 6.2L12 20.2Z"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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
  const timeoutRef = useRef<number | null>(null)
  const commentCount = (Number(item.id.replace('item-', '')) % 150) + 12

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

  useEffect(() => {
    if (status !== 'loading') {
      return
    }
    timeoutRef.current = window.setTimeout(() => {
      setStatus('error')
    }, 9000)
    return () => {
      if (timeoutRef.current != null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [status])

  return (
    <article
      ref={rootRef}
      className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_6px_20px_rgba(18,23,33,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(18,23,33,0.12)]"
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
            <div className="grid h-full min-h-[140px] w-full place-items-center bg-[#f4f4f5] text-xs text-[#6b7280]">
              图片加载失败
            </div>
          ) : null}
          <img
            className={`block w-full transition duration-300 ${
              status === 'ready' ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-[1.02]`}
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            onLoad={() => {
              if (timeoutRef.current != null) {
                window.clearTimeout(timeoutRef.current)
              }
              setStatus('ready')
            }}
            onError={() => setStatus('error')}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/25 to-transparent" />
        </div>
        <div className="px-3 pb-2 pt-2.5">
          <h3 className="m-0 text-[15px] font-semibold leading-[1.45]">{item.title}</h3>
          <p className="mb-0 mt-1.5 text-[13px] leading-[1.45] text-[var(--text-muted)]">
            {item.description}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f3f4f7] font-semibold text-[#6c727f]">
              {item.authorName.slice(0, 1)}
            </span>
            <span className="text-[#666f7b]">{item.authorName}</span>
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-between gap-2 border-t border-[var(--border)] px-3 py-2.5">
        <span className="rounded-full bg-[#f3f4f6] px-2 py-1 text-[11px] text-[#6b7280]">
          {item.category}
        </span>
        <div className="inline-flex flex-wrap justify-end gap-1.5">
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 cursor-pointer rounded-full border px-2.5 py-1.5 text-xs transition ${
              isFavorite
                ? 'border-[#ffd4dc] bg-[#fff1f4] text-[var(--accent)]'
                : 'border-[var(--border)] bg-white text-[#4d5561] hover:bg-[#f9fafb]'
            }`}
            onClick={() =>
              onFavoriteToggle(item.id).catch((error: Error) => setActionError(error.message))
            }
            aria-pressed={isFavorite}
            data-testid="favorite-toggle"
          >
            <ActionIcon kind="favorite" active={isFavorite} />
            {isFavorite ? '已藏' : '收藏'}
          </button>
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 cursor-pointer rounded-full border px-2.5 py-1.5 text-xs transition ${
              isLiked
                ? 'border-[#ffd4dc] bg-[#fff1f4] text-[var(--accent)]'
                : 'border-[var(--border)] bg-white text-[#374151] hover:bg-[#f9fafb]'
            }`}
            onClick={() =>
              onLikeToggle(item.id).catch((error: Error) => setActionError(error.message))
            }
          >
            <ActionIcon kind="like" active={isLiked} />
            {likeCount}
          </button>
          <Link
            to={`/explore/${item.id}`}
            state={{
              backgroundLocation: location,
              returnFocusId: item.id,
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white px-2.5 py-1.5 text-xs text-[#374151] transition hover:bg-[#f9fafb]"
          >
            <ActionIcon kind="comment" />
            {commentCount}
          </Link>
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 cursor-pointer rounded-full border px-2.5 py-1.5 text-xs transition ${
              isFollowing
                ? 'border-[#d5ecde] bg-[#effbf3] text-[#1f7a44]'
                : 'border-[var(--border)] bg-white text-[#111827] hover:bg-[#f9fafb]'
            }`}
            onClick={() =>
              onFollowToggle(item.authorId).catch((error: Error) => setActionError(error.message))
            }
          >
            {isFollowing ? '已关注' : '+关注'}
          </button>
        </div>
      </div>
      {actionError ? (
        <p className="mx-3 mb-2.5 mt-0 text-xs text-[var(--danger)]">操作失败：{actionError}</p>
      ) : null}
    </article>
  )
}
