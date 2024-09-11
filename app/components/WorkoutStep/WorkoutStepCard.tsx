import React from 'react'
import { observer } from 'mobx-react-lite'

import StepSetsList from './StepSetsList'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutStep } from 'app/db/models'
import { Card } from 'designSystem'
import { navigate } from 'app/navigators'

type Props = {
  step: WorkoutStep
}

const WorkoutStepCard: React.FC<Props> = ({ step }) => {
  const { stateStore } = useStores()

  function onCardPress() {
    stateStore.setFocusedStep(step.guid)
    navigate('WorkoutStep')
  }

  const title =
    step.type === 'straightSet'
      ? step.exercise!.name
      : step.exercises
          .map(e => `${step.exerciseLettering[e.guid]}. ${e.name}`)
          .join('\n')

  return (
    <Card
      onPress={onCardPress}
      title={title}
      content={<StepSetsList step={step} />}
    />
  )
}

export default observer(WorkoutStepCard)
