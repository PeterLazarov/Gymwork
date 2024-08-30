import React, { useMemo } from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'

import WorkoutExerciseSetList from './WorkoutExerciseSetList'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutStep } from 'app/db/models'
import { navigate } from 'app/navigators'
import { Card, colors } from 'designSystem'

type Props = {
  step: WorkoutStep
}

const WorkoutExerciseCard: React.FC<Props> = ({ step }) => {
  const { stateStore, recordStore } = useStores()

  const isSelected = useMemo(
    () => computed(() => stateStore.focusedStepGuid === step.guid),
    [stateStore.focusedStepGuid]
  ).get()

  function onCardPress() {
    stateStore.setOpenedStep(step.guid)
    navigate('WorkoutStep')
  }

  function onLongPress() {
    if (isSelected) {
      stateStore.removeFocusStep(step.guid)
    } else {
      stateStore.addFocusStep(step.guid)
    }
  }

  const exerciseRecords = useMemo(
    () => computed(() => recordStore.exerciseRecordsMap[step.exercise.guid]),
    [step.sets]
  ).get()

  return (
    <Card
      onPress={onCardPress}
      title={step.exercise.name}
      content={
        <WorkoutExerciseSetList
          sets={step.sets}
          exercise={step.exercise}
          records={exerciseRecords}
        />
      }
      onLongPress={onLongPress}
      delayLongPress={500}
      containerStyle={
        isSelected
          ? {
              backgroundColor: colors.primaryLight,
            }
          : undefined
      }
    />
  )
}

export default observer(WorkoutExerciseCard)
