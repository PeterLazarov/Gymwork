import React, { useMemo } from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'

import WorkoutSetList from './StepSetsList'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutStep } from 'app/db/models'
import { Card, colors } from 'designSystem'
import { isAlive } from 'mobx-state-tree'

type Props = {
  step: WorkoutStep
}

const WorkoutStepCard: React.FC<Props> = ({ step }) => {
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

  const title =
    step.type === 'straightSet'
      ? step.exercise.name
      : step.exercises.map(e => e.name).join('\n')

  return (
    <Card
      onPress={onCardPress}
      title={title}
      content={
        <WorkoutSetList
          sets={step.sets}
          records={exerciseRecords}
        />
      }
      containerStyle={{
        backgroundColor: isSelected ? colors.neutral : colors.neutralLighter,
      }}
    />
  )
}

export default observer(WorkoutStepCard)
