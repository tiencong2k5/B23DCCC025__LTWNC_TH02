import { create } from 'zustand'
import type { Song } from '../../types'

export interface PlayerState {
  queue: Song[]
  currentIndex: number
  isPlaying: boolean
  position: number
  playQueue: (songs: Song[], startIndex: number) => void
  togglePlay: () => void
  next: () => void
  prev: () => void
  addToQueue: (song: Song) => void
  tick: () => void
}

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  position: 0,

  playQueue: (songs, startIndex) => {
    if (songs.length === 0) {
      set({ queue: [], currentIndex: -1, isPlaying: false, position: 0 })
      return
    }

    const safeIndex = Math.max(0, Math.min(startIndex, songs.length - 1))
    set({ queue: songs, currentIndex: safeIndex, isPlaying: true, position: 0 })
  },

  togglePlay: () => {
    const { queue, currentIndex, isPlaying, position } = get()
    if (queue.length === 0 || currentIndex < 0) return
    const currentSong = queue[currentIndex]
    if (!isPlaying && currentSong && position >= currentSong.duration) {
      set({ isPlaying: true, position: 0 })
      return
    }
    set({ isPlaying: !isPlaying })
  },

  next: () => {
    const { queue, currentIndex } = get()
    if (currentIndex < 0 || currentIndex >= queue.length - 1) {
      set({ isPlaying: false })
      return
    }
    set({ currentIndex: currentIndex + 1, position: 0 })
  },

  prev: () => {
    const { currentIndex, position } = get()
    if (position > 3 || currentIndex <= 0) {
      set({ position: 0 })
      return
    }
    set({ currentIndex: currentIndex - 1, position: 0 })
  },

  addToQueue: (song) => {
    const { queue } = get()
    if (queue.some((queuedSong) => queuedSong.id === song.id)) return
    set({ queue: [...queue, song] })
  },

  tick: () => {
    const { queue, currentIndex, position, isPlaying } = get()
    if (!isPlaying || currentIndex < 0) return

    const currentSong = queue[currentIndex]
    if (!currentSong) return

    if (position >= currentSong.duration) {
      get().next()
      return
    }

    const nextPosition = position + 1
    set({ position: nextPosition })
    if (nextPosition >= currentSong.duration) get().next()
  },
}))
