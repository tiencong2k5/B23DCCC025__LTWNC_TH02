import { memo, useCallback } from 'react'
import type { ListChildComponentProps } from 'react-window'
import type { Song } from '../../../types'
import { formatDuration } from '../../../shared/utils/format'

export interface SongRowData {
  songs: Song[]
  onPlay: (song: Song) => void
}

function SongRow({ index, style, data }: ListChildComponentProps<SongRowData>) {
  const song = data.songs[index]
  const playSong = useCallback(() => data.onPlay(song), [data, song])

  return (
    <div className="song-row" style={style} role="row">
      <span className="song-number" role="cell">{index + 1}</span>
      <div className="song-main" role="cell">
        <span className="song-title">{song.title}</span>
        <span className="song-mobile-artist">{song.artist}</span>
      </div>
      <span className="song-artist" role="cell">{song.artist}</span>
      <span className="song-genre" role="cell">{song.genre}</span>
      <span className="song-duration" role="cell">{formatDuration(song.duration)}</span>
      <div className="song-actions" role="cell">
        <button className="row-play" type="button" onClick={playSong} aria-label={`Phát ${song.title}`}>
          Phát
        </button>
        <button type="button" disabled title="Sẽ có trong phần 2" aria-label={`Yêu thích ${song.title}`}>
          ♥
        </button>
        <button type="button" disabled title="Sẽ có trong phần 2" aria-label={`Thêm ${song.title} vào hàng đợi`}>
          +
        </button>
      </div>
    </div>
  )
}

const MemoizedSongRow = memo(SongRow)

export default MemoizedSongRow
