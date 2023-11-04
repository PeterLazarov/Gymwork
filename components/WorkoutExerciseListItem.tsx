import { useRouter } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

import WorkoutExerciseSetListItem from './WorkoutExerciseSetListItem'
import { useStores } from '../db/helpers/useStores'
import { WorkoutExercise } from '../db/models'
import { ButtonContainer, Divider } from '../designSystem'
import { SectionLabel } from '../designSystem/Label'

type Props = {
  exercise: WorkoutExercise
}

const WorkoutExerciseEntry: React.FC<Props> = ({ exercise }) => {
  const router = useRouter()
  const { workoutStore } = useStores()

  function onLinkPress() {
    workoutStore.setOpenedExercise(exercise)
    router.push('/WorkoutExercise')
  }
  return (
    <ButtonContainer
      variant="secondary"
      onPress={onLinkPress}
      style={{
        margin: 16,
      }}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <SectionLabel>{exercise.exercise?.name}</SectionLabel>
        <Divider />
        {exercise.sets.map((set, i) => (
          <WorkoutExerciseSetListItem
            key={i}
            set={set}
          />
        ))}
      </View>
    </ButtonContainer>
  )
}

export default WorkoutExerciseEntry
