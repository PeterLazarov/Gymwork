import React, { useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-paper'

import { useStores } from '../../../db/helpers/useStores'
import { WorkoutSet } from '../../../db/models'
import IncrementEditor from '../../../designSystem/IncrementEditor'
import colors from '../../../designSystem/colors'
import ExerciseType from '../../../enums/ExerciseType'
import texts from '../../../texts'

type Props = {
  selectedSet: WorkoutSet | null
  addSet: (set: Pick<WorkoutSet, 'weight' | 'reps'>) => void
  updateSet: (set: WorkoutSet) => void
  removeSet: (set: WorkoutSet) => void
}

const REP_MEASUREMENTS = [
  ExerciseType.WEIGHT,
  ExerciseType.REPS_DISTANCE,
  ExerciseType.REPS_TIME,
  ExerciseType.REPS,
]
const WEIGHT_MEASUREMENTS = [
  ExerciseType.WEIGHT,
  ExerciseType.WEIGHT_DISTANCE,
  ExerciseType.WEIGHT_TIME,
]

const WorkoutExerciseEntrySetEditPanel: React.FC<Props> = ({
  selectedSet,
  addSet,
  updateSet,
  removeSet,
}) => {
  const { stateStore } = useStores()

  const [reps, setReps] = useState(selectedSet?.reps || 0)
  const [weight, setWeight] = useState(selectedSet?.weight || 0)

  const hasReps = useMemo(
    () => REP_MEASUREMENTS.includes(stateStore.openedExercise!.measurementType),
    [stateStore.openedExercise!.measurementType]
  )

  const hasWeight = useMemo(
    () =>
      WEIGHT_MEASUREMENTS.includes(stateStore.openedExercise!.measurementType),
    [stateStore.openedExercise!.measurementType]
  )

  useEffect(() => {
    setReps(selectedSet?.reps || 0)
    setWeight(selectedSet?.weight || 0)
  }, [selectedSet])

  function saveChanges() {
    if (selectedSet) {
      updateSet({
        ...selectedSet,
        reps,
        weight,
      })
    } else {
      addSet({
        reps,
        weight,
      })
    }
  }

  return (
    <View style={{ gap: 16 }}>
      {hasReps && (
        <IncrementEditor
          text={texts.reps}
          value={reps}
          onChange={setReps}
        />
      )}

      {hasWeight && (
        <IncrementEditor
          text={texts.weight}
          value={weight}
          onChange={setWeight}
          step={stateStore.openedExercise!.weightIncrement}
        />
      )}

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button
          mode="contained"
          onPress={saveChanges}
          style={{ flex: 1 }}
          disabled={reps < 1}
        >
          {selectedSet ? texts.updateSet : texts.addSet}
        </Button>
        {selectedSet && (
          <Button
            mode="contained"
            onPress={() => removeSet(selectedSet)}
            style={{ flex: 1 }}
            buttonColor={colors.critical}
          >
            {texts.remove}
          </Button>
        )}
      </View>
    </View>
  )
}

export default WorkoutExerciseEntrySetEditPanel
