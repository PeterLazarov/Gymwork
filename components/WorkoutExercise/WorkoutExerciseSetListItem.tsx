import { observer } from 'mobx-react-lite'
import React from 'react'
import { Text, View } from 'react-native'

import { useStores } from '../../db/helpers/useStores'
import { WorkoutExercise, WorkoutSet } from '../../db/models'
import { Icon } from '../../designSystem'
import colors from '../../designSystem/colors'
import texts from '../../texts'

type Props = {
  set: WorkoutSet
  number?: number
  exercise?: WorkoutExercise
  isFocused?: boolean
  hideRecords?: boolean
}

const WorkoutExerciseSetListItem: React.FC<Props> = ({
  set,
  exercise,
  isFocused,
  number,
  hideRecords = false,
}) => {
  const { workoutStore } = useStores()

  const exerciseToUse = exercise || workoutStore.openedExercise
  const exerciseActualRecords =
    workoutStore.exerciseRecords[exerciseToUse.exercise.guid]

  const isRecord = Object.values(exerciseActualRecords).some(
    record => record.guid === set.guid
  )
  const color = isFocused ? colors.primary : colors.secondaryText
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 24,
      }}
    >
      {!hideRecords && (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          {!set.isWarmup && (
            <Text
              style={{ color, fontWeight: 'bold', fontSize: 15, marginLeft: 8 }}
            >
              {number}.{' '}
            </Text>
          )}
          {set.isWarmup && <Icon icon="yoga" />}
          {isRecord && (
            <Icon
              icon="trophy"
              color={colors.primary}
            />
          )}
        </View>
      )}
      <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
        <Text
          style={{
            fontWeight: 'bold',
            color,
          }}
        >
          {set.reps}
        </Text>
        <Text
          style={{
            color,
          }}
        >
          {texts.reps}
        </Text>
      </View>
      <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
        <Text
          style={{
            fontWeight: 'bold',
            color,
          }}
        >
          {set.weight}
        </Text>
        <Text
          style={{
            color,
          }}
        >
          kgs
        </Text>
      </View>
    </View>
  )
}

export default observer(WorkoutExerciseSetListItem)
