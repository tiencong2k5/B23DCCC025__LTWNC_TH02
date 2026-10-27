import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { PlaylistDispatchContext, PlaylistStateContext } from './PlaylistContext'
import { playlistReducer, withLogger, type Playlist } from './playlistReducer'

const STORAGE_KEY = 'music-playlists'

function isPlaylistList(value: unknown): value is Playlist[] {
  return Array.isArray(value) && value.every((item: unknown) =>
    typeof item === 'object' &&
    item !== null &&
    'id' in item && typeof item.id === 'string' &&
    'name' in item && typeof item.name === 'string' &&
    'songIds' in item && Array.isArray(item.songIds) &&
    item.songIds.every((songId: unknown) => typeof songId === 'string'),
  )
}

function loadPlaylists(): Playlist[] {
  const savedPlaylists = window.localStorage.getItem(STORAGE_KEY)
  if (!savedPlaylists) return []

  try {
    const parsed: unknown = JSON.parse(savedPlaylists)
    if (!isPlaylistList(parsed)) throw new TypeError('Dữ liệu playlist đã lưu không đúng định dạng.')
    return parsed
  } catch (error) {
    console.error('Không thể đọc danh sách playlist đã lưu.', error)
    return []
  }
}

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const [playlists, dispatch] = useReducer(withLogger(playlistReducer), undefined, loadPlaylists)
  const stateValue = useMemo(() => playlists, [playlists])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists))
  }, [playlists])

  return (
    <PlaylistStateContext.Provider value={stateValue}>
      <PlaylistDispatchContext.Provider value={dispatch}>
        {children}
      </PlaylistDispatchContext.Provider>
    </PlaylistStateContext.Provider>
  )
}
