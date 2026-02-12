import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'

import { fetchFeedPage } from './api'
import type { FeedFilters } from '../../types/content'

const PAGE_SIZE = 80

export function useFeed(filters: FeedFilters) {
  const queryClient = useQueryClient()

  const queryKey = useMemo(() => ['feed', filters] as const, [filters])

  const query = useInfiniteQuery({
    queryKey,
    initialPageParam: 0,
    queryFn: async ({ pageParam, signal }) =>
      fetchFeedPage({
        page: pageParam,
        pageSize: PAGE_SIZE,
        query: filters.query,
        category: filters.category,
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
          signal,
        }),
    })
  }, [filters.category, filters.query, query.data?.pages, queryClient, queryKey])

  return {
    ...query,
    allItems,
    total,
    prefetchNextPage,
  }
}
