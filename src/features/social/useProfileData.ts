import { useQuery } from '@tanstack/react-query'

import { AUTHORS, CONTENT_BY_ID } from '../../lib/mockData'
import { requestWithRetry, simulateLatency } from '../../lib/request'
import type { ContentItem } from '../../types/content'

function isContentItem(item: ContentItem | undefined): item is ContentItem {
  return Boolean(item)
}

function isAuthor(
  author: { id: string; name: string } | undefined,
): author is { id: string; name: string } {
  return Boolean(author)
}

interface ProfileParams {
  favoriteIds: string[]
  browsingHistory: string[]
  followingIds: string[]
}

export function useProfileData({ favoriteIds, browsingHistory, followingIds }: ProfileParams) {
  return useQuery({
    queryKey: [
      'profile-data',
      favoriteIds.join(','),
      browsingHistory.join(','),
      followingIds.join(','),
    ],
    queryFn: ({ signal }) =>
      requestWithRetry(
        (innerSignal) =>
          simulateLatency(
            () => {
              const favorites = favoriteIds.map((id) => CONTENT_BY_ID.get(id)).filter(isContentItem)
              const history = browsingHistory
                .map((id) => CONTENT_BY_ID.get(id))
                .filter(isContentItem)
              const following = followingIds
                .map((id) => AUTHORS.find((author) => author.id === id))
                .filter(isAuthor)

              return {
                favorites,
                history,
                following,
              }
            },
            innerSignal,
            140,
          ),
        {
          signal,
          retries: 1,
          retryDelayMs: 200,
        },
      ),
  })
}
