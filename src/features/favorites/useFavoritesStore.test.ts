import { beforeEach, describe, expect, it } from 'vitest'
import { useFavoritesStore } from './useFavoritesStore'

describe('favorites store', () => {
  beforeEach(() => {
    window.localStorage.removeItem('music-favorites')
    useFavoritesStore.setState({ ids: [] })
  })

  it('toggles favorite ids and persists them', () => {
    useFavoritesStore.getState().toggle('s1')

    expect(useFavoritesStore.getState().ids).toEqual(['s1'])
    expect(window.localStorage.getItem('music-favorites')).toContain('"s1"')

    useFavoritesStore.getState().toggle('s1')
    expect(useFavoritesStore.getState().ids).toEqual([])
  })
})
