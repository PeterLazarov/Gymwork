import React, { useMemo } from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'

import WorkoutExerciseSetList from './WorkoutExerciseSetList'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise, Workout } from 'app/db/models'
import { navigate } from 'app/navigators'
import { Card } from 'designSystem'

type Props = {
  workout: Workout
  exercise: Exercise
}

const WorkoutExerciseCard: React.FC<Props> = ({ workout, exercise }) => {
  const { stateStore, recordStore } = useStores()

  function onLinkPress() {
    stateStore.setOpenedExercise(exercise)
    navigate('WorkoutExercise')
  }

  const sets = workout.exerciseSetsMap[exercise.guid]
  const exerciseRecords = useMemo(
    () => computed(() => recordStore.getExerciseRecords(exercise.guid)),
    [sets]
  ).get()

  return (
    <Card
      onPress={onLinkPress}
      title={exercise?.name}
      content={
        <WorkoutExerciseSetList
          sets={sets}
          exercise={exercise}
          records={exerciseRecords}
        />
      }
    />
  )
}

export default observer(WorkoutExerciseCard)
