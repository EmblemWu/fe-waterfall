import { Link } from 'react-router-dom'

import styles from './FavoritesPage.module.css'
import { useFavoritesContext } from '../features/favorites/FavoritesContext'
import { CONTENT_DATASET } from '../lib/mockData'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'

export function FavoritesPage() {
  const { favoriteIds, favoriteSet, toggleFavorite, removeManyFavorites } = useFavoritesContext()
  const favorites = CONTENT_DATASET.filter((item) => favoriteSet.has(item.id)).slice(0, 200)
  const recentFavoriteCount = favoriteIds.length

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="还没有收藏"
        description="在内容流中点击收藏后会出现在这里。"
        action={<Link to="/">前往内容流</Link>}
      />
    )
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 data-testid="favorites-title">我的收藏 ({favorites.length})</h1>
        <Button
          tone="danger"
          onClick={() => removeManyFavorites(favorites.map((item) => item.id))}
          data-testid="favorites-clear-all"
        >
          清空本页收藏
        </Button>
      </div>
      <p style={{ margin: 0, color: 'var(--text-muted)' }}>
        本地总收藏数：{recentFavoriteCount}（仅展示前 200 条）
      </p>
      <div className={styles.list}>
        {favorites.map((item) => (
          <Card key={item.id} className="favorite-card">
            <div className={styles.row}>
              <div>
                <strong>{item.title}</strong>
                <p className={styles.desc}>{item.description}</p>
                <Link to={`/detail/${item.id}`}>查看详情</Link>
              </div>
              <Button tone="ghost" onClick={() => toggleFavorite(item.id)}>
                取消收藏
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
