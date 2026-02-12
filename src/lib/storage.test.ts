import { describe, expect, it, beforeEach } from 'vitest'

import { loadFavorites, saveFavorites } from './storage'

describe('favorites storage', () => {
  beforeEach(() => {
    window.localStorage.removeItem('fe-waterfall:favorites')
  })

  it('saves and loads favorites', () => {
    saveFavorites(['a', 'b'])
    expect(loadFavorites()).toEqual(['a', 'b'])
  })

  it('returns empty list on invalid payload', () => {
    window.localStorage.setItem('fe-waterfall:favorites', '{')
    expect(loadFavorites()).toEqual([])
  })
})
