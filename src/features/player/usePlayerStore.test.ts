import { beforeEach, describe, expect, it } from 'vitest'
import { generateSongs } from '../library/data/songs'
import { usePlayerStore } from './usePlayerStore'

const songs = generateSongs(2)

describe('player store', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      position: 0,
    })
  })

  it('plays the requested queue and advances when a song ends', () => {
    usePlayerStore.getState().playQueue(songs, 0)
    usePlayerStore.setState({ position: songs[0].duration - 1 })

    usePlayerStore.getState().tick()

    expect(usePlayerStore.getState()).toMatchObject({
      currentIndex: 1,
      isPlaying: true,
      position: 0,
    })
  })

  it('stops at the end of the last song and rewinds when going back', () => {
    usePlayerStore.getState().playQueue(songs, 0)
    usePlayerStore.setState({ position: 4 })
    usePlayerStore.getState().prev()
    expect(usePlayerStore.getState().position).toBe(0)

    usePlayerStore.setState({ currentIndex: 1, position: songs[1].duration - 1 })
    usePlayerStore.getState().tick()
    expect(usePlayerStore.getState().isPlaying).toBe(false)
    expect(usePlayerStore.getState().position).toBe(songs[1].duration)
  })

  it('does not add the same song to the queue twice', () => {
    usePlayerStore.getState().addToQueue(songs[0])
    usePlayerStore.getState().addToQueue(songs[0])

    expect(usePlayerStore.getState().queue).toEqual([songs[0]])
  })
})
