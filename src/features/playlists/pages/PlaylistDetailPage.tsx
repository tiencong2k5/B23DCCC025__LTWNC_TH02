import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePlaylistDispatch, usePlaylists } from '../PlaylistContext'
import { SONGS } from '../../library/data/songs'
import { formatDuration } from '../../../shared/utils/format'
import { usePlayerStore } from '../../player/usePlayerStore'

const SONGS_BY_ID = new Map(SONGS.map((song) => [song.id, song]))

function PlaylistDetailPage() {
  const { id } = useParams()
  const playlists = usePlaylists()
  const dispatch = usePlaylistDispatch()
  const playlist = playlists.find((item) => item.id === id)
  const playlistSongs = useMemo(
    () => playlist?.songIds.flatMap((songId) => {
      const song = SONGS_BY_ID.get(songId)
      return song ? [song] : []
    }) ?? [],
    [playlist],
  )

  const totalDuration = playlistSongs.reduce((total, song) => total + song.duration, 0)
  const totalMinutes = Math.floor(totalDuration / 60)
  const remainingSeconds = totalDuration % 60

  if (!playlist) {
    return (
      <section className="page">
        <div className="empty-state">Không tìm thấy playlist.</div>
      </section>
    )
  }

  return (
    <section className="page playlist-detail-page" aria-labelledby="playlist-title">
      <Link className="back-link" to="/playlists">← Playlist của bạn</Link>
      <div className="page-heading">
        <div>
          <p className="eyebrow">PLAYLIST</p>
          <h1 id="playlist-title">{playlist.name}</h1>
          <p className="page-description">
            {playlistSongs.length} bài · Tổng thời lượng: {totalMinutes} phút {remainingSeconds} giây
          </p>
        </div>
        <button
          className="play-all-button"
          type="button"
          disabled={playlistSongs.length === 0}
          aria-label="Phát tất cả"
          onClick={() => usePlayerStore.getState().playQueue(playlistSongs, 0)}
        >
          ▶ Phát tất cả
        </button>
      </div>

      {playlistSongs.length === 0 ? (
        <div className="empty-state">Playlist này chưa có bài hát nào.</div>
      ) : (
        <div className="playlist-song-list">
          {playlistSongs.map((song) => (
            <div className="favorite-song-row" key={song.id}>
              <div className="favorite-song-info">
                <strong>{song.title}</strong>
                <span>{song.artist} · {song.genre}</span>
              </div>
              <span className="favorite-song-duration">{formatDuration(song.duration)}</span>
              <button
                className="playlist-delete"
                type="button"
                onClick={() => dispatch({ type: 'removeSong', id: playlist.id, songId: song.id })}
                aria-label={`Bỏ ${song.title} khỏi playlist`}
              >
                Bỏ
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default PlaylistDetailPage
