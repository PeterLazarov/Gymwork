import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { Card } from 'react-native-paper'

import WorkoutExerciseSetListItem from './WorkoutExerciseSetListItem'
import { useStores } from '../../db/helpers/useStores'
import { Exercise, Workout } from '../../db/models'

type Props = {
  workout: Workout
  exercise: Exercise
}

const WorkoutExerciseCard: React.FC<Props> = ({ workout, exercise }) => {
  const router = useRouter()
  const { workoutStore } = useStores()

  const sets = useMemo(() => {
    return workout.sets.filter(set => set.exercise === exercise)
  }, [workout, exercise])

  const warmupSets = useMemo(() => sets.filter(e => e.isWarmup), [sets])
  const actualSets = useMemo(() => sets.filter(e => !e.isWarmup), [sets])

  function onLinkPress() {
    workoutStore.setOpenedExercise(exercise)
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
        title={exercise?.name}
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
