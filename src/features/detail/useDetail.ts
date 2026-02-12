import { useQuery } from '@tanstack/react-query'

import { fetchDetail } from '../feed/api'
import type { ContentItem } from '../../types/content'

export function useDetail(id: string) {
  return useQuery<ContentItem>({
    queryKey: ['detail', id],
    queryFn: ({ signal }) => fetchDetail(id, signal),
  })
}
