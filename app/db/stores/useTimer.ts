import { Duration } from 'luxon'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createContext } from 'react'
import { setDriftlessInterval, clearDriftless } from 'driftless'
import { useStores } from '../helpers/useStores'
import { Vibration } from 'react-native'

export const TimerContext = createContext<ReturnType<typeof _useTimer>>(
  null as any
)

const defaultDuration = Duration.fromDurationLike({ minutes: 0 })
const defaultUpdateFrequency = Duration.fromMillis(1000)

function _useTimer() {
  const [intervalHandle, setIntervalHandle] = useState<number | null>(null)

  const [timeElapsed, setTimeElapsed] = useState(Duration.fromMillis(0))
  const [duration, setDuration] = useState(defaultDuration)
  const lastTickAt = useRef(Date.now())

  const isRunning = useMemo(() => intervalHandle !== null, [intervalHandle])
  const inCountdownMode = useMemo(() => duration.toMillis() !== 0, [duration])

  const timeLeft = useMemo(() => {
    const timeLeftDuration = duration.minus(timeElapsed)
    const timeLeftMillis = timeLeftDuration.toMillis()
    const absTimeLeft = Duration.fromMillis(Math.abs(timeLeftMillis))

    return absTimeLeft
  }, [timeElapsed, duration])

  // TODO should reset and start anew
  function start() {
    setTimeElapsed(Duration.fromMillis(0))
    startTickInterval(defaultUpdateFrequency)
  }

  function resume() {
    startTickInterval(defaultUpdateFrequency)
  }

  // Resume teleports to time in the past
  function startTickInterval(
    updateFrequency: Duration = defaultUpdateFrequency
  ) {
    if (intervalHandle === null) {
      lastTickAt.current = Date.now()
      setIntervalHandle(setDriftlessInterval(tick, updateFrequency.toMillis()))
    }
  }

  function stop() {
    if (intervalHandle !== null) {
      clearDriftless(intervalHandle)
      setIntervalHandle(null)
      tick()
    }
  }

  function tick() {
    const now = Date.now()

    const timePassedSinceLastTick = Duration.fromMillis(
      now - lastTickAt.current
    )

    lastTickAt.current = now
    setTimeElapsed(timeElapsed => timeElapsed.plus(timePassedSinceLastTick))

    if (inCountdownMode && timeLeft.toMillis() <= 0) {
      Vibration.vibrate([500, 200, 500])
    }
  }

  function clear() {
    stop()
    setTimeElapsed(Duration.fromMillis(0))
  }

  useEffect(() => () => stop(), [])

  return {
    start,
    stop,
    clear,
    resume,
    timeLeft,
    timeElapsed,
    setTimeElapsed, // ?
    isRunning,
    inCountdownMode,
    duration,
    setDuration,
  }
}

export default function useTimer() {
  const { stateStore } = useStores()

  const ctx = useContext(TimerContext)
  const timer = ctx || _useTimer()

  // TODO replace this with superset support
  const lastExercise = useRef(stateStore.openedExerciseGuid)
  useEffect(() => {
    if (!lastExercise.current) {
      lastExercise.current = stateStore.openedExerciseGuid
      return
    }

    if (
      stateStore.openedExerciseGuid &&
      stateStore.openedExerciseGuid !== lastExercise.current
    ) {
      lastExercise.current = stateStore.openedExerciseGuid
      timer.clear()
    }
  }, [stateStore.openedExerciseGuid])

  return timer
}
