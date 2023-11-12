import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { Card } from 'react-native-paper'

import WorkoutExerciseSetListItem from './WorkoutExerciseSetListItem'
import { useStores } from '../../db/helpers/useStores'
import { WorkoutExercise } from '../../db/models'

type Props = {
  exercise: WorkoutExercise
}

const WorkoutExerciseCard: React.FC<Props> = ({ exercise }) => {
  const router = useRouter()
  const { workoutStore } = useStores()

  const warmupSets = useMemo(
    () => exercise.sets.filter(e => e.isWarmup),
    [exercise.sets]
  )
  const actualSets = useMemo(
    () => exercise.sets.filter(e => !e.isWarmup),
    [exercise.sets]
  )

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
        {warmupSets.map(set => (
          <WorkoutExerciseSetListItem
            key={set.guid}
            set={set}
            exercise={exercise}
          />
        ))}
        {actualSets.map((set, i) => (
          <WorkoutExerciseSetListItem
            key={set.guid}
            set={set}
            exercise={exercise}
            number={i + 1}
          />
        ))}
      </Card.Content>
    </Card>
  )
}

export default WorkoutExerciseCard
