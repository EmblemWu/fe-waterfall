import type { ChangeEvent } from 'react'

import type { Category, FeedFilters } from '../../types/content'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'

const categories: Array<{ label: string; value: FeedFilters['category'] }> = [
  { label: '全部分类', value: 'all' },
  { label: '自然', value: 'nature' },
  { label: '科技', value: 'technology' },
  { label: '艺术', value: 'art' },
  { label: '人物', value: 'people' },
  { label: '旅行', value: 'travel' },
]

interface FeedToolbarProps {
  filters: FeedFilters
  total: number
  loaded: number
  onFilterChange: (next: FeedFilters) => void
  onReset: () => void
}

export function FeedToolbar({ filters, total, loaded, onFilterChange, onReset }: FeedToolbarProps) {
  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      query: event.currentTarget.value,
    })
  }

  const onCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      category: event.currentTarget.value as Category | 'all',
    })
  }

  return (
    <section>
      <div className="mb-3 grid grid-cols-[1fr_180px_auto] items-end gap-3 max-[860px]:grid-cols-1">
        <Input
          id="search"
          label="搜索"
          placeholder="搜索标题或标签..."
          value={filters.query}
          onChange={onQueryChange}
          data-testid="search-input"
        />
        <label>
          <span className="text-sm text-[var(--text-muted)]">分类</span>
          <select
            value={filters.category}
            onChange={onCategoryChange}
            aria-label="分类筛选"
            className="mt-1.5 w-full rounded-full border border-[var(--border)] bg-white px-3 py-2.5 text-sm"
          >
            {categories.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <Button tone="ghost" onClick={onReset}>
          重置条件
        </Button>
      </div>
      <p className="text-sm text-[var(--text-muted)]">
        已渲染 {loaded} 条 / 命中 {total} 条
      </p>
    </section>
  )
}
