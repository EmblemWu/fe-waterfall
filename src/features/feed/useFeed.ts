import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'

import { fetchFeedPage } from './api'
import type { FeedFilters } from '../../types/content'

const PAGE_SIZE = 80

interface UseFeedOptions {
  filters: FeedFilters
  mode: 'recommended' | 'following'
  followingIds?: string[]
  tag?: string
}

export function useFeed({ filters, mode, followingIds = [], tag = 'all' }: UseFeedOptions) {
  const queryClient = useQueryClient()

  const queryKey = useMemo(
    () => ['feed', filters.query, filters.category, mode, followingIds.join(','), tag] as const,
    [filters.category, filters.query, followingIds, mode, tag],
  )

  const query = useInfiniteQuery({
    queryKey,
    initialPageParam: 0,
    queryFn: async ({ pageParam, signal }) =>
      fetchFeedPage({
        page: pageParam,
        pageSize: PAGE_SIZE,
        query: filters.query,
        category: filters.category,
        mode,
        followingIds,
        tag,
        signal,
      }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })

  const allItems = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data?.pages],
  )

  const total = query.data?.pages[0]?.total ?? 0

  const prefetchNextPage = useCallback(async () => {
    const nextPage = query.data?.pages[query.data.pages.length - 1]?.nextPage
    if (nextPage == null) {
      return
    }

    await queryClient.prefetchInfiniteQuery({
      queryKey,
      initialPageParam: nextPage,
      queryFn: ({ pageParam, signal }) =>
        fetchFeedPage({
          page: pageParam,
          pageSize: PAGE_SIZE,
          query: filters.query,
          category: filters.category,
          mode,
          followingIds,
          tag,
          signal,
        }),
    })
  }, [
    filters.category,
    filters.query,
    followingIds,
    mode,
    query.data?.pages,
    queryClient,
    queryKey,
    tag,
  ])

  return {
    ...query,
    allItems,
    total,
    prefetchNextPage,
  }
}
