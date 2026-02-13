import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import styles from './FeedCard.module.css'
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
      className={styles.card}
      data-testid="feed-card"
      tabIndex={0}
      id={`card-trigger-${item.id}`}
    >
      <Link
        className={styles.mainLink}
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
          className={styles.mediaWrap}
          style={{ aspectRatio: `${item.imageWidth} / ${item.imageHeight}` }}
        >
          {status === 'loading' ? <Skeleton height={180} /> : null}
          {status === 'error' ? <div className={styles.fallback}>Image unavailable</div> : null}
          <img
            className={`${styles.media} ${status === 'ready' ? styles.mediaReady : styles.mediaLoading}`}
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            onLoad={() => setStatus('ready')}
            onError={() => setStatus('error')}
          />
        </div>
        <div className={styles.meta}>
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.author}>@{item.authorName}</p>
          <p className={styles.desc}>{item.description}</p>
        </div>
      </Link>
      <div className={styles.actionBar}>
        <span className={styles.tag}>{item.category}</span>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.favorite}
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
            className={styles.like}
            onClick={() =>
              onLikeToggle(item.id).catch((error: Error) => setActionError(error.message))
            }
          >
            {isLiked ? '已赞' : '点赞'} {likeCount}
          </button>
          <button
            type="button"
            className={styles.follow}
            onClick={() =>
              onFollowToggle(item.authorId).catch((error: Error) => setActionError(error.message))
            }
          >
            {isFollowing ? '已关注' : '关注'}
          </button>
        </div>
      </div>
      {actionError ? <p className={styles.errorHint}>操作失败：{actionError}</p> : null}
    </article>
  )
}
