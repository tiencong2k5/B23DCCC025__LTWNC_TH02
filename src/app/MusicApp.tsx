import { lazy, Suspense } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import LibraryPage from '../features/library/pages/LibraryPage'
import PlayerBar from '../features/player/components/PlayerBar'
import PlayerClock from '../features/player/components/PlayerClock'
import { PlaylistProvider } from '../features/playlists/PlaylistProvider'
import { ThemeProvider } from '../shared/contexts/ThemeProvider'
import { useTheme } from '../shared/contexts/ThemeContext'
import SimplePage from './SimplePage'
import '../App.css'

const LazyFavoritesPage = lazy(() => import('../features/favorites/pages/FavoritesPage'))
const LazyPlaylistsPage = lazy(() => import('../features/playlists/pages/PlaylistsPage'))
const LazyPlaylistDetailPage = lazy(() => import('../features/playlists/pages/PlaylistDetailPage'))

function RoutedMusicApp() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="app-shell" data-theme={theme}>
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
        <button className="theme-toggle" type="button" onClick={toggleTheme}>
          {theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}
        </button>
        <div className="profile-chip"><span>♪</span> Mini Player</div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<LibraryPage />} />
          <Route
            path="/favorites"
            element={<Suspense fallback={<p className="route-loading">Đang tải trang...</p>}><LazyFavoritesPage /></Suspense>}
          />
          <Route
            path="/playlists"
            element={<Suspense fallback={<p className="route-loading">Đang tải trang...</p>}><LazyPlaylistsPage /></Suspense>}
          />
          <Route
            path="/playlists/:id"
            element={<Suspense fallback={<p className="route-loading">Đang tải trang...</p>}><LazyPlaylistDetailPage /></Suspense>}
          />
          <Route
            path="*"
            element={<SimplePage title="Không tìm thấy trang" description="Trang bạn tìm hiện không tồn tại." />}
          />
        </Routes>
      </main>

      <PlayerClock />
      <PlayerBar />
    </div>
  )
}

function MusicApp() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <PlaylistProvider>
          <RoutedMusicApp />
        </PlaylistProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default MusicApp
