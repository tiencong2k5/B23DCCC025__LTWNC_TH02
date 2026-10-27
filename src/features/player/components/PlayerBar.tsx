import { useEffect, useState } from 'react'
import type { Song } from '../../../types'
import { formatDuration } from '../../../shared/utils/format'

interface PlayerBarProps {
  song: Song | null
  isPlaying: boolean
  onToggle: () => void
  onEnded: () => void
}

function PlayerBar({ song, isPlaying, onToggle, onEnded }: PlayerBarProps) {
  const [timer, setTimer] = useState({ songId: '', seconds: 0 })
  const elapsed = song && timer.songId === song.id ? timer.seconds : 0
  
  useEffect(() => {
    if (!song || !isPlaying) return

    const intervalId = window.setInterval(() => {
      setTimer((current) => ({
        songId: song.id,
        seconds: current.songId === song.id ? Math.min(current.seconds + 1, song.duration) : 1,
      }))
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [song, isPlaying])

  useEffect(() => {
    if (song && isPlaying && elapsed >= song.duration) onEnded()
  }, [elapsed, isPlaying, onEnded, song])

  const progress = song ? (elapsed / song.duration) * 100 : 0

  return (
    <footer className="player-bar" aria-label="Trình phát nhạc">
      <div className="player-track">
        <div className="player-art" aria-hidden="true">♫</div>
        <div className="player-song">
          <strong>{song?.title ?? 'Chưa phát bài hát'}</strong>
          <span>{song?.artist ?? 'Chọn một bài hát trong thư viện'}</span>
        </div>
      </div>
      <div className="player-controls">
        <button type="button" className="player-toggle" onClick={onToggle} disabled={!song} aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}>
          {isPlaying ? 'Ⅱ' : '▶'}
        </button>
        <div className="progress-row">
          <span>{formatDuration(elapsed)}</span>
          <div className="progress-track" role="progressbar" aria-label="Tiến trình bài hát" aria-valuemin={0} aria-valuemax={song?.duration ?? 0} aria-valuenow={elapsed}>
            <span style={{ width: `${progress}%` }} />
          </div>
          <span>{formatDuration(song?.duration ?? 0)}</span>
        </div>
      </div>
      <div className="player-status">{isPlaying ? 'ĐANG PHÁT' : song ? 'ĐÃ TẠM DỪNG' : 'SẴN SÀNG'}</div>
    </footer>
  )
}

export default PlayerBar
