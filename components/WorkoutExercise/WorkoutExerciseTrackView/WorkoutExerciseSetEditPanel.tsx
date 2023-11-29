import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-paper'

import SetEditPanelSection from './SetEditPanelSection'
import { useStores } from '../../../db/helpers/useStores'
import { WorkoutSet } from '../../../db/models'
import DistanceEditor from '../../../designSystem/DistanceEditor'
import DurationInput from '../../../designSystem/DurationInput'
import IncrementNumericEditor from '../../../designSystem/IncrementNumericEditor'
import colors from '../../../designSystem/colors'
import texts from '../../../texts'

type SetEditFields =
  | 'weight'
  | 'reps'
  | 'distance'
  | 'distanceUnit'
  | 'durationSecs'
type WorkoutSetEditData = Pick<WorkoutSet, SetEditFields>
type Props = {
  selectedSet: WorkoutSet | null
  addSet: (set: Pick<WorkoutSet, SetEditFields>) => void
  updateSet: (set: WorkoutSet) => void
  removeSet: (set: WorkoutSet) => void
}

const WorkoutExerciseEntrySetEditPanel: React.FC<Props> = ({
  selectedSet,
  addSet,
  updateSet,
  removeSet,
}) => {
  const { stateStore, workoutStore } = useStores()

  const emptySet = workoutStore.getEmptySet()

  const [editData, setEditData] = useState<WorkoutSetEditData>({
    ...emptySet,
  })

  useEffect(() => {
    setEditData({ ...(selectedSet ?? emptySet) })
  }, [selectedSet])

  function saveChanges() {
    if (selectedSet) {
      updateSet({
        ...selectedSet,
        ...editData,
      })
    } else {
      addSet(editData)
    }
  }

  return (
    <View style={{ gap: 16 }}>
      {stateStore.openedExercise!.hasRepMeasument && (
        <SetEditPanelSection text={texts.reps}>
          <IncrementNumericEditor
            value={editData.reps}
            onChange={reps => setEditData({ ...editData, reps })}
          />
        </SetEditPanelSection>
      )}

      {stateStore.openedExercise!.hasWeightMeasument && (
        <SetEditPanelSection text={texts.weight}>
          <IncrementNumericEditor
            value={editData.weight}
            onChange={weight => setEditData({ ...editData, weight })}
            step={stateStore.openedExercise!.weightIncrement}
          />
        </SetEditPanelSection>
      )}

      {stateStore.openedExercise!.hasDistanceMeasument && (
        <SetEditPanelSection text={texts.distance}>
          <DistanceEditor
            value={editData.distance}
            onChange={distance => setEditData({ ...editData, distance })}
            unit={editData.distanceUnit}
            onUnitChange={distanceUnit =>
              setEditData({ ...editData, distanceUnit })
            }
          />
        </SetEditPanelSection>
      )}

      {stateStore.openedExercise!.hasTimeMeasument && (
        <SetEditPanelSection text={texts.time}>
          <DurationInput
            valueSeconds={editData.durationSecs}
            onUpdate={durationSecs =>
              setEditData({ ...editData, durationSecs })
            }
          />
        </SetEditPanelSection>
      )}

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button
          mode="contained"
          onPress={saveChanges}
          style={{ flex: 1 }}
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
