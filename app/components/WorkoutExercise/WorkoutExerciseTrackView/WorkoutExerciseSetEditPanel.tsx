import React, { useEffect, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'

import SetEditPanelSection from './SetEditPanelSection'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutSet, WorkoutSetTrackData } from 'app/db/models'
import { translate } from 'app/i18n'
import {
  Button,
  DistanceEditor,
  DurationInput,
  IncrementNumericEditor,
  ButtonText,
} from 'designSystem'

type Props = {
  selectedSet: WorkoutSet | null
  addSet: (set: WorkoutSetTrackData) => void
  updateSet: (set: WorkoutSet) => void
  removeSet: (set: WorkoutSet) => void
}

const WorkoutExerciseSetEditPanel: React.FC<Props> = ({
  selectedSet,
  addSet,
  updateSet,
  removeSet,
}) => {
  const { stateStore } = useStores()

  const nextSet = stateStore.openedExerciseNextSet

  const [editData, setEditData] = useState<WorkoutSetTrackData>({
    ...nextSet,
  })

  useEffect(() => {
    setEditData({ ...(selectedSet ?? nextSet) })
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

  function onHandleSubmit(isLastInput: boolean) {
    if (isLastInput) {
      addSet(editData)
    } else {
      input2.current?.focus()
    }
  }

  const input1 = useRef<TextInput>(null)
  const input2 = useRef<TextInput>(null)

  return (
    <>
      <View style={{ gap: 16, padding: 16 }}>
        {stateStore.openedExercise?.hasRepMeasument && (
          <SetEditPanelSection text={translate('reps')}>
            <IncrementNumericEditor
              value={editData.reps}
              onChange={reps => setEditData({ ...editData, reps })}
              onSubmit={() => onHandleSubmit(false)}
              returnKeyType="next"
              ref={input1}
            />
          </SetEditPanelSection>
        )}

        {stateStore.openedExercise!.hasWeightMeasument && (
          <SetEditPanelSection text={translate('weight')}>
            <IncrementNumericEditor
              value={editData.weight}
              onChange={weight => setEditData({ ...editData, weight })}
              step={stateStore.openedExercise!.weightIncrement}
              onSubmit={() => onHandleSubmit(true)}
              ref={input2}
            />
          </SetEditPanelSection>
        )}

        {stateStore.openedExercise!.hasDistanceMeasument && (
          <SetEditPanelSection text={translate('distance')}>
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
          <SetEditPanelSection text={translate('time')}>
            <DurationInput
              valueSeconds={editData.durationSecs}
              onUpdate={durationSecs =>
                setEditData({ ...editData, durationSecs })
              }
            />
          </SetEditPanelSection>
        )}
      </View>

      <View style={{ flexDirection: 'row', gap: 4 }}>
        <Button
          variant="primary"
          onPress={saveChanges}
          style={{ flex: 1 }}
        >
          <ButtonText variant="primary">
            {selectedSet ? translate('updateSet') : translate('addSet')}
          </ButtonText>
        </Button>
        {selectedSet && (
          <Button
            variant="critical"
            onPress={() => removeSet(selectedSet)}
            style={{ flex: 1 }}
          >
            <ButtonText variant="critical">{translate('remove')}</ButtonText>
          </Button>
        )}
      </View>
    </>
  )
}

export default WorkoutExerciseSetEditPanel
