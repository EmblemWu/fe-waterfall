import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

import styles from './FeedCard.module.css'
import type { ContentItem } from '../../types/content'
import { Skeleton } from '../../ui/Skeleton'

interface FeedCardProps {
  item: ContentItem
  isFavorite: boolean
  onFavoriteToggle: (id: string) => void
  onMeasure: (id: string, height: number) => void
}

export function FeedCard({ item, isFavorite, onFavoriteToggle, onMeasure }: FeedCardProps) {
  const [loaded, setLoaded] = useState(false)
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
    <div ref={rootRef} className={styles.card} data-testid="feed-card" tabIndex={0}>
      <div
        className={styles.mediaWrap}
        style={{ aspectRatio: `${item.imageWidth} / ${item.imageHeight}` }}
      >
        {!loaded ? <Skeleton height={180} /> : null}
        <img
          className={styles.media}
          src={item.imageUrl}
          alt={item.title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          style={{ display: loaded ? 'block' : 'none' }}
        />
      </div>
      <div className={styles.meta}>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.desc}>{item.description}</p>
        <div className={styles.bottom}>
          <span className={styles.tag}>{item.category}</span>
          <button
            type="button"
            className={styles.favorite}
            onClick={() => onFavoriteToggle(item.id)}
            aria-pressed={isFavorite}
            data-testid="favorite-toggle"
          >
            {isFavorite ? '已收藏' : '收藏'}
          </button>
        </div>
        <Link className={styles.link} to={`/detail/${item.id}`}>
          查看详情
        </Link>
      </div>
    </div>
  )
}
