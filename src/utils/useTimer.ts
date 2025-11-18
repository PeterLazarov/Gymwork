import { Duration } from "luxon"
import { useCallback, useEffect, useRef, useState } from "react"

export type Timer = {
  timeLimit: Duration
  timeElapsed: Duration
  isRunning: boolean
  resume: () => void
  stop: () => void
  reset: () => void
  setTimeLimit: (timeLimit: Duration) => void
  setTimeElapsed: (timeLimit: Duration) => void
}

export type UseTimerOptions = {
  initialTimeLimit?: Duration
  onComplete?: () => void
  updateInterval?: number
}

export function useTimer({
  initialTimeLimit = Duration.fromMillis(0),
  onComplete,
  updateInterval = 100,
}: UseTimerOptions = {}): Timer {
  const [timeLimit, setTimeLimit] = useState(initialTimeLimit)
  const [timeElapsed, setTimeElapsed] = useState(Duration.fromMillis(0))
  const [isRunning, setIsRunning] = useState(false)

  const startRef = useRef<number | null>(null)
  const elapsedStartRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    startRef.current = null
    setIsRunning(false)
  }, [])

  const resume = useCallback(() => {
    if (isRunning) return

    startRef.current = Date.now()
    elapsedStartRef.current = timeElapsed.toMillis()
    setIsRunning(true)

    intervalRef.current = setInterval(() => {
      const elapsed = elapsedStartRef.current + (Date.now() - (startRef.current ?? Date.now()))
      const next = Duration.fromMillis(elapsed)

      setTimeElapsed(next)

      if (timeLimit.toMillis() > 0 && elapsed >= timeLimit.toMillis()) {
        stop()
        onCompleteRef.current?.()
      }
    }, updateInterval)
  }, [isRunning, timeElapsed, timeLimit, updateInterval, stop])

  const reset = useCallback(() => {
    stop()
    setTimeElapsed(Duration.fromMillis(0))
    resume()
  }, [stop])

  const setElapsedSafe = useCallback((d: Duration) => {
    setTimeElapsed(d)
    elapsedStartRef.current = d.toMillis()
  }, [])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return {
    timeLimit,
    timeElapsed,
    isRunning,
    resume,
    stop,
    reset,
    setTimeLimit,
    setTimeElapsed: setElapsedSafe,
  }
}
