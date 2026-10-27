import { memo, useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { usePlaylistDispatch, usePlaylists } from '../PlaylistContext'

function PlaylistCreateForm({ isDuplicateName }: { isDuplicateName: (name: string) => boolean }) {
  const dispatch = usePlaylistDispatch()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function createPlaylist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()

    if (!trimmedName) {
      setError('Tên playlist không được để trống')
      return
    }

    if (isDuplicateName(trimmedName)) {
      setError('Tên playlist đã tồn tại')
      return
    }

    dispatch({
      type: 'create',
      playlist: { id: crypto.randomUUID(), name: trimmedName, songIds: [] },
    })
    setName('')
    setError('')
  }

  return (
    <form className="playlist-create-form" onSubmit={createPlaylist} noValidate>
      <div className="search-field">
        <label htmlFor="playlist-name">Tên playlist</label>
        <input
          id="playlist-name"
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
            if (error) setError('')
          }}
          placeholder="Ví dụ: Nhạc thư giãn"
          aria-describedby={error ? 'playlist-name-error' : undefined}
        />
        {error && <span id="playlist-name-error" className="form-error" role="alert">{error}</span>}
      </div>
      <button className="play-all-button" type="submit">Tạo</button>
    </form>
  )
}

const MemoizedPlaylistCreateForm = memo(PlaylistCreateForm)

function PlaylistsPage() {
  const playlists = usePlaylists()
  const dispatch = usePlaylistDispatch()
  const playlistsRef = useRef(playlists)
  useEffect(() => {
    playlistsRef.current = playlists
  }, [playlists])
  const isDuplicateName = useCallback(
    (name: string) => playlistsRef.current.some(
      (playlist) => playlist.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi'),
    ),
    [],
  )

  return (
    <section className="page playlists-page" aria-labelledby="playlists-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">THƯ VIỆN CỦA BẠN</p>
          <h1 id="playlists-title">Playlist của bạn</h1>
          <p className="page-description">Tạo và sắp xếp danh sách phát yêu thích.</p>
        </div>
      </div>

      <MemoizedPlaylistCreateForm isDuplicateName={isDuplicateName} />

      {playlists.length === 0 ? (
        <div className="empty-state">Bạn chưa có playlist nào. Hãy tạo playlist đầu tiên.</div>
      ) : (
        <div className="playlist-list">
          {playlists.map((playlist) => (
            <article className="playlist-card" key={playlist.id}>
              <Link className="playlist-card-link" to={`/playlists/${playlist.id}`}>
                <span className="playlist-art" aria-hidden="true">♫</span>
                <span className="playlist-card-copy">
                  <strong>{playlist.name}</strong>
                  <span>{playlist.songIds.length} bài</span>
                </span>
              </Link>
              <button
                className="playlist-delete"
                type="button"
                onClick={() => dispatch({ type: 'remove', id: playlist.id })}
                aria-label={`Xóa playlist ${playlist.name}`}
              >
                Xóa
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default PlaylistsPage
