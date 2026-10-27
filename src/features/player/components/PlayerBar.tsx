import { usePlayerStore } from '../usePlayerStore'
import ProgressBar from './ProgressBar'

function PlayerBar() {
  const song = usePlayerStore((state) => state.queue[state.currentIndex] ?? null)
  const queueLength = usePlayerStore((state) => state.queue.length)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const togglePlay = usePlayerStore((state) => state.togglePlay)
  const next = usePlayerStore((state) => state.next)
  const prev = usePlayerStore((state) => state.prev)

  return (
    <footer className="player-bar" aria-label="Trình phát nhạc">
      <div className="player-track">
        <div className="player-art" aria-hidden="true">♫</div>
        <div className="player-song">
          <strong>{song ? `Đang phát: ${song.title} – ${song.artist}` : 'Chưa phát bài nào'}</strong>
        </div>
      </div>
      <div className="player-controls">
        <div className="player-buttons">
          <button type="button" onClick={prev} disabled={!song} aria-label="Trước">|◀</button>
          <button
            type="button"
            className="player-toggle"
            onClick={togglePlay}
            disabled={!song}
            aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
          >
            {isPlaying ? 'Ⅱ' : '▶'}
          </button>
          <button type="button" onClick={next} disabled={!song} aria-label="Sau">▶|</button>
        </div>
        <ProgressBar duration={song?.duration ?? 0} />
      </div>
      <div className="player-status">{`Hàng đợi: ${queueLength.toLocaleString('vi-VN')} bài`}</div>
    </footer>
  )
}

export default PlayerBar
