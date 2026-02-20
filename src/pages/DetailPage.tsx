import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

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
      className={
        mode === 'modal'
          ? 'relative w-[min(1080px,94vw)] max-h-[92vh] overflow-hidden rounded-2xl bg-white shadow-[0_16px_50px_rgba(0,0,0,0.2)]'
          : 'mx-auto w-full max-w-[1080px] overflow-hidden rounded-2xl border border-[var(--border)] bg-white'
      }
      data-testid={mode === 'modal' ? 'detail-modal' : 'detail-page'}
    >
      {mode === 'modal' ? (
        <Button
          className="absolute right-4 top-4 z-20"
          tone="ghost"
          onClick={close}
          aria-label="关闭详情"
        >
          关闭
        </Button>
      ) : null}

      <div className="grid h-full grid-cols-[1.12fr_0.88fr] max-[920px]:grid-cols-1">
        <section className="border-r border-[var(--border)] bg-[#f8f8f8] p-4 max-[920px]:border-r-0 max-[920px]:border-b">
          <div className="relative overflow-hidden rounded-xl bg-[#efefef]">
            {imageFailed ? (
              <div className="grid min-h-[320px] place-items-center bg-[#f4f4f5] text-center text-sm text-[var(--text-muted)]">
                <div>
                  <p className="mb-3 mt-0">图片加载失败</p>
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
                className="block w-full object-cover"
                src={`${currentImage}?v=${imageRetryNonce}`}
                alt={item.title}
                onError={() => setImageFailed(true)}
              />
            )}
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-[var(--text-muted)]">
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

        <section className="flex h-full min-h-[620px] flex-col p-4 max-[920px]:min-h-0">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h1 className="m-0 text-2xl font-bold">{item.title}</h1>
              <p className="mb-0 mt-1 text-sm text-[var(--text-muted)]">
                作者：{item.authorName} · 分类：{item.category}
              </p>
              <p className="mb-0 mt-1 text-sm text-[var(--text-muted)]">
                标签：{item.tags.join(', ')}
              </p>
            </div>
            {mode === 'page' ? (
              <Button tone="ghost" onClick={close}>
                返回
              </Button>
            ) : null}
          </div>

          <p className="mb-3 mt-0 text-[15px] leading-6">{item.description}</p>

          <div className="mb-3 flex flex-wrap items-center gap-2">
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

          <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-[var(--border)] bg-[#fcfcfc] p-3">
            {commentError ? (
              <div className="mb-3">
                <EmptyState
                  title="操作提示"
                  description={commentError}
                  action={
                    commentError.includes('评论发送失败') ? (
                      <Button onClick={onSubmitComment}>重试评论</Button>
                    ) : null
                  }
                />
              </div>
            ) : null}

            <h2 className="m-0 text-lg font-semibold">评论</h2>
            <textarea
              className="mt-2 min-h-[92px] w-full resize-y rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus-visible:border-[#ff9bab] focus-visible:ring-2 focus-visible:ring-[#ff244233]"
              value={commentDraft}
              onChange={(event) => setCommentDraft(event.currentTarget.value)}
              placeholder="写下你的评论..."
            />
            <div className="mt-2">
              <Button onClick={onSubmitComment} disabled={comments.publishMutation.isPending}>
                {comments.publishMutation.isPending ? '发布中...' : '发表评论'}
              </Button>
            </div>

            <div className="mt-3 grid gap-3">
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
                <div className="grid gap-2">
                  {comments.comments.map((comment) => (
                    <article
                      key={comment.id}
                      className="rounded-xl border border-[var(--border)] bg-white px-3 py-2"
                    >
                      <strong>{comment.authorName}</strong>
                      <p className="mb-0 mt-1 text-sm">{comment.message}</p>
                      <p className="mb-0 mt-1 text-xs text-[var(--text-muted)]">
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
          </div>
        </section>
      </div>
    </div>
  )

  if (mode === 'modal') {
    return (
      <section
        className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4"
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
