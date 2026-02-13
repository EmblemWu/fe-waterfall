import type { ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

import { CONTENT_DATASET } from '../../lib/mockData'
import {
  loadBrowseHistory,
  loadFavorites,
  loadFollowing,
  loadLikes,
  saveBrowseHistory,
  saveFavorites,
  saveFollowing,
  saveLikes,
} from '../../lib/storage'
import { useAuthContext } from '../auth/AuthContext'
import { socialApi } from './socialApi'

interface SocialValue {
  favoriteIds: string[]
  favoriteSet: Set<string>
  likedSet: Set<string>
  followingSet: Set<string>
  likeCounts: Map<string, number>
  browsingHistory: string[]
  toggleFavorite: (id: string) => Promise<void>
  toggleLike: (id: string) => Promise<void>
  toggleFollow: (authorId: string) => Promise<void>
  recordBrowseHistory: (id: string) => void
  removeManyFavorites: (ids: string[]) => void
}

const SocialContext = createContext<SocialValue | null>(null)

const initialLikeCounts = new Map(CONTENT_DATASET.map((item) => [item.id, item.likedCount]))

export function SocialProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuthContext()
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => loadFavorites())
  const [likedIds, setLikedIds] = useState<string[]>(() => loadLikes())
  const [followingIds, setFollowingIds] = useState<string[]>(() => loadFollowing())
  const [browsingHistory, setBrowsingHistory] = useState<string[]>(() => loadBrowseHistory())
  const [likeCounts, setLikeCounts] = useState<Map<string, number>>(initialLikeCounts)

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds])
  const likedSet = useMemo(() => new Set(likedIds), [likedIds])
  const followingSet = useMemo(() => new Set(followingIds), [followingIds])

  const assertAuth = () => {
    if (!isLoggedIn) {
      throw new Error('LOGIN_REQUIRED')
    }
  }

  const toggleFavorite = async (id: string) => {
    assertAuth()
    const previous = favoriteIds
    const next = favoriteSet.has(id)
      ? favoriteIds.filter((itemId) => itemId !== id)
      : [...favoriteIds, id]

    setFavoriteIds(next)
    saveFavorites(next)

    try {
      await socialApi.toggleFavorite()
    } catch (error) {
      setFavoriteIds(previous)
      saveFavorites(previous)
      throw error
    }
  }

  const toggleLike = async (id: string) => {
    assertAuth()
    const previousLiked = likedIds
    const wasLiked = likedSet.has(id)
    const nextLiked = wasLiked ? likedIds.filter((itemId) => itemId !== id) : [...likedIds, id]

    setLikedIds(nextLiked)
    saveLikes(nextLiked)
    setLikeCounts((prev) => {
      const next = new Map(prev)
      const base = next.get(id) ?? 0
      next.set(id, wasLiked ? Math.max(0, base - 1) : base + 1)
      return next
    })

    try {
      await socialApi.toggleLike()
    } catch (error) {
      setLikedIds(previousLiked)
      saveLikes(previousLiked)
      setLikeCounts((prev) => {
        const next = new Map(prev)
        const base = next.get(id) ?? 0
        next.set(id, wasLiked ? base + 1 : Math.max(0, base - 1))
        return next
      })
      throw error
    }
  }

  const toggleFollow = async (authorId: string) => {
    assertAuth()
    const previous = followingIds
    const next = followingSet.has(authorId)
      ? followingIds.filter((id) => id !== authorId)
      : [...followingIds, authorId]

    setFollowingIds(next)
    saveFollowing(next)

    try {
      await socialApi.toggleFollow()
    } catch (error) {
      setFollowingIds(previous)
      saveFollowing(previous)
      throw error
    }
  }

  const recordBrowseHistory = (id: string) => {
    setBrowsingHistory((previous) => {
      const deduped = [id, ...previous.filter((itemId) => itemId !== id)].slice(0, 50)
      saveBrowseHistory(deduped)
      return deduped
    })
  }

  const removeManyFavorites = (ids: string[]) => {
    const idSet = new Set(ids)
    const next = favoriteIds.filter((id) => !idSet.has(id))
    setFavoriteIds(next)
    saveFavorites(next)
  }

  return (
    <SocialContext.Provider
      value={{
        favoriteIds,
        favoriteSet,
        likedSet,
        followingSet,
        likeCounts,
        browsingHistory,
        toggleFavorite,
        toggleLike,
        toggleFollow,
        recordBrowseHistory,
        removeManyFavorites,
      }}
    >
      {children}
    </SocialContext.Provider>
  )
}

export function useSocialContext() {
  const context = useContext(SocialContext)
  if (!context) {
    throw new Error('useSocialContext must be used inside SocialProvider')
  }
  return context
}
