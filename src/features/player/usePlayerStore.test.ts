import { beforeEach, describe, expect, it } from 'vitest'
import { generateSongs } from '../library/data/songs'
import { usePlayerStore } from './usePlayerStore'

const songs = generateSongs(2)

describe('Kho phát nhạc', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      position: 0,
    })
  })

  it('phát hàng đợi bắt đầu từ đúng bài được chọn', () => {
    usePlayerStore.getState().playQueue(songs, 1)

    expect(usePlayerStore.getState()).toMatchObject({
      queue: songs,
      currentIndex: 1,
      isPlaying: true,
      position: 0,
    })
  })

  it('tự chuyển sang bài tiếp theo khi tick ở giây cuối', () => {
    usePlayerStore.getState().playQueue(songs, 0)
    usePlayerStore.setState({ position: songs[0].duration - 1 })

    usePlayerStore.getState().tick()

    expect(usePlayerStore.getState()).toMatchObject({
      currentIndex: 1,
      isPlaying: true,
      position: 0,
    })
  })

  it('dừng phát khi next được gọi ở bài cuối', () => {
    usePlayerStore.getState().playQueue(songs, 0)
    usePlayerStore.setState({ currentIndex: 1, position: 10 })
    usePlayerStore.getState().next()
    expect(usePlayerStore.getState().isPlaying).toBe(false)
  })

  it('tua về đầu bài sau ba giây và lùi bài khi chưa quá ba giây', () => {
    usePlayerStore.getState().playQueue(songs, 1)
    usePlayerStore.setState({ position: 4 })
    usePlayerStore.getState().prev()
    expect(usePlayerStore.getState()).toMatchObject({ currentIndex: 1, position: 0 })

    usePlayerStore.setState({ position: 3 })
    usePlayerStore.getState().prev()
    expect(usePlayerStore.getState()).toMatchObject({ currentIndex: 0, position: 0 })
  })

  it('không thêm trùng bài hát vào hàng đợi', () => {
    usePlayerStore.getState().addToQueue(songs[0])
    usePlayerStore.getState().addToQueue(songs[0])

    expect(usePlayerStore.getState().queue).toEqual([songs[0]])
  })
})
