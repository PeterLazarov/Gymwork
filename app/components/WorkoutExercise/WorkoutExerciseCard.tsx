import React, { useMemo } from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Card } from 'react-native-paper'

import WorkoutExerciseSetList from './WorkoutExerciseSetList'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise, Workout } from 'app/db/models'
import { navigate } from 'app/navigators'
import { colors } from 'designSystem'
import { TouchableOpacity } from 'react-native'

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
    <TouchableOpacity onPress={onLinkPress}>
      <Card
        style={{
          margin: 16,
          backgroundColor: colors.primaryLighter,
        }}
      >
        <Card.Title
          title={exercise?.name}
          titleVariant="titleMedium"
          titleStyle={{ color: colors.secondaryText }}
        />
        <Card.Content>
          <WorkoutExerciseSetList
            sets={sets}
            exercise={exercise}
            records={exerciseRecords}
          />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )
}

export default observer(WorkoutExerciseCard)
