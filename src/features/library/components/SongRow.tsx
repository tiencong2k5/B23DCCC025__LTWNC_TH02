import { memo, useCallback } from 'react'
import type { ListChildComponentProps } from 'react-window'
import type { Song } from '../../../types'
import { formatDuration } from '../../../shared/utils/format'
import { useFavoritesStore } from '../../favorites/useFavoritesStore'
import { usePlayerStore } from '../../player/usePlayerStore'

export interface SongRowData {
  songs: Song[]
}

function SongRow({ index, style, data }: ListChildComponentProps<SongRowData>) {
  const song = data.songs[index]
  const isFavorite = useFavoritesStore((state) => state.ids.includes(song.id))
  const toggleFavorite = useFavoritesStore((state) => state.toggle)
  const addToQueue = usePlayerStore((state) => state.addToQueue)
  const playSong = useCallback(() => {
    usePlayerStore.getState().playQueue(data.songs, index)
  }, [data.songs, index])

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
        <button
          type="button"
          className={isFavorite ? 'favorite-active' : undefined}
          onClick={() => toggleFavorite(song.id)}
          aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          aria-pressed={isFavorite}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
        <button type="button" onClick={() => addToQueue(song)} aria-label={`Thêm ${song.title} vào hàng đợi`}>
          +
        </button>
      </div>
    </div>
  )
}

const MemoizedSongRow = memo(SongRow)

export default MemoizedSongRow
