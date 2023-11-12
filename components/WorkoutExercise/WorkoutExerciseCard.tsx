import { useRouter } from 'expo-router'
import React from 'react'
import { Card } from 'react-native-paper'

import WorkoutExerciseSetListItem from './WorkoutExerciseSetListItem'
import { useStores } from '../../db/helpers/useStores'
import { WorkoutExercise } from '../../db/models'

type Props = {
  exercise: WorkoutExercise
}

const WorkoutExerciseEntry: React.FC<Props> = ({ exercise }) => {
  const router = useRouter()
  const { workoutStore } = useStores()

  function onLinkPress() {
    workoutStore.setOpenedWorkoutExercise(exercise)
    router.push('/WorkoutExercise')
  }
  return (
    <Card
      onPress={onLinkPress}
      style={{
        margin: 16,
      }}
    >
      <Card.Title
        title={exercise.exercise?.name}
        titleVariant="titleMedium"
      />
      <Card.Content>
        {exercise.sets.map(set => (
          <WorkoutExerciseSetListItem
            key={set.guid}
            set={set}
            exercise={exercise}
          />
        ))}
      </Card.Content>
    </Card>
  )
}

export default WorkoutExerciseEntry
