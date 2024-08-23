import { useStores } from 'app/db/helpers/useStores'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Text } from 'react-native'
import { clearDriftless, setDriftlessInterval } from 'driftless'
import { Duration } from 'luxon'

export type WorkoutTimerProps = {}

const WorkoutTimer: React.FC<WorkoutTimerProps> = props => {
  const { stateStore } = useStores()

  const workoutStart = useMemo(() => {
    return stateStore.openedWorkout.sets[0]?.createdAt
  }, [stateStore.openedWorkout])

  // TODO sets need to be added on the same day to count
  const [workoutMaybeEnd, setWorkoutMaybeEnd] = useState<Date | undefined>(
    stateStore.isOpenedWorkoutToday
      ? new Date()
      : stateStore.openedWorkout.sets.at(-1)?.createdAt
  )

  const shownDuration = useMemo(() => {
    if (workoutStart && workoutMaybeEnd) {
      return Duration.fromMillis(
        workoutMaybeEnd.getTime() - workoutStart.getTime()
      ).toFormat('hh:mm:ss')
    }

    return null
  }, [workoutStart, workoutMaybeEnd])

  const handle = useRef<number | null>(null)
  function cleanup() {
    if (handle.current !== null) {
      clearDriftless(handle.current)
    }
  }
  useEffect(() => {
    cleanup()

    if (stateStore.isOpenedWorkoutToday) {
      handle.current = setDriftlessInterval(() => {
        // 30m have passed i.e. workout has probably ended, snap back to last set
        const halfHourPassed =
          Duration.fromMillis(
            Date.now() -
              (stateStore.openedWorkout.sets.at(-1)?.createdAt?.getTime() ??
                Date.now())
          ).as('minutes') > 30
        if (halfHourPassed) {
          setWorkoutMaybeEnd(
            stateStore.openedWorkout.sets.at(-1)?.createdAt ?? new Date()
          )
          cleanup()
        } else {
          setWorkoutMaybeEnd(new Date())
        }
      }, 1000)
    }

    return cleanup
  }, [stateStore.openedWorkout])

  return shownDuration && <Text>Duration :{shownDuration}</Text>
}

export default observer(WorkoutTimer)
