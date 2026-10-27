export interface Playlist {
  id: string
  name: string
  songIds: string[]
}

export type PlaylistAction =
  | { type: 'create'; playlist: Playlist }
  | { type: 'rename'; id: string; name: string }
  | { type: 'remove'; id: string }
  | { type: 'addSong'; id: string; songId: string }
  | { type: 'removeSong'; id: string; songId: string }

export function playlistReducer(state: Playlist[], action: PlaylistAction): Playlist[] {
  switch (action.type) {
    case 'create':
      return [...state, action.playlist]
    case 'rename':
      return state.map((playlist) =>
        playlist.id === action.id ? { ...playlist, name: action.name } : playlist,
      )
    case 'remove':
      return state.filter((playlist) => playlist.id !== action.id)
    case 'addSong':
      return state.map((playlist) => {
        if (playlist.id !== action.id || playlist.songIds.includes(action.songId)) return playlist
        return { ...playlist, songIds: [...playlist.songIds, action.songId] }
      })
    case 'removeSong':
      return state.map((playlist) => {
        if (playlist.id !== action.id) return playlist
        return { ...playlist, songIds: playlist.songIds.filter((songId) => songId !== action.songId) }
      })
  }
}

export function withLogger(reducer: typeof playlistReducer): typeof playlistReducer {
  return (state, action) => {
    const nextState = reducer(state, action)
    if (import.meta.env.DEV) {
      console.log(`[playlistReducer] ${action.type}`, { previousState: state, nextState })
    }
    return nextState
  }
}
