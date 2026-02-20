import { Link } from 'react-router-dom'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { useSocialContext } from '../features/social/SocialContext'
import { useProfileData } from '../features/social/useProfileData'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { Skeleton } from '../ui/Skeleton'

function ProfileItem({
  title,
  subtitle,
  imageUrl,
  action,
}: {
  title: string
  subtitle: string
  imageUrl: string
  action: ReactNode
}) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-white p-2.5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-14 w-14 overflow-hidden rounded-lg bg-[#eef1f6]">
          {failed ? (
            <div className="grid h-full place-items-center text-[10px] text-[var(--text-muted)]">
              图片失败
            </div>
          ) : (
            <img
              className="h-full w-full object-cover"
              src={imageUrl}
              alt={title}
              onError={() => setFailed(true)}
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="m-0 truncate text-sm font-semibold">{title}</p>
          <p className="mb-0 mt-1 truncate text-xs text-[var(--text-muted)]">{subtitle}</p>
        </div>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  )
}

export function ProfilePage() {
  const { favoriteIds, browsingHistory, followingSet, removeManyFavorites, toggleFollow } =
    useSocialContext()
  const [actionError, setActionError] = useState('')
  const profileQuery = useProfileData({
    favoriteIds,
    browsingHistory,
    followingIds: Array.from(followingSet),
  })

  if (profileQuery.isPending) {
    return <Skeleton height={200} />
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <EmptyState
        title="个人页加载失败"
        description="请稍后重试。"
        action={<Button onClick={() => profileQuery.refetch()}>重试</Button>}
      />
    )
  }

  const { favorites, history, following } = profileQuery.data

  return (
    <section className="grid gap-4" data-testid="profile-page">
      <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[0_6px_24px_rgba(18,23,33,0.05)]">
        <h1 className="m-0 text-[28px] font-black tracking-[0.2px]">个人中心</h1>
        <p className="mb-0 mt-1 text-sm text-[var(--text-muted)]">
          收藏 {favorites.length} · 浏览历史 {history.length} · 关注 {following.length}
        </p>
      </div>

      {actionError ? (
        <EmptyState
          title="操作失败"
          description={actionError === 'LOGIN_REQUIRED' ? '请先登录后再管理关注。' : '请重试。'}
        />
      ) : null}

      <section className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[#fbfcfe] p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="m-0 text-lg font-bold">我的收藏</h2>
          {favorites.length > 0 ? (
            <Button
              tone="danger"
              onClick={() => removeManyFavorites(favorites.map((item) => item.id))}
            >
              清空收藏
            </Button>
          ) : null}
        </div>
        {favorites.length === 0 ? (
          <EmptyState title="暂无收藏" description="去首页或搜索页收藏内容后再回来查看。" />
        ) : (
          <div className="grid gap-2">
            {favorites.slice(0, 12).map((item) => (
              <ProfileItem
                key={item.id}
                title={item.title}
                subtitle={`@${item.authorName} · ${item.category}`}
                imageUrl={item.imageUrl}
                action={
                  <Link
                    className="text-sm font-semibold text-[var(--accent)]"
                    to={`/explore/${item.id}`}
                  >
                    查看
                  </Link>
                }
              />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[#fbfcfe] p-4">
        <h2 className="m-0 text-lg font-bold">浏览历史（最近 50 条）</h2>
        {history.length === 0 ? (
          <EmptyState title="暂无浏览历史" description="浏览内容详情后会自动记录。" />
        ) : (
          <div className="grid gap-2">
            {history.slice(0, 12).map((item) => (
              <ProfileItem
                key={item.id}
                title={item.title}
                subtitle={`@${item.authorName}`}
                imageUrl={item.imageUrl}
                action={
                  <Link
                    className="text-sm font-semibold text-[var(--accent)]"
                    to={`/explore/${item.id}`}
                  >
                    再看
                  </Link>
                }
              />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[#fbfcfe] p-4">
        <h2 className="m-0 text-lg font-bold">关注列表</h2>
        {following.length === 0 ? (
          <EmptyState title="暂未关注任何人" description="在卡片或详情页点击关注后会出现在这里。" />
        ) : (
          <div className="grid gap-2">
            {following.map((author) => (
              <div
                key={author.id}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-white px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f3f4f7] text-xs font-semibold text-[#66707f]">
                    {author.name.slice(0, 1)}
                  </span>
                  <div>
                    <p className="m-0 text-sm font-semibold">{author.name}</p>
                    <p className="mb-0 mt-0.5 text-xs text-[var(--text-muted)]">{author.id}</p>
                  </div>
                </div>
                <Button
                  tone="ghost"
                  onClick={() =>
                    toggleFollow(author.id).catch((error: Error) => setActionError(error.message))
                  }
                >
                  取消关注
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  )
}
