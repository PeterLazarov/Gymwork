import { observer } from 'mobx-react-lite'
import React from 'react'
import { Text, View } from 'react-native'

import colors from '../designSystem/colors'
import { WorkoutSet } from '../models/WorkoutSet'
import texts from '../texts'

type Props = {
  set: WorkoutSet
  isFocused?: boolean
}

const WorkoutExerciseSetListItem: React.FC<Props> = ({ set, isFocused }) => {
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

export default observer(WorkoutExerciseSetListItem)
