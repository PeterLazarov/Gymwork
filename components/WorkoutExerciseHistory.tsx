import { observer } from 'mobx-react-lite'
import React from 'react'
import { View, Text, ScrollView } from 'react-native'

import WorkoutExerciseSetListItem from './WorkoutExerciseSetListItem'
import { useStores } from '../db/helpers/useStores'
import { WorkoutSet, WorkoutExercise } from '../db/models'
import { ButtonContainer, Divider } from '../designSystem'
import colors from '../designSystem/colors'

type Props = {
  exercise: WorkoutExercise
}

const WorkoutExerciseEntry: React.FC<Props> = ({ exercise }) => {
  const { workoutStore } = useStores()

  return (
    <View
      style={{
        padding: 16,
        // margin: 16,
        borderRadius: 8,
        gap: 24,
        flexDirection: 'column',
      }}
    >
      <Text>History</Text>
    </View>
  )
}

export default observer(WorkoutExerciseEntry)
