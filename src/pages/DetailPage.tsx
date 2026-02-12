import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import styles from './DetailPage.module.css'
import { useDetail } from '../features/detail/useDetail'
import { useFavoritesContext } from '../features/favorites/FavoritesContext'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { Skeleton } from '../ui/Skeleton'

export function DetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const detail = useDetail(id)
  const { favoriteSet, toggleFavorite } = useFavoritesContext()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        navigate(-1)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navigate])

  if (detail.isPending) {
    return <Skeleton height={320} />
  }

  if (detail.isError || !detail.data) {
    return <EmptyState title="详情不存在" description="目标内容已下线或不可用。" />
  }

  const item = detail.data

  return (
    <article className={styles.wrap} data-testid="detail-page">
      <div className={styles.header}>
        <h1>{item.title}</h1>
        <div>
          <Button tone="ghost" onClick={() => navigate(-1)}>
            返回
          </Button>{' '}
          <Button onClick={() => toggleFavorite(item.id)}>
            {favoriteSet.has(item.id) ? '取消收藏' : '收藏'}
          </Button>
        </div>
      </div>
      <img className={styles.image} src={item.imageUrl} alt={item.title} />
      <p className={styles.desc}>{item.description}</p>
      <p>分类：{item.category}</p>
      <p>标签：{item.tags.join(', ')}</p>
    </article>
  )
}
