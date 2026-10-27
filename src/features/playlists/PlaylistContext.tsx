import { createContext, useContext, type Dispatch } from 'react'
import type { Playlist, PlaylistAction } from './playlistReducer'

export const PlaylistStateContext = createContext<Playlist[] | undefined>(undefined)
export const PlaylistDispatchContext = createContext<Dispatch<PlaylistAction> | undefined>(undefined)

export function usePlaylists(): Playlist[] {
  const playlists = useContext(PlaylistStateContext)
  if (!playlists) throw new Error('usePlaylists phải được dùng bên trong PlaylistProvider')
  return playlists
}

export function usePlaylistDispatch(): Dispatch<PlaylistAction> {
  const dispatch = useContext(PlaylistDispatchContext)
  if (!dispatch) throw new Error('usePlaylistDispatch phải được dùng bên trong PlaylistProvider')
  return dispatch
}
