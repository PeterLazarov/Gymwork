import { useRouter } from 'expo-router'
import { useAtom } from 'jotai'
import React from 'react'
import { View } from 'react-native'

import { WorkoutExerciseSetListItem } from './WorkoutExerciseSetListItem'
import { openedWorkoutExerciseAtom } from '../atoms'
import { WorkoutExercise } from '../db/models'
import { ButtonContainer, Divider } from '../designSystem'
import { SectionLabel } from '../designSystem/Label'

type Props = {
  exercise: WorkoutExercise
}

const WorkoutExerciseEntry: React.FC<Props> = ({ exercise }) => {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setOpenedWorkoutExercise] = useAtom(openedWorkoutExerciseAtom)

  function onLinkPress() {
    setOpenedWorkoutExercise(exercise)
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
        <SectionLabel>{exercise.name}</SectionLabel>
        <Divider />
        {/* TODO: replace sorted with toSorted */}
        {exercise.sets
          .sort((a, b) => a.id - b.id)
          .map((set, i) => (
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
