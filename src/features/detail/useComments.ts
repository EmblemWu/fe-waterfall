import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { fetchComments, postComment } from './commentsApi'
import type { CommentItem } from '../../types/content'

const COMMENT_PAGE_SIZE = 8

export function useComments(contentId: string) {
  const queryClient = useQueryClient()

  const commentsQuery = useInfiniteQuery({
    queryKey: ['comments', contentId],
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) =>
      fetchComments(contentId, pageParam, COMMENT_PAGE_SIZE, signal),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: Boolean(contentId),
  })

  const publishMutation = useMutation({
    mutationFn: (message: string) => postComment(contentId, message),
    onMutate: async (message) => {
      await queryClient.cancelQueries({ queryKey: ['comments', contentId] })
      const previous = queryClient.getQueryData(['comments', contentId])
      const optimistic: CommentItem = {
        id: `temp-${Date.now()}`,
        contentId,
        authorName: 'Me',
        message,
        createdAt: new Date().toISOString(),
      }

      queryClient.setQueryData(
        ['comments', contentId],
        (
          old:
            | {
                pages: Array<{ items: CommentItem[]; total: number; nextPage: number | null }>
                pageParams: number[]
              }
            | undefined,
        ) => {
          if (!old || old.pages.length === 0) {
            return {
              pages: [{ items: [optimistic], total: 1, nextPage: null }],
              pageParams: [0],
            }
          }

          const [first, ...rest] = old.pages
          if (!first) {
            return old
          }
          return {
            ...old,
            pages: [
              {
                ...first,
                items: [optimistic, ...first.items],
                total: first.total + 1,
              },
              ...rest,
            ],
          }
        },
      )

      return { previous }
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['comments', contentId], context.previous)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['comments', contentId] })
    },
  })

  const comments = commentsQuery.data?.pages.flatMap((page) => page.items) ?? []

  return {
    ...commentsQuery,
    comments,
    publishMutation,
  }
}
