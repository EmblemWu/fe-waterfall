const FAVORITES_KEY = 'fe-waterfall:favorites'
const SEARCH_HISTORY_KEY = 'fe-waterfall:search-history'
const FOLLOWING_KEY = 'fe-waterfall:following'
const BROWSE_HISTORY_KEY = 'fe-waterfall:browse-history'
const LIKES_KEY = 'fe-waterfall:likes'

function readStringArray(key: string): string[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter((v): v is string => typeof v === 'string')
  } catch {
    return []
  }
}

function writeStringArray(key: string, values: string[]): void {
  localStorage.setItem(key, JSON.stringify(values))
}

export function loadFavorites(): string[] {
  return readStringArray(FAVORITES_KEY)
}

export function saveFavorites(ids: string[]): void {
  writeStringArray(FAVORITES_KEY, ids)
}

export function loadLikes(): string[] {
  return readStringArray(LIKES_KEY)
}

export function saveLikes(ids: string[]): void {
  writeStringArray(LIKES_KEY, ids)
}

export function loadFollowing(): string[] {
  return readStringArray(FOLLOWING_KEY)
}

export function saveFollowing(ids: string[]): void {
  writeStringArray(FOLLOWING_KEY, ids)
}

export function loadSearchHistory(): string[] {
  return readStringArray(SEARCH_HISTORY_KEY)
}

export function saveSearchHistory(history: string[]): void {
  writeStringArray(SEARCH_HISTORY_KEY, history.slice(0, 10))
}

export function loadBrowseHistory(): string[] {
  return readStringArray(BROWSE_HISTORY_KEY)
}

export function saveBrowseHistory(ids: string[]): void {
  writeStringArray(BROWSE_HISTORY_KEY, ids.slice(0, 50))
}
