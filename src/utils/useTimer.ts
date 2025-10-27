import { Duration } from "luxon"
import { useCallback, useEffect, useRef, useState } from "react"

export type TimerType = "rest" | "exercise" | "general"

export type Timer = {
  duration: Duration
  timeElapsed: Duration
  type: TimerType
  isRunning: boolean
  resume: () => void
  stop: () => void
  reset: () => void
  setDuration: (duration: Duration) => void
  setTimeElapsed: (duration: Duration) => void
  setProp: <K extends keyof Timer>(key: K, value: Timer[K]) => void
}

export type UseTimerOptions = {
  initialDuration?: Duration
  initialType?: TimerType
  onComplete?: () => void
  updateInterval?: number // milliseconds
}

/**
 * A hook that provides timer functionality with elapsed time tracking
 * @param options - Configuration options for the timer
 * @returns Timer object with current state and control methods
 */
export function useTimer(options: UseTimerOptions = {}): Timer {
  const {
    initialDuration = Duration.fromMillis(0),
    initialType = "general",
    onComplete,
    updateInterval = 100,
  } = options

  const [duration, setDuration] = useState(initialDuration)
  const [timeElapsed, setTimeElapsed] = useState(Duration.fromMillis(0))
  const [type, setType] = useState<TimerType>(initialType)
  const [isRunning, setIsRunning] = useState(false)
  const [, setTick] = useState(0) // Force re-renders

  const startTimeRef = useRef<number | null>(null)
  const elapsedAtStartRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const onCompleteRef = useRef(onComplete)

  // Keep onComplete ref up to date
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    startTimeRef.current = null
  }, [])

  const resume = useCallback(() => {
    if (isRunning) return

    startTimeRef.current = Date.now()
    elapsedAtStartRef.current = timeElapsed.toMillis()
    setIsRunning(true)

    intervalRef.current = setInterval(() => {
      const now = Date.now()
      const elapsed = elapsedAtStartRef.current + (now - (startTimeRef.current ?? now))
      const newTimeElapsed = Duration.fromMillis(elapsed)

      setTimeElapsed(newTimeElapsed)
      setTick((prev) => prev + 1) // Force re-render

      // Check if timer has completed
      if (duration.toMillis() > 0 && elapsed >= duration.toMillis()) {
        stop()
        onCompleteRef.current?.()
      }
    }, updateInterval)
  }, [isRunning, timeElapsed, duration, updateInterval, stop])

  const reset = useCallback(() => {
    stop()
    setTimeElapsed(Duration.fromMillis(0))
    elapsedAtStartRef.current = 0
  }, [stop])

  const handleSetTimeElapsed = useCallback((newDuration: Duration) => {
    setTimeElapsed(newDuration)
    elapsedAtStartRef.current = newDuration.toMillis()
  }, [])

  const setProp = useCallback(
    <K extends keyof Timer>(key: K, value: Timer[K]) => {
      switch (key) {
        case "duration":
          setDuration(value as Duration)
          break
        case "timeElapsed":
          handleSetTimeElapsed(value as Duration)
          break
        case "type":
          setType(value as TimerType)
          break
        case "isRunning":
          if (value) {
            resume()
          } else {
            stop()
          }
          break
        default:
          console.warn(`Cannot set property ${String(key)} on Timer`)
      }
    },
    [handleSetTimeElapsed, resume, stop],
  )

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    duration,
    timeElapsed,
    type,
    isRunning,
    resume,
    stop,
    reset,
    setDuration,
    setTimeElapsed: handleSetTimeElapsed,
    setProp,
  }
}
