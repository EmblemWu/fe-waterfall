export type Category = 'nature' | 'technology' | 'art' | 'people' | 'travel'

export interface ContentItem {
  id: string
  title: string
  description: string
  category: Category
  tags: string[]
  imageUrl: string
  imageWidth: number
  imageHeight: number
  likedCount: number
}

export interface FeedPageResponse {
  items: ContentItem[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
  nextPage: number | null
}

export interface FeedFilters {
  query: string
  category: Category | 'all'
}
