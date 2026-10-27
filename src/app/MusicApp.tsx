import { useCallback, useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import type { Song } from '../types'
import FavoritesPage from '../features/favorites/pages/FavoritesPage'
import LibraryPage from '../features/library/pages/LibraryPage'
import PlaylistDetailPage from '../features/playlists/pages/PlaylistDetailPage'
import PlaylistsPage from '../features/playlists/pages/PlaylistsPage'
import PlayerBar from '../features/player/components/PlayerBar'
import SimplePage from './SimplePage'
import '../App.css'

function  MusicApp() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const playSong = useCallback((song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
  }, [])
  const togglePlayback = useCallback(() => setIsPlaying((playing) => !playing), [])
  const stopPlayback = useCallback(() => setIsPlaying(false), [])

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="topbar">
          <NavLink className="brand" to="/" aria-label="Giai điệu, trang chủ">
            <span className="brand-mark">♫</span>
            <span>giai điệu<span className="brand-period">.</span></span>
          </NavLink>
          <nav className="main-nav" aria-label="Điều hướng chính">
            <NavLink to="/" end>Thư viện</NavLink>
            <NavLink to="/favorites">Yêu thích</NavLink>
            <NavLink to="/playlists">Playlist</NavLink>
          </nav>
          <div className="profile-chip"><span>♪</span> Mini Player</div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<LibraryPage onPlay={playSong} />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
            <Route
              path="*"
              element={<SimplePage title="Không tìm thấy trang" description="Trang bạn tìm hiện không tồn tại." />}
            />
          </Routes>
        </main>

        <PlayerBar song={currentSong} isPlaying={isPlaying} onToggle={togglePlayback} onEnded={stopPlayback} />
      </div>
    </BrowserRouter>
  )
}

export default MusicApp
