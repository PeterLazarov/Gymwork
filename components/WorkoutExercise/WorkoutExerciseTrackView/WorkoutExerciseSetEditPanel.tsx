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
import DistanceType from '../../../enums/DistanceType'
import texts from '../../../texts'

type SetEditFields =
  | 'weight'
  | 'reps'
  | 'distance'
  | 'distanceUnit'
  | 'durationSecs'
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
  const { stateStore } = useStores()

  const [reps, setReps] = useState(selectedSet?.reps || 0)
  const [weight, setWeight] = useState(selectedSet?.weight || 0)
  const [distance, setDistance] = useState(selectedSet?.distance || 0)
  const [distanceUnit, setDistanceUnit] = useState(
    selectedSet?.distanceUnit || DistanceType.M
  )
  const [durationSecs, setDurationSecs] = useState(
    selectedSet?.durationSecs || 0
  )

  useEffect(() => {
    setReps(selectedSet?.reps || 0)
    setWeight(selectedSet?.weight || 0)
    setDistance(selectedSet?.distance || 0)
    setDistanceUnit(selectedSet?.distanceUnit || DistanceType.M)
    setDurationSecs(selectedSet?.durationSecs || 0)
  }, [selectedSet])

  function saveChanges() {
    if (selectedSet) {
      updateSet({
        ...selectedSet,
        reps,
        weight,
        distance,
        distanceUnit,
        durationSecs,
      })
    } else {
      addSet({
        reps,
        weight,
        distance,
        distanceUnit,
        durationSecs,
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
            onUnitChange={setDistanceUnit}
            unit={distanceUnit}
          />
        </SetEditPanelSection>
      )}

      {stateStore.openedExercise!.hasTimeMeasument && (
        <SetEditPanelSection text={texts.time}>
          <DurationInput
            valueSeconds={durationSecs}
            onUpdate={setDurationSecs}
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
