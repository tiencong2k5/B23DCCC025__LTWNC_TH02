import { fireEvent, render, screen } from '@testing-library/react'
import type { ListChildComponentProps } from 'react-window'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Song } from '../../../types'
import { PlaylistDispatchContext } from '../../playlists/PlaylistContext'
import { usePlayerStore } from '../../player/usePlayerStore'
import SongRow, { type SongRowData } from './SongRow'

const song: Song = {
  id: 'song-1',
  title: 'Bài hát thử nghiệm',
  artist: 'Ca sĩ thử nghiệm',
  genre: 'Pop',
  duration: 150,
}

const songs = [song]

function renderSongRow() {
  const props: ListChildComponentProps<SongRowData> = {
    index: 0,
    style: { height: 56, width: 500 },
    data: { songs, selectedPlaylistId: '' },
  }

  return render(
    <PlaylistDispatchContext.Provider value={vi.fn()}>
      <SongRow {...props} />
    </PlaylistDispatchContext.Provider>,
  )
}

describe('Dòng bài hát', () => {
  beforeEach(() => {
    window.localStorage.removeItem('music-favorites')
  })

  it('hiển thị tên bài hát và thời lượng đã định dạng', () => {
    renderSongRow()

    expect(screen.getByText('Bài hát thử nghiệm')).toBeInTheDocument()
    expect(screen.getByText('2:30')).toBeInTheDocument()
  })

  it('phát đúng bài hát qua store khi người dùng bấm Phát', () => {
    const playQueue = vi.spyOn(usePlayerStore.getState(), 'playQueue')
    renderSongRow()

    fireEvent.click(screen.getByRole('button', { name: 'Phát Bài hát thử nghiệm' }))

    expect(playQueue).toHaveBeenCalledWith(songs, 0)
    playQueue.mockRestore()
  })
})
