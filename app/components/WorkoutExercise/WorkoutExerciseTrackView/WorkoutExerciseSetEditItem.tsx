import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import { View } from 'react-native'

import { useStores } from 'app/db/helpers/useStores'
import { ExerciseRecord, WorkoutSet } from 'app/db/models'
import { translate } from 'app/i18n'
import { isCurrentRecord } from 'app/services/workoutRecordsCalculator'
import { getFormatedDuration } from 'app/utils/time'
import { colors, Icon } from 'designSystem'
import SetWarmupButton from './SetWarmupButton'
import SetDataLabel from '../SetDataLabel'

type Props = {
  set: WorkoutSet
  openedExerciseRecords: ExerciseRecord
  isFocused?: boolean
}

const WorkoutExerciseSetEditItem: React.FC<Props> = ({
  set,
  openedExerciseRecords,
  isFocused,
}) => {
  const { workoutStore, stateStore } = useStores()
  const isRecord = useMemo(
    () => computed(() => isCurrentRecord(openedExerciseRecords, set)),
    [openedExerciseRecords, set]
  ).get()
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
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        paddingVertical: 1,
        backgroundColor: isFocused ? colors.primaryLighter : undefined,
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          flexDirection: 'row',
          paddingVertical: 4,
          gap: 4,
        }}
      >
        <SetWarmupButton
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
          unit={set.exercise.measurements.weight!.unit}
          isFocused={isFocused}
        />
      )}
      {stateStore.openedExercise!.hasDistanceMeasument && (
        <SetDataLabel
          value={set.distance}
          unit={set.exercise.measurements.distance!.unit}
          isFocused={isFocused}
        />
      )}
      {stateStore.openedExercise!.hasTimeMeasument && (
        <SetDataLabel
          value={getFormatedDuration(set.duration)}
          isFocused={isFocused}
        />
      )}
      {stateStore.openedExercise!.measurements.rest && (
        <SetDataLabel
          value={`${translate('rest')} ${getFormatedDuration(
            set.rest ?? 0,
            true
          )}`}
          isFocused={isFocused}
        />
      )}
    </View>
  )
}

export default observer(WorkoutExerciseSetEditItem)
