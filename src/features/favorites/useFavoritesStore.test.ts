import { beforeEach, describe, expect, it } from 'vitest'
import { useFavoritesStore } from './useFavoritesStore'

describe('Kho bài hát yêu thích', () => {
  beforeEach(() => {
    window.localStorage.removeItem('music-favorites')
    useFavoritesStore.setState({ ids: [] })
  })

  it('bật tắt bài yêu thích và lưu vào localStorage', () => {
    useFavoritesStore.getState().toggle('s1')

    expect(useFavoritesStore.getState().ids).toEqual(['s1'])
    expect(window.localStorage.getItem('music-favorites')).toContain('"s1"')

    useFavoritesStore.getState().toggle('s1')
    expect(useFavoritesStore.getState().ids).toEqual([])
  })
})
