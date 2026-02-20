import { Link } from 'react-router-dom'
import { useState } from 'react'

import { useSocialContext } from '../features/social/SocialContext'
import { CONTENT_DATASET } from '../lib/mockData'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'

export function FavoritesPage() {
  const { favoriteIds, favoriteSet, toggleFavorite, removeManyFavorites } = useSocialContext()
  const [actionError, setActionError] = useState('')
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
    <section className="grid gap-3">
      {actionError ? (
        <EmptyState
          title="操作失败"
          description={actionError === 'LOGIN_REQUIRED' ? '请先登录。' : '请重试。'}
        />
      ) : null}
      <div className="flex items-center justify-between gap-3 max-[720px]:flex-col max-[720px]:items-start">
        <h1 className="m-0 text-[26px] tracking-[0.2px]" data-testid="favorites-title">
          我的收藏 ({favorites.length})
        </h1>
        <Button
          tone="danger"
          onClick={() => removeManyFavorites(favorites.map((item) => item.id))}
          data-testid="favorites-clear-all"
        >
          清空本页收藏
        </Button>
      </div>
      <p className="m-0 text-sm text-[var(--text-muted)]">
        本地总收藏数：{recentFavoriteCount}（仅展示前 200 条）
      </p>
      <div className="grid gap-2.5">
        {favorites.map((item) => (
          <Card key={item.id}>
            <div className="flex items-start justify-between gap-3 p-3 max-[720px]:flex-col max-[720px]:items-start">
              <div>
                <strong>{item.title}</strong>
                <p className="mb-2 mt-1 text-sm text-[var(--text-muted)]">{item.description}</p>
                <Link
                  className="text-sm font-semibold text-[var(--accent)]"
                  to={`/explore/${item.id}`}
                >
                  查看详情
                </Link>
              </div>
              <Button
                tone="ghost"
                onClick={() =>
                  toggleFavorite(item.id).catch((error: Error) => setActionError(error.message))
                }
              >
                取消收藏
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
