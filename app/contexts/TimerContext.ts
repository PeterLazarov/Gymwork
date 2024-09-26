import { useStores } from '../db/helpers/useStores'
import { restTimerKey } from 'app/db/stores/TimerStore'

export function useTimer() {
  const { timerStore } = useStores()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return timerStore.timers.get(restTimerKey)!
}
