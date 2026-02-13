import { useCallback, useEffect, useMemo, useState } from 'react'

import { loadFavorites, saveFavorites } from '../../lib/storage'

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => loadFavorites())

  useEffect(() => {
    saveFavorites(favoriteIds)
  }, [favoriteIds])

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds])

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((previous) => {
      const set = new Set(previous)
      if (set.has(id)) {
        set.delete(id)
      } else {
        set.add(id)
      }
      return Array.from(set)
    })
  }, [])

  const removeManyFavorites = useCallback((ids: string[]) => {
    setFavoriteIds((previous) => previous.filter((id) => !ids.includes(id)))
  }, [])

  return {
    favoriteIds,
    favoriteSet,
    toggleFavorite,
    removeManyFavorites,
  }
}
