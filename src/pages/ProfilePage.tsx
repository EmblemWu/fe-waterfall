import { Link } from 'react-router-dom'
import { useState } from 'react'

import styles from './ProfilePage.module.css'
import { useSocialContext } from '../features/social/SocialContext'
import { useProfileData } from '../features/social/useProfileData'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { Skeleton } from '../ui/Skeleton'

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
    <section className={styles.page} data-testid="profile-page">
      <h1>个人页</h1>
      {actionError ? (
        <EmptyState
          title="操作失败"
          description={actionError === 'LOGIN_REQUIRED' ? '请先登录后再管理关注。' : '请重试。'}
        />
      ) : null}

      <section className={styles.section}>
        <h2>我的收藏</h2>
        {favorites.length === 0 ? (
          <EmptyState title="暂无收藏" description="去首页或搜索页收藏内容后再回来查看。" />
        ) : (
          <>
            <Button
              tone="danger"
              onClick={() => removeManyFavorites(favorites.map((item) => item.id))}
            >
              清空收藏
            </Button>
            <div className={styles.list}>
              {favorites.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div>
                    <strong>{item.title}</strong>
                    <p className={styles.meta}>{item.authorName}</p>
                  </div>
                  <Link to={`/detail/${item.id}`}>查看详情</Link>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section className={styles.section}>
        <h2>浏览历史（最近 50 条）</h2>
        {history.length === 0 ? (
          <EmptyState title="暂无浏览历史" description="浏览内容详情后会自动记录。" />
        ) : (
          <div className={styles.list}>
            {history.map((item) => (
              <div key={item.id} className={styles.item}>
                <div>
                  <strong>{item.title}</strong>
                  <p className={styles.meta}>{item.authorName}</p>
                </div>
                <Link to={`/detail/${item.id}`}>再次查看</Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2>关注列表</h2>
        {following.length === 0 ? (
          <EmptyState title="暂未关注任何人" description="在卡片或详情页点击关注后会出现在这里。" />
        ) : (
          <div className={styles.list}>
            {following.map((author) => (
              <div key={author.id} className={styles.item}>
                <div>
                  <strong>{author.name}</strong>
                  <p className={styles.meta}>{author.id}</p>
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
