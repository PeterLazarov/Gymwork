import React, { useMemo } from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'

import WorkoutSetList from './WorkoutExerciseSetList'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutStep } from 'app/db/models'
import { Card, colors } from 'designSystem'

type Props = {
  step: WorkoutStep
}

const WorkoutExerciseCard: React.FC<Props> = ({ step }) => {
  const { stateStore, recordStore } = useStores()

  const isSelected = computed(
    () => stateStore.focusedStepGuid === step.guid
  ).get()

  function onCardPress() {
    if (isSelected) {
      stateStore.removeFocusStep()
    } else {
      stateStore.focusStep(step.guid)
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
        <WorkoutSetList
          sets={step.sets}
          records={exerciseRecords}
        />
      }
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
