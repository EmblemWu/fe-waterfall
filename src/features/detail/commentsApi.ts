import { requestWithRetry, simulateLatency } from '../../lib/request'
import type { CommentItem } from '../../types/content'

const commentStore = new Map<string, CommentItem[]>()

function createInitialComments(contentId: string): CommentItem[] {
  return Array.from({ length: 32 }, (_, index) => ({
    id: `${contentId}-comment-${index + 1}`,
    contentId,
    authorName: `User${(index % 10) + 1}`,
    message: `这是第 ${index + 1} 条评论，用于模拟分页评论列表。`,
    createdAt: new Date(Date.now() - index * 36_000).toISOString(),
  }))
}

function ensureComments(contentId: string) {
  if (!commentStore.has(contentId)) {
    commentStore.set(contentId, createInitialComments(contentId))
  }
  return commentStore.get(contentId)!
}

function maybeFail(probability = 0.1) {
  return Math.random() < probability
}

export async function fetchComments(
  contentId: string,
  page: number,
  pageSize: number,
  signal?: AbortSignal,
) {
  return requestWithRetry(
    (innerSignal) =>
      simulateLatency(
        () => {
          const all = ensureComments(contentId)
          const start = page * pageSize
          const end = start + pageSize
          return {
            items: all.slice(start, end),
            total: all.length,
            nextPage: end < all.length ? page + 1 : null,
          }
        },
        innerSignal,
        180 + Math.random() * 120,
      ),
    {
      retries: 1,
      retryDelayMs: 200,
      signal,
    },
  )
}

export async function postComment(contentId: string, message: string, signal?: AbortSignal) {
  return requestWithRetry(
    (innerSignal) =>
      simulateLatency(
        () => {
          if (maybeFail(0.1)) {
            throw new Error('COMMENT_POST_FAILED')
          }

          const next: CommentItem = {
            id: `${contentId}-comment-${Date.now()}`,
            contentId,
            authorName: 'Me',
            message,
            createdAt: new Date().toISOString(),
          }

          const comments = ensureComments(contentId)
          comments.unshift(next)
          commentStore.set(contentId, comments)
          return next
        },
        innerSignal,
        200 + Math.random() * 180,
      ),
    {
      retries: 0,
      retryDelayMs: 200,
      signal,
    },
  )
}
