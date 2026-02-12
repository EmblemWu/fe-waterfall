import { Link } from 'react-router-dom'

import { CONTENT_DATASET } from '../lib/mockData'
import { useFavoritesContext } from '../features/favorites/FavoritesContext'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'

export function FavoritesPage() {
  const { favoriteSet, toggleFavorite } = useFavoritesContext()
  const favorites = CONTENT_DATASET.filter((item) => favoriteSet.has(item.id)).slice(0, 200)

  if (favorites.length === 0) {
    return <EmptyState title="还没有收藏" description="在内容流中点击收藏后会出现在这里。" />
  }

  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h1>我的收藏 ({favorites.length})</h1>
      {favorites.map((item) => (
        <Card key={item.id} className="favorite-card">
          <div style={{ padding: 14, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <div>
              <strong>{item.title}</strong>
              <p style={{ margin: '6px 0', color: 'var(--text-muted)' }}>{item.description}</p>
              <Link to={`/detail/${item.id}`}>查看详情</Link>
            </div>
            <Button tone="ghost" onClick={() => toggleFavorite(item.id)}>
              取消收藏
            </Button>
          </div>
        </Card>
      ))}
    </section>
  )
}
