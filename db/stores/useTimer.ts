import { Duration } from 'luxon'
import { useMemo, useRef, useState } from 'react'

// TODO store timestamps in context

export default function useTimer() {
  const startedAt = useRef(0)
  const intervalHandle = useRef<NodeJS.Timeout>()

  const [_timeLeft, setTimeLeft] = useState(0)

  const timeLeft = useMemo(() => {
    return Duration.fromMillis(_timeLeft)
  }, [_timeLeft])

  function start(
    duration: Duration,
    updateFrequency: Duration = Duration.fromMillis(1000)
  ) {
    const now = Date.now()
    // startedAt.current = now
    startedAt.current = now

    console.log(now)

    intervalHandle.current = setInterval(() => {
      const now2 = Date.now()
      setTimeLeft(now2 - startedAt.current)
      console.log({
        now,
        now2,
        startedAt: startedAt.current,
        timeLeft: _timeLeft,
      })
    }, updateFrequency.toMillis())
  }

  function stop() {
    intervalHandle.current && clearInterval(intervalHandle.current)
    setTimeLeft(Date.now() - startedAt.current)
  }
  function clear() {
    // setStartedAt(0)
  }

  return { timeLeft, start, stop, clear }
}
