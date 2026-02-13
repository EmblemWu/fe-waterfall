import { CONTENT_BY_ID, CONTENT_DATASET } from '../../lib/mockData'
import { requestWithRetry, simulateLatency } from '../../lib/request'
import type { ContentItem } from '../../types/content'
import type { FeedPageResponse } from '../../types/content'

interface FeedParams {
  page: number
  pageSize: number
  query: string
  category: string
  mode: 'recommended' | 'following'
  followingIds?: string[]
  tag?: string
  signal?: AbortSignal
}

export async function fetchFeedPage(params: FeedParams): Promise<FeedPageResponse> {
  const { page, pageSize, query, category, mode, followingIds = [], tag = 'all', signal } = params

  return requestWithRetry(
    async (innerSignal) =>
      simulateLatency(() => {
        const keyword = query.trim().toLowerCase()
        const filtered = CONTENT_DATASET.filter((item) => {
          const matchedQuery =
            keyword.length === 0 ||
            item.title.toLowerCase().includes(keyword) ||
            item.tags.some((tag) => tag.includes(keyword))
          const matchedCategory = category === 'all' || item.category === category
          const matchedFollow = mode === 'recommended' || followingIds.includes(item.authorId)
          const matchedTag = tag === 'all' || item.tags.includes(tag)
          return matchedQuery && matchedCategory && matchedFollow && matchedTag
        })

        const start = page * pageSize
        const end = start + pageSize
        const items = filtered.slice(start, end)

        return {
          items,
          page,
          pageSize,
          total: filtered.length,
          hasMore: end < filtered.length,
          nextPage: end < filtered.length ? page + 1 : null,
        }
      }, innerSignal),
    {
      retries: 2,
      retryDelayMs: 200,
      signal,
    },
  )
}

export async function fetchDetail(id: string, signal?: AbortSignal): Promise<ContentItem> {
  return requestWithRetry(
    (innerSignal) =>
      simulateLatency(() => {
        const item = CONTENT_BY_ID.get(id)
        if (!item) {
          throw new Error('NOT_FOUND')
        }
        return item
      }, innerSignal),
    { signal, retries: 1, retryDelayMs: 150 },
  )
}
