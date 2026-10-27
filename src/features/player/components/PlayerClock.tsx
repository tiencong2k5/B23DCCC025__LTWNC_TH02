import { useEffect } from 'react'
import { usePlayerStore } from '../usePlayerStore'

function PlayerClock() {
  const isPlaying = usePlayerStore((state) => state.isPlaying)

  useEffect(() => {
    if (!isPlaying) return

    const intervalId = window.setInterval(() => {
      usePlayerStore.getState().tick()
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [isPlaying])

  return null
}

export default PlayerClock
