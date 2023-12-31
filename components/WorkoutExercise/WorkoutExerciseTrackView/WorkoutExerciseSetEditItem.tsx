import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'

import WorkoutExerciseSetWarmupButton from './WorkoutExerciseSetWarmupButton'
import { useStores } from '../../../db/helpers/useStores'
import { WorkoutSet } from '../../../db/models'
import { ButtonContainer, Icon } from '../../../designSystem'
import colors from '../../../designSystem/colors'
import texts from '../../../texts'
import { getFormatedDuration } from '../../../utils/time'
import SetDataLabel from '../SetDataLabel'

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
  const { workoutStore, openedExerciseRecords, stateStore } = useStores()
  const isRecord = Object.values(openedExerciseRecords).some(
    record => record.guid === set.guid
  )
  const color = isFocused ? colors.primary : colors.secondaryText

  function calcWorkSetNumber() {
    const workArrayIndex = stateStore.openedExerciseWorkSets.indexOf(set)
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
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 48,
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
      {stateStore.openedExercise!.hasRepMeasument && (
        <SetDataLabel
          value={set.reps}
          unit={texts.reps}
          isFocused={isFocused}
        />
      )}
      {stateStore.openedExercise!.hasWeightMeasument && (
        <SetDataLabel
          value={set.weight}
          unit="kg"
          isFocused={isFocused}
        />
      )}
      {stateStore.openedExercise!.hasDistanceMeasument && (
        <SetDataLabel
          value={set.distance}
          unit={set.distanceUnit}
          isFocused={isFocused}
        />
      )}
      {stateStore.openedExercise!.hasTimeMeasument && (
        <SetDataLabel
          value={getFormatedDuration(set.durationSecs)}
          isFocused={isFocused}
        />
      )}
    </ButtonContainer>
  )
}

export default observer(WorkoutExerciseSetEditItem)
