import { Duration } from 'luxon'
import { useMemo, useRef, useState } from 'react'

const defaultDuration = Duration.fromDurationLike({ minutes: 0 })
const defaultUpdateFrequency = Duration.fromMillis(50)

export default function useTimer() {
  const intervalHandle = useRef<NodeJS.Timeout>()

  const [timeElapsed, setTimeElapsed] = useState(Duration.fromMillis(0))
  const [duration, setDuration] = useState(defaultDuration)
  const lastTickAt = useRef(Date.now())

  const timeLeft = useMemo(
    () => duration.minus(timeElapsed),
    [timeElapsed, duration]
  )

  // TODO should reset and start anew
  function start(
    duration: Duration = defaultDuration,
    updateFrequency: Duration = defaultUpdateFrequency
  ) {
    setDuration(duration)
    setTimeElapsed(Duration.fromMillis(0))

    startTickInterval(updateFrequency)
  }

  // Resume teleports to time in the past
  function startTickInterval(
    updateFrequency: Duration = defaultUpdateFrequency
  ) {
    if (!intervalHandle.current) {
      lastTickAt.current = Date.now()
      intervalHandle.current = setInterval(tick, updateFrequency.toMillis())
    }
  }

  function stop() {
    if (intervalHandle.current) {
      clearInterval(intervalHandle.current)
      intervalHandle.current = undefined
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
  }

  function clear() {
    stop()
    setTimeElapsed(Duration.fromMillis(0))
    setDuration(Duration.fromMillis(0))
  }

  // clear -> resume leads to -

  return {
    timeLeft,
    timeElapsed,
    start,
    stop,
    clear,
  }
}
