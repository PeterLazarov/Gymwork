import { useEffect, useRef } from 'react'
import { useStores } from '../db/helpers/useStores'
import { timerKey } from 'app/db/stores/TimerStore'

export function useTimer() {
  const { stateStore, timerStore } = useStores()

  // TODO revisit for multiple timers
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const timer = timerStore.timers.get(timerKey)!

  // TODO replace this with superset support
  const lastExercise = useRef(stateStore.focusedStepGuid)
  useEffect(() => {
    if (!lastExercise.current) {
      lastExercise.current = stateStore.focusedStepGuid
      return
    }

    if (
      stateStore.focusedStepGuid &&
      stateStore.focusedStepGuid !== lastExercise.current
    ) {
      lastExercise.current = stateStore.focusedStepGuid
      timer.clear()
    }
  }, [stateStore.focusedStepGuid])

  return timer
}
