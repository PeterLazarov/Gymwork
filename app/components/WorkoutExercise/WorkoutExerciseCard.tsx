import React, { useMemo } from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'

import WorkoutExerciseSetList from './WorkoutExerciseSetList'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutStep } from 'app/db/models'
import { navigate } from 'app/navigators'
import { Card } from 'designSystem'

type Props = {
  step: WorkoutStep
}

const WorkoutExerciseCard: React.FC<Props> = ({ step }) => {
  const { stateStore, recordStore } = useStores()

  function onLinkPress() {
    stateStore.setOpenedStep(step.guid)
    navigate('WorkoutExercise')
  }

  const exerciseRecords = useMemo(
    () => computed(() => recordStore.getExerciseRecords(step.exercise.guid)),
    [step.sets]
  ).get()

  return (
    <Card
      onPress={onLinkPress}
      title={step.exercise.name}
      content={
        <WorkoutExerciseSetList
          sets={step.sets}
          exercise={step.exercise}
          records={exerciseRecords}
        />
      }
    />
  )
}

export default observer(WorkoutExerciseCard)
