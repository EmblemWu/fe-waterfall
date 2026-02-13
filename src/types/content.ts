export type Category = 'nature' | 'technology' | 'art' | 'people' | 'travel'

export interface ContentItem {
  id: string
  title: string
  description: string
  authorId: string
  authorName: string
  category: Category
  tags: string[]
  imageUrl: string
  imageUrls: string[]
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

export interface CommentItem {
  id: string
  contentId: string
  authorName: string
  message: string
  createdAt: string
}
