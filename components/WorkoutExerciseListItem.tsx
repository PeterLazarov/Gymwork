import { useRouter } from 'expo-router'
import { useAtom } from 'jotai'
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { WorkoutExerciseSetListItem } from './WorkoutExerciseSetListItem'
import { openedWorkoutExerciseAtom } from '../atoms'
import { WorkoutExercise } from '../db/models'
import { Divider } from '../designSystem'

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
    <TouchableOpacity
      onPress={onLinkPress}
      style={{
        flex: 1,
        backgroundColor: '#f4f4f4',
        padding: 16,
        margin: 16,
        borderRadius: 8,
        gap: 24,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          {exercise.name}
        </Text>
        <Divider />
        {exercise.sets
          .sort((a, b) => a.id - b.id)
          .map((set, i) => (
            <WorkoutExerciseSetListItem
              key={i}
              set={set}
            />
          ))}
      </View>
    </TouchableOpacity>
  )
}

export default WorkoutExerciseEntry
