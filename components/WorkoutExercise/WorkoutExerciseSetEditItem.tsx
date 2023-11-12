import { observer } from 'mobx-react-lite'
import React from 'react'
import { Text, View } from 'react-native'

import { useStores } from '../../db/helpers/useStores'
import { WorkoutSet } from '../../db/models'
import { Icon } from '../../designSystem'
import colors from '../../designSystem/colors'
import texts from '../../texts'

type Props = {
  set: WorkoutSet
  isFocused?: boolean
}

const WorkoutExerciseSetEditItem: React.FC<Props> = ({ set, isFocused }) => {
  const { workoutStore } = useStores()
  const isRecord = workoutStore.openedExerciseActualRecords.some(
    record => record.guid === set.guid
  )

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
      <View>
        {isRecord && (
          <Icon
            icon="trophy"
            color={colors.primary}
          />
        )}
      </View>
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

export default observer(WorkoutExerciseSetEditItem)
