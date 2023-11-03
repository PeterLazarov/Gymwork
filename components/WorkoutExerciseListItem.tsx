import { useRouter } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

import { WorkoutExerciseSetListItem } from './WorkoutExerciseSetListItem'
import { ButtonContainer, Divider } from '../designSystem'
import { SectionLabel } from '../designSystem/Label'
import { WorkoutExercise } from '../models/WorkoutExercise'
import { useStores } from '../models/helpers/useStores'

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
        {/* TODO: replace sorted with toSorted */}
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
