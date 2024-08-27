import React, { useMemo } from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Card } from 'react-native-paper'
import { TouchableOpacity } from 'react-native'

import WorkoutExerciseSetList from './WorkoutExerciseSetList'
import { useStores } from 'app/db/helpers/useStores'
import { Workout, WorkoutStep } from 'app/db/models'
import { navigate } from 'app/navigators'
import { colors } from 'designSystem'

type Props = {
  workout: Workout
  step: WorkoutStep
}

const WorkoutExerciseCard: React.FC<Props> = ({ workout, step }) => {
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
    <TouchableOpacity onPress={onLinkPress}>
      <Card
        style={{
          margin: 16,
          backgroundColor: colors.primaryLighter,
        }}
      >
        <Card.Title
          title={step.exercise.name}
          titleVariant="titleMedium"
          titleStyle={{ color: colors.secondaryText }}
        />
        <Card.Content>
          <WorkoutExerciseSetList
            sets={step.sets}
            exercise={step.exercise}
            records={exerciseRecords}
          />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )
}

export default observer(WorkoutExerciseCard)
