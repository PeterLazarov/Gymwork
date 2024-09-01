import React, { useMemo } from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'

import WorkoutSetList from './WorkoutExerciseSetList'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutStep } from 'app/db/models'
import { Card, colors } from 'designSystem'
import { isAlive } from 'mobx-state-tree'

type Props = {
  step: WorkoutStep
}

const WorkoutExerciseCard: React.FC<Props> = ({ step }) => {
  const { stateStore, recordStore } = useStores()

  const isSelected = computed(
    () => isAlive(step) && stateStore.focusedStepGuid === step.guid
  ).get()

  function onCardPress() {
    stateStore.setFocusedStep(isSelected ? '' : step.guid)
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
              backgroundColor: colors.secondaryLighter,
            }
          : undefined
      }
    />
  )
}

export default observer(WorkoutExerciseCard)
