import { TR } from '@expo/html-elements'
import React from 'react'
import { Text, View } from 'react-native'

import { WorkoutExerciseSet } from '../db/models'
import texts from '../texts'

type Props = {
  set: WorkoutExerciseSet
}

export const WorkoutExerciseSetListItem: React.FC<Props> = ({ set }) => {
  return (
    <TR
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        // alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      <View style={{ flexDirection: 'row', gap: 4 }}>
        <Text style={{ fontWeight: 'bold' }}>{set.reps}</Text>
        <Text>{texts.reps}</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        <Text style={{ fontWeight: 'bold' }}>{set.weight}</Text>
        <Text>kgs</Text>
      </View>
    </TR>
  )
}
