import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useMemo } from 'react'
import { Card } from 'react-native-paper'

import WorkoutExerciseSetReadOnlyList from './WorkoutExerciseSetReadOnlyList/WorkoutExerciseSetReadOnlyList'
import { useStores } from '../../db/helpers/useStores'
import { Exercise, Workout } from '../../db/models'
import { AppStackParamList } from 'app/navigators'

type Props = {
  workout: Workout
  exercise: Exercise
}

const WorkoutExerciseCard: React.FC<Props> = ({ workout, exercise }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList, 'Workout'>>()

  const { stateStore } = useStores()

  const sets = useMemo(() => {
    return workout.sets.filter(set => set.exercise === exercise)
  }, [workout, exercise])

  function onLinkPress() {
    stateStore.setOpenedExercise(exercise)
    navigation.navigate('WorkoutExercise')
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
        <WorkoutExerciseSetReadOnlyList
          sets={sets}
          exercise={exercise}
        />
      </Card.Content>
    </Card>
  )
}

export default WorkoutExerciseCard
