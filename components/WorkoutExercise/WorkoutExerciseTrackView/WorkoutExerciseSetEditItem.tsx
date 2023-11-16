import { observer } from 'mobx-react-lite'
import React from 'react'
import { Text, View } from 'react-native'

import WorkoutExerciseSetWarmupButton from './WorkoutExerciseSetWarmupButton'
import { useStores } from '../../../db/helpers/useStores'
import { WorkoutSet } from '../../../db/models'
import { ButtonContainer, Icon } from '../../../designSystem'
import colors from '../../../designSystem/colors'
import texts from '../../../texts'

type Props = {
  set: WorkoutSet
  isFocused?: boolean
  onPress: () => void
}

const WorkoutExerciseSetEditItem: React.FC<Props> = ({
  set,
  isFocused,
  onPress,
}) => {
  const { workoutStore } = useStores()
  const isRecord = Object.values(workoutStore.openedExerciseRecords).some(
    record => record.guid === set.guid
  )
  const color = isFocused ? colors.primary : colors.secondaryText

  function calcWorkSetNumber() {
    const workArrayIndex = workoutStore.openedExerciseWorkSets.indexOf(set)
    return workArrayIndex + 1
  }

  const number = set.isWarmup ? undefined : calcWorkSetNumber()

  function toggleSetWarmup() {
    workoutStore.setWorkoutSetWarmup(set, !set.isWarmup)
  }

  return (
    <ButtonContainer
      variant="tertiary"
      onPress={onPress}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 16,
          alignItems: 'center',
          justifyContent: 'space-around',
          height: 24,
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <WorkoutExerciseSetWarmupButton
            isWarmup={set.isWarmup}
            toggleSetWarmup={toggleSetWarmup}
            number={number}
            color={color}
          />
          {isRecord && (
            <Icon
              icon="trophy"
              color={colors.primary}
            />
          )}
        </View>
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
            kg
          </Text>
        </View>
      </View>
    </ButtonContainer>
  )
}

export default observer(WorkoutExerciseSetEditItem)
