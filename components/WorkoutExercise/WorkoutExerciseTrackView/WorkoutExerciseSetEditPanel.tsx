import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-paper'

import SetEditPanelSection from './SetEditPanelSection'
import { useStores } from '../../../db/helpers/useStores'
import { WorkoutSet } from '../../../db/models'
import DistanceEditor from '../../../designSystem/DistanceEditor'
import IncrementNumericEditor from '../../../designSystem/IncrementNumericEditor'
import colors from '../../../designSystem/colors'
import texts from '../../../texts'

type Props = {
  selectedSet: WorkoutSet | null
  addSet: (set: Pick<WorkoutSet, 'weight' | 'reps'>) => void
  updateSet: (set: WorkoutSet) => void
  removeSet: (set: WorkoutSet) => void
}

const WorkoutExerciseEntrySetEditPanel: React.FC<Props> = ({
  selectedSet,
  addSet,
  updateSet,
  removeSet,
}) => {
  const { stateStore } = useStores()

  const [reps, setReps] = useState(selectedSet?.reps || 0)
  const [weight, setWeight] = useState(selectedSet?.weight || 0)
  const [distance, setDistance] = useState(selectedSet?.distance || 0)

  useEffect(() => {
    setReps(selectedSet?.reps || 0)
    setWeight(selectedSet?.weight || 0)
    setDistance(selectedSet?.distance || 0)
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
      {stateStore.openedExercise!.hasRepMeasument && (
        <SetEditPanelSection text={texts.reps}>
          <IncrementNumericEditor
            value={reps}
            onChange={setReps}
          />
        </SetEditPanelSection>
      )}

      {stateStore.openedExercise!.hasWeightMeasument && (
        <SetEditPanelSection text={texts.weight}>
          <IncrementNumericEditor
            value={weight}
            onChange={setWeight}
            step={stateStore.openedExercise!.weightIncrement}
          />
        </SetEditPanelSection>
      )}

      {stateStore.openedExercise!.hasDistanceMeasument && (
        <SetEditPanelSection text={texts.distance}>
          <DistanceEditor
            value={distance}
            onChange={setDistance}
            unit="m"
          />
        </SetEditPanelSection>
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
