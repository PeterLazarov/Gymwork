import React, { useMemo } from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'

import WorkoutExerciseSetList from './WorkoutExerciseSetList'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise, Workout } from 'app/db/models'
import { navigate } from 'app/navigators'
import { Card, colors } from 'designSystem'

type Props = {
  workout: Workout
  exercise: Exercise
}

const WorkoutExerciseCard: React.FC<Props> = ({ workout, exercise }) => {
  const { stateStore, recordStore } = useStores()

  const isSelected = useMemo(
    () =>
      computed(() => stateStore.focusedExerciseGuids.includes(exercise.guid)),
    [stateStore.focusedExerciseGuids]
  ).get()

  function onCardPress() {
    stateStore.setOpenedExercise(exercise)
    navigate('WorkoutExercise')
  }

  function onLongPress() {
    if (isSelected) {
      stateStore.removeFocusExercise(exercise.guid)
    } else {
      stateStore.addFocusExercise(exercise.guid)
    }
  }

  const sets = workout.exerciseSetsMap[exercise.guid]
  const exerciseRecords = useMemo(
    () => computed(() => recordStore.getExerciseRecords(exercise.guid)),
    [sets]
  ).get()

  return (
    <Card
      onPress={onCardPress}
      title={exercise?.name}
      content={
        <WorkoutExerciseSetList
          sets={sets}
          exercise={exercise}
          records={exerciseRecords}
        />
      }
      onLongPress={onLongPress}
      delayLongPress={500}
      containerStyle={
        isSelected
          ? {
              backgroundColor: colors.primaryLight,
            }
          : undefined
      }
    />
  )
}

export default observer(WorkoutExerciseCard)
