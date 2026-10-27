import { describe, expect, it } from 'vitest'
import { generateSongs } from './songs'

describe('Sinh dữ liệu bài hát', () => {
  it('tạo đủ 10.000 bài hát', () => {
    expect(generateSongs(10_000)).toHaveLength(10_000)
  })

  it('tạo id duy nhất cho mỗi bài hát', () => {
    const songs = generateSongs(10_000)
    expect(new Set(songs.map((song) => song.id)).size).toBe(10_000)
  })

  it('giữ thời lượng mọi bài hát trong khoảng 150 đến 300 giây', () => {
    const songs = generateSongs(10_000)
    expect(songs.every((song) => song.duration >= 150 && song.duration <= 300)).toBe(true)
  })
})
