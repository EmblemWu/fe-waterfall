import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'

import { useSocialContext } from '../features/social/SocialContext'
import { CONTENT_BY_ID } from '../lib/mockData'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'

type ImageState = 'loading' | 'ready' | 'error'

function FavoritePreview({ imageUrl, title }: { imageUrl: string; title: string }) {
  const [state, setState] = useState<ImageState>('loading')

  return (
    <div className="relative overflow-hidden bg-[#eef1f6]" style={{ aspectRatio: '3 / 4' }}>
      {state !== 'ready' ? (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#eceff4] via-[#f5f7fa] to-[#eceff4]" />
      ) : null}
      {state === 'error' ? (
        <div className="absolute inset-0 grid place-items-center text-xs text-[var(--text-muted)]">
          图片不可用
        </div>
      ) : null}
      <img
        className={`h-full w-full object-cover transition duration-300 ${state === 'ready' ? 'opacity-100' : 'opacity-0'}`}
        src={imageUrl}
        alt={title}
        loading="lazy"
        onLoad={() => setState('ready')}
        onError={() => setState('error')}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/35 to-transparent" />
    </div>
  )
}

export function FavoritesPage() {
  const { favoriteIds, toggleFavorite, removeManyFavorites } = useSocialContext()
  const [actionError, setActionError] = useState('')

  const favorites = useMemo(
    () =>
      favoriteIds
        .map((id) => CONTENT_BY_ID.get(id))
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
        .slice(0, 200),
    [favoriteIds],
  )

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="还没有收藏"
        description="在内容流里点收藏后，就会自动同步到这里。"
        action={
          <Link className="text-sm font-semibold text-[var(--accent)]" to="/">
            去首页看看
          </Link>
        }
      />
    )
  }

  return (
    <section className="grid gap-4">
      {actionError ? (
        <EmptyState
          title="操作失败"
          description={actionError === 'LOGIN_REQUIRED' ? '请先登录。' : '请重试。'}
        />
      ) : null}

      <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[0_6px_24px_rgba(18,23,33,0.05)]">
        <div className="flex items-center justify-between gap-3 max-[720px]:flex-col max-[720px]:items-start">
          <div>
            <h1
              className="m-0 text-[28px] font-black tracking-[0.2px]"
              data-testid="favorites-title"
            >
              我的收藏
            </h1>
            <p className="mb-0 mt-1 text-sm text-[var(--text-muted)]">
              共 {favoriteIds.length} 条，当前展示最近 {favorites.length} 条。
            </p>
          </div>
          <Button
            tone="danger"
            onClick={() => removeManyFavorites(favorites.map((item) => item.id))}
            data-testid="favorites-clear-all"
          >
            清空当前列表
          </Button>
        </div>
      </div>

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {favorites.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[0_6px_20px_rgba(18,23,33,0.06)]"
          >
            <Link to={`/explore/${item.id}`} className="block">
              <FavoritePreview imageUrl={item.imageUrl} title={item.title} />
              <div className="px-3 pb-2 pt-2.5">
                <h3 className="m-0 text-[15px] font-semibold leading-[1.45]">{item.title}</h3>
                <p className="mb-0 mt-1 text-xs text-[var(--text-muted)]">
                  @{item.authorName} · {item.category}
                </p>
                <p className="mb-0 mt-1 text-[13px] leading-[1.4] text-[var(--text-muted)]">
                  {item.description}
                </p>
              </div>
            </Link>
            <div className="flex items-center justify-between border-t border-[var(--border)] px-3 py-2">
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#f4f6fa] px-2 py-1 text-[11px] text-[#6c7280]"
                  >
                    #{tag}
                  </span>
                ))}
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
          </article>
        ))}
      </div>
    </section>
  )
}
