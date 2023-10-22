import { Link } from 'expo-router'
import { useAtom } from 'jotai'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'

import { openedWorkoutExerciseAtom } from '../atoms'
import Layout from '../components/Layout'
import { Icon, IconButtonContainer } from '../designSystem'

export default function WorkoutPage() {
  const [openedWorkoutExercise] = useAtom(openedWorkoutExerciseAtom)

  function onOptionsClick() {
    throw new Error('Function not implemented.')
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
        <Link href="/">
          <Icon icon="chevron-back" />
        </Link>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 26,
            flex: 1,
          }}
        >
          {openedWorkoutExercise?.name}
        </Text>
        <IconButtonContainer onPress={onOptionsClick}>
          <Icon icon="ellipsis-vertical" />
        </IconButtonContainer>
      </View>
    </Layout>
  )
}
