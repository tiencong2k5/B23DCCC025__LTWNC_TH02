import { usePlayerStore } from '../usePlayerStore'
import { formatDuration } from '../../../shared/utils/format'

interface ProgressBarProps {
  duration: number
}

function ProgressBar({ duration }: ProgressBarProps) {
  const position = usePlayerStore((state) => state.position)
  const progress = duration > 0 ? Math.min((position / duration) * 100, 100) : 0

  return (
    <div className="progress-row">
      <span>{formatDuration(position)}</span>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Tiến trình bài hát"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={position}
      >
        <span style={{ width: `${progress}%` }} />
      </div>
      <span>{formatDuration(duration)}</span>
    </div>
  )
}

export default ProgressBar
