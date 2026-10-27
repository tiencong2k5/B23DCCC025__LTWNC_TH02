import { memo, useCallback, useMemo } from 'react'
import type { Song } from '../../../types'
import SimplePage from '../../../app/SimplePage'
import { SONGS } from '../../library/data/songs'
import { formatDuration } from '../../../shared/utils/format'
import { useFavoritesStore } from '../useFavoritesStore'
import { usePlayerStore } from '../../player/usePlayerStore'

const SONGS_BY_ID = new Map(SONGS.map((song) => [song.id, song]))

interface FavoriteSongRowProps {
  song: Song
  songs: Song[]
  index: number
}

function FavoriteSongRow({ song, songs, index }: FavoriteSongRowProps) {
  const toggle = useFavoritesStore((state) => state.toggle)

  const playSong = useCallback(() => {
    usePlayerStore.getState().playQueue(songs, index)
  }, [index, songs])

  return (
    <div className="favorite-song-row">
      <button className="favorite-song-play" type="button" onClick={playSong} aria-label={`Phát ${song.title}`}>
        ▶
      </button>
      <div className="favorite-song-info">
        <strong>{song.title}</strong>
        <span>{song.artist} · {song.genre}</span>
      </div>
      <span className="favorite-song-duration">{formatDuration(song.duration)}</span>
      <button
        className="favorite-remove"
        type="button"
        onClick={() => toggle(song.id)}
        aria-label={`Bỏ yêu thích ${song.title}`}
      >
        ♥
      </button>
    </div>
  )
}

const MemoizedFavoriteSongRow = memo(FavoriteSongRow)

function FavoritesPage() {
  const favoriteIds = useFavoritesStore((state) => state.ids)
  const favoriteSongs = useMemo(() => {
    return favoriteIds.flatMap((id) => {
      const song = SONGS_BY_ID.get(id)
      return song ? [song] : []
    })
  }, [favoriteIds])

  const playAll = useCallback(() => {
    if (favoriteSongs.length > 0) usePlayerStore.getState().playQueue(favoriteSongs, 0)
  }, [favoriteSongs])

  if (favoriteSongs.length === 0) {
    return <SimplePage title="Bài hát yêu thích" description="Những bài hát bạn muốn nghe lại.">
      <div className="empty-state">Bạn chưa có bài hát yêu thích.</div>
    </SimplePage>
  }

  return (
    <section className="page favorites-page" aria-labelledby="favorites-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">THƯ VIỆN CỦA BẠN</p>
          <h1 id="favorites-title">Bài hát yêu thích</h1>
          <p className="page-description">{favoriteSongs.length} bài hát bạn muốn nghe lại.</p>
        </div>
        <button className="play-all-button" type="button" onClick={playAll} aria-label="Phát tất cả">
          ▶ Phát tất cả
        </button>
      </div>
      <div className="favorites-list" aria-label="Danh sách bài hát yêu thích">
        {favoriteSongs.map((song, index) => (
          <MemoizedFavoriteSongRow key={song.id} song={song} songs={favoriteSongs} index={index} />
        ))}
      </div>
    </section>
  )
}

export default FavoritesPage
