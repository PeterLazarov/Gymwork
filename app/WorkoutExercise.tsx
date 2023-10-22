import { useRouter } from 'expo-router'
import { useAtom } from 'jotai'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'

import { openedWorkoutExerciseAtom } from '../atoms'
import Layout from '../components/Layout'
import WorkoutExerciseEntry from '../components/WorkoutExerciseEntry'
import { Icon, IconButtonContainer } from '../designSystem'

export default function WorkoutPage() {
  const router = useRouter()
  const [openedWorkoutExercise, setOpenedWorkoutExercise] = useAtom(
    openedWorkoutExerciseAtom
  )

  function onOptionsPress() {
    throw new Error('Function not implemented.')
  }

  function onBackPress() {
    router.push('/')
    setOpenedWorkoutExercise(null)
  }

  return (
    <Layout>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          // justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <IconButtonContainer onPress={onBackPress}>
          <Icon icon="chevron-back" />
        </IconButtonContainer>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 26,
            flex: 1,
          }}
        >
          {openedWorkoutExercise?.name}
        </Text>

        <IconButtonContainer onPress={onOptionsPress}>
          <Icon icon="ellipsis-vertical" />
        </IconButtonContainer>
      </View>
      <WorkoutExerciseEntry exercise={openedWorkoutExercise!} />
    </Layout>
  )
}
