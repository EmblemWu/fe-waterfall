import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import styles from './DetailPage.module.css'
import { useComments } from '../features/detail/useComments'
import { useDetail } from '../features/detail/useDetail'
import { useSocialContext } from '../features/social/SocialContext'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { Skeleton } from '../ui/Skeleton'

interface DetailPageProps {
  mode: 'modal' | 'page'
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute('disabled'))
}

export function DetailPage({ mode }: DetailPageProps) {
  const { noteId = '' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const detail = useDetail(noteId)
  const comments = useComments(noteId)
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
  const [imageRetryNonce, setImageRetryNonce] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [commentDraft, setCommentDraft] = useState('')
  const [commentError, setCommentError] = useState('')
  const modalRef = useRef<HTMLDivElement | null>(null)

  const close = () => {
    if (mode === 'modal') {
      navigate(-1)
      return
    }
    navigate('/')
  }

  useEffect(() => {
    if (noteId) {
      recordBrowseHistory(noteId)
    }
  }, [noteId, recordBrowseHistory])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }

      if (mode === 'modal' && event.key === 'Tab' && modalRef.current) {
        const focusables = getFocusableElements(modalRef.current)
        if (focusables.length === 0) {
          return
        }

        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (!first || !last) {
          return
        }
        const active = document.activeElement

        if (!event.shiftKey && active === last) {
          event.preventDefault()
          first.focus()
        }

        if (event.shiftKey && active === first) {
          event.preventDefault()
          last.focus()
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  useEffect(() => {
    if (mode !== 'modal') {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTarget = modalRef.current
    if (focusTarget) {
      focusTarget.focus()
    }

    return () => {
      document.body.style.overflow = previousOverflow
      const state = location.state as { returnFocusId?: string } | null
      const targetId = state?.returnFocusId
      if (targetId) {
        document.getElementById(`card-trigger-${targetId}`)?.focus()
      }
    }
  }, [location.state, mode])

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
      setCommentError('')
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

  const body = (
    <div
      className={mode === 'modal' ? styles.modal : styles.page}
      data-testid={mode === 'modal' ? 'detail-modal' : 'detail-page'}
    >
      {mode === 'modal' ? (
        <Button className={styles.closeBtn} tone="ghost" onClick={close} aria-label="关闭详情">
          关闭
        </Button>
      ) : null}

      <div className={styles.content}>
        <section className={styles.mediaPanel}>
          <div className={styles.mediaViewport}>
            {imageFailed ? (
              <div className={styles.imageFallback}>
                <div>
                  <p>图片加载失败</p>
                  <Button
                    tone="ghost"
                    onClick={() => {
                      setImageFailed(false)
                      setImageRetryNonce((value) => value + 1)
                    }}
                  >
                    重试加载
                  </Button>
                </div>
              </div>
            ) : (
              <img
                className={styles.image}
                src={`${currentImage}?v=${imageRetryNonce}`}
                alt={item.title}
                onError={() => setImageFailed(true)}
              />
            )}
          </div>
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
        </section>

        <section className={styles.infoPanel}>
          <div className={styles.head}>
            <div>
              <h1 className={styles.title}>{item.title}</h1>
              <p className={styles.meta}>
                作者：{item.authorName} · 分类：{item.category}
              </p>
              <p className={styles.meta}>标签：{item.tags.join(', ')}</p>
            </div>
            {mode === 'page' ? (
              <Button tone="ghost" onClick={close}>
                返回
              </Button>
            ) : null}
          </div>

          <p>{item.description}</p>

          <div className={styles.actions}>
            <Button onClick={() => action(() => toggleFavorite(item.id))}>
              {favoriteSet.has(item.id) ? '取消收藏' : '收藏'}
            </Button>
            <Button tone="ghost" onClick={() => action(() => toggleLike(item.id))}>
              {likedSet.has(item.id) ? '取消点赞' : '点赞'} {summaryLikeCount}
            </Button>
            <Button tone="ghost" onClick={() => action(() => toggleFollow(item.authorId))}>
              {followingSet.has(item.authorId) ? '取消关注' : '关注作者'}
            </Button>
          </div>

          <div className={styles.commentWrap}>
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

            <h2 style={{ margin: 0 }}>评论</h2>
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

            {comments.isPending ? <Skeleton height={120} /> : null}
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
                  <article key={comment.id} className={styles.commentItem}>
                    <strong>{comment.authorName}</strong>
                    <p>{comment.message}</p>
                    <p className={styles.commentMeta}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </article>
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
          </div>
        </section>
      </div>
    </div>
  )

  if (mode === 'modal') {
    return (
      <section
        className={styles.overlay}
        data-testid="detail-overlay"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            close()
          }
        }}
      >
        <div ref={modalRef} tabIndex={-1} aria-modal="true" role="dialog">
          {body}
        </div>
      </section>
    )
  }

  return body
}
