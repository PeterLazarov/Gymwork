import React, { useMemo } from 'react'
import { Card } from 'react-native-paper'

import WorkoutExerciseSetReadOnlyList from './WorkoutExerciseSetReadOnlyList/WorkoutExerciseSetReadOnlyList'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise, Workout } from 'app/db/models'
import { navigate } from 'app/navigators'
import { colors } from 'designSystem'

type Props = {
  workout: Workout
  exercise: Exercise
}

const WorkoutExerciseCard: React.FC<Props> = ({ workout, exercise }) => {
  const { stateStore } = useStores()

  const sets = useMemo(() => {
    return workout.sets.filter(set => set.exercise === exercise)
  }, [workout, exercise])

  function onLinkPress() {
    stateStore.setOpenedExercise(exercise)
    navigate('WorkoutExercise')
  }

  return (
    <Card
      onPress={onLinkPress}
      style={{
        margin: 16,
        backgroundColor: colors.lightgray,
      }}
    >
      <Card.Title
        title={exercise?.name}
        titleVariant="titleMedium"
        titleStyle={{ color: colors.secondaryText }}
      />
      <Card.Content>
        <WorkoutExerciseSetReadOnlyList
          sets={sets}
          exercise={exercise}
        />
      </Card.Content>
    </Card>
  )
}

export default WorkoutExerciseCard
