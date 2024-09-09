import React, { useMemo } from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'

import StepSetsList from './StepSetsList'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutStep } from 'app/db/models'
import { Card, colors } from 'designSystem'
import { isAlive } from 'mobx-state-tree'
import { navigate } from 'app/navigators'

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
    navigate('WorkoutStep')
  }

  const exerciseRecords = useMemo(
    () => computed(() => recordStore.exerciseRecordsMap[step.exercise.guid]),
    [step.sets]
  ).get()

  const title =
    step.type === 'straightSet'
      ? step.exercise.name
      : step.exercises
          .map(e => `${step.exerciseLettering[e.guid]}. ${e.name}`)
          .join('\n')

  return (
    <Card
      onPress={onCardPress}
      title={title}
      content={
        <StepSetsList
          step={step}
          records={exerciseRecords}
        />
      }
      containerStyle={{
        backgroundColor: isSelected ? colors.neutral : colors.neutralLightest,
      }}
    />
  )
}

export default observer(WorkoutStepCard)
