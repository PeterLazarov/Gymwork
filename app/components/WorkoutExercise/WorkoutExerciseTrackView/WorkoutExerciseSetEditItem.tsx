import { observer } from 'mobx-react-lite'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { useStores } from 'app/db/helpers/useStores'
import { WorkoutSet } from 'app/db/models'
import { translate } from 'app/i18n'
import { colors, Icon } from 'designSystem'
import { getFormatedDuration } from 'app/utils/time'
import WorkoutExerciseSetWarmupButton from './WorkoutExerciseSetWarmupButton'
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
    <TouchableOpacity
      onPress={onPress}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        paddingVertical: 1,
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
          unit={translate('reps')}
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
    </TouchableOpacity>
  )
}

export default observer(WorkoutExerciseSetEditItem)