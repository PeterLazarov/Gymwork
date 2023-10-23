import { TR } from '@expo/html-elements'
import React from 'react'
import { Text, View } from 'react-native'

import { WorkoutExerciseSet } from '../db/models'
import texts from '../texts'
import colors from '../designSystem/colors'

type Props = {
  set: WorkoutExerciseSet
  isFocused?: boolean
}

export const WorkoutExerciseSetListItem: React.FC<Props> = ({
  set,
  isFocused,
}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        // alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      <View style={{ flexDirection: 'row', gap: 4 }}>
        <Text
          style={{
            fontWeight: 'bold',
            color: isFocused ? colors.primary : colors.secondaryText,
          }}
        >
          {set.reps}
        </Text>
        <Text
          style={{
            color: isFocused ? colors.primary : colors.secondaryText,
          }}
        >
          {texts.reps}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        <Text
          style={{
            fontWeight: 'bold',
            color: isFocused ? colors.primary : colors.secondaryText,
          }}
        >
          {set.weight}
        </Text>
        <Text
          style={{
            color: isFocused ? colors.primary : colors.secondaryText,
          }}
        >
          kgs
        </Text>
      </View>
    </View>
  )
}
