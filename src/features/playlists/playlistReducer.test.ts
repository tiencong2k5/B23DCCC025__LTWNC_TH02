import { describe, expect, it } from 'vitest'
import { playlistReducer, type Playlist } from './playlistReducer'

describe('Bộ giảm trạng thái playlist', () => {
  const playlist: Playlist = { id: 'p1', name: 'Chill', songIds: ['s1'] }

  it('tạo, đổi tên và xóa playlist mà không sửa state cũ', () => {
    const initialState = [playlist]
    const created = playlistReducer(initialState, {
      type: 'create',
      playlist: { id: 'p2', name: 'Pop', songIds: [] },
    })

    expect(initialState).toEqual([playlist])
    expect(created).toHaveLength(2)
    expect(playlistReducer(created, { type: 'rename', id: 'p2', name: 'Favorites' })[1].name).toBe('Favorites')
    expect(playlistReducer(created, { type: 'remove', id: 'p2' })).toEqual([playlist])
  })

  it('thêm bài hát không trùng và có thể bỏ bài', () => {
    const withSong = playlistReducer([playlist], { type: 'addSong', id: 'p1', songId: 's2' })
    const withoutDuplicate = playlistReducer(withSong, { type: 'addSong', id: 'p1', songId: 's2' })
    expect(withoutDuplicate[0].songIds).toEqual(['s1', 's2'])
    expect(playlistReducer(withoutDuplicate, { type: 'removeSong', id: 'p1', songId: 's1' })[0].songIds).toEqual(['s2'])
  })

  it('giữ nguyên state khi xóa playlist không tồn tại', () => {
    const state = [playlist]
    expect(playlistReducer(state, { type: 'remove', id: 'missing' })).toEqual(state)
  })
})
