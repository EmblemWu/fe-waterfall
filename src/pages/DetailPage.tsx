import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import styles from './DetailPage.module.css'
import { useComments } from '../features/detail/useComments'
import { useDetail } from '../features/detail/useDetail'
import { useSocialContext } from '../features/social/SocialContext'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { Skeleton } from '../ui/Skeleton'

export function DetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const detail = useDetail(id)
  const comments = useComments(id)
  const {
    favoriteSet,
    likedSet,
    followingSet,
    likeCounts,
    toggleFavorite,
    toggleLike,
    toggleFollow,
    recordBrowseHistory,
  } = useSocialContext()
  const [imageFailed, setImageFailed] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [commentDraft, setCommentDraft] = useState('')
  const [commentError, setCommentError] = useState('')

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        navigate(-1)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navigate])

  useEffect(() => {
    if (id) {
      recordBrowseHistory(id)
    }
  }, [id, recordBrowseHistory])

  if (detail.isPending) {
    return <Skeleton height={320} />
  }

  if (detail.isError || !detail.data) {
    return <EmptyState title="详情不存在" description="目标内容已下线或不可用。" />
  }

  const item = detail.data
  const imageUrls = item.imageUrls.length > 0 ? item.imageUrls : [item.imageUrl]
  const currentImage = imageUrls[currentImageIndex] ?? item.imageUrl

  const action = async (task: () => Promise<void>) => {
    try {
      await task()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ACTION_FAILED'
      setCommentError(
        message === 'LOGIN_REQUIRED' ? '请先登录后互动。' : '操作失败，已自动回滚，请重试。',
      )
    }
  }

  const onSubmitComment = async () => {
    const payload = commentDraft.trim()
    if (!payload) {
      return
    }

    setCommentError('')
    try {
      await comments.publishMutation.mutateAsync(payload)
      setCommentDraft('')
    } catch {
      setCommentError('评论发送失败，请点击重试。')
    }
  }

  const summaryLikeCount = likeCounts.get(item.id) ?? item.likedCount

  return (
    <article className={styles.wrap} data-testid="detail-page">
      <div className={styles.header}>
        <h1>{item.title}</h1>
        <div>
          <Button tone="ghost" onClick={() => navigate(-1)}>
            返回
          </Button>{' '}
          <Button onClick={() => action(() => toggleFavorite(item.id))}>
            {favoriteSet.has(item.id) ? '取消收藏' : '收藏'}
          </Button>{' '}
          <Button tone="ghost" onClick={() => action(() => toggleLike(item.id))}>
            {likedSet.has(item.id) ? '取消点赞' : '点赞'} {summaryLikeCount}
          </Button>
        </div>
      </div>

      {imageFailed ? (
        <div className={styles.imageFallback}>图片加载失败，已展示文本信息</div>
      ) : (
        <img
          className={styles.image}
          src={currentImage}
          alt={item.title}
          onError={() => setImageFailed(true)}
        />
      )}

      <div className={styles.carouselAction}>
        <Button
          tone="ghost"
          onClick={() =>
            setCurrentImageIndex((index) => (index === 0 ? imageUrls.length - 1 : index - 1))
          }
        >
          上一张
        </Button>
        <span>
          {currentImageIndex + 1}/{imageUrls.length}
        </span>
        <Button
          tone="ghost"
          onClick={() => setCurrentImageIndex((index) => (index + 1) % imageUrls.length)}
        >
          下一张
        </Button>
      </div>

      <p className={styles.desc}>{item.description}</p>
      <p>作者：{item.authorName}</p>
      <p>分类：{item.category}</p>
      <p>标签：{item.tags.join(', ')}</p>
      <Button tone="ghost" onClick={() => action(() => toggleFollow(item.authorId))}>
        {followingSet.has(item.authorId) ? '取消关注作者' : '关注作者'}
      </Button>

      {commentError ? (
        <EmptyState
          title="操作提示"
          description={commentError}
          action={
            commentError.includes('评论发送失败') ? (
              <Button onClick={onSubmitComment}>重试评论</Button>
            ) : null
          }
        />
      ) : null}

      <section className={styles.commentBox}>
        <h2>评论</h2>
        <textarea
          className={styles.commentInput}
          value={commentDraft}
          onChange={(event) => setCommentDraft(event.currentTarget.value)}
          placeholder="写下你的评论..."
        />
        <div>
          <Button onClick={onSubmitComment} disabled={comments.publishMutation.isPending}>
            {comments.publishMutation.isPending ? '发布中...' : '发表评论'}
          </Button>
        </div>

        {comments.isPending ? <Skeleton height={140} /> : null}
        {comments.isError ? (
          <EmptyState
            title="评论加载失败"
            description="请重试。"
            action={<Button onClick={() => comments.refetch()}>重试</Button>}
          />
        ) : null}

        {!comments.isPending && !comments.isError && comments.comments.length === 0 ? (
          <EmptyState title="还没有评论" description="来发布第一条评论吧。" />
        ) : null}

        {comments.comments.length > 0 ? (
          <div className={styles.commentList}>
            {comments.comments.map((comment) => (
              <div key={comment.id} className={styles.commentItem}>
                <strong>{comment.authorName}</strong>
                <p>{comment.message}</p>
                <p className={styles.commentMeta}>{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : null}

        {comments.hasNextPage ? (
          <Button
            tone="ghost"
            onClick={() => comments.fetchNextPage()}
            disabled={comments.isFetchingNextPage}
          >
            {comments.isFetchingNextPage ? '加载中...' : '加载更多评论'}
          </Button>
        ) : null}
      </section>
    </article>
  )
}
