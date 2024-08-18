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
import manageInputFocus from 'app/utils/inputFocus'

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

  // TODO add more input options
  const input1 = useRef<TextInput>(null)
  const input2 = useRef<TextInput>(null)
  const input3 = useRef<TextInput>(null)
  const input4 = useRef<TextInput>(null)
  const inputRefs = [input1, input2, input3, input4]
  const { onHandleSubmit, isLastInput } = manageInputFocus(inputRefs, () =>
    addSet(editData)
  )

  return (
    <>
      <View style={{ gap: 16, padding: 16 }}>
        {stateStore.openedExercise?.hasRepMeasument && (
          <SetEditPanelSection text={translate('reps')}>
            <IncrementNumericEditor
              value={editData.reps}
              onChange={reps => setEditData({ ...editData, reps })}
              onSubmit={() => onHandleSubmit(input1)}
              ref={input1}
              returnKeyType={isLastInput(input1) ? 'default' : 'next'}
            />
          </SetEditPanelSection>
        )}

        {stateStore.openedExercise!.hasWeightMeasument && (
          <SetEditPanelSection text={translate('weight')}>
            <IncrementNumericEditor
              value={editData.weight}
              onChange={weight => setEditData({ ...editData, weight })}
              step={stateStore.openedExercise!.weightIncrement}
              onSubmit={() => onHandleSubmit(input2)}
              ref={input2}
              returnKeyType={isLastInput(input2) ? 'default' : 'next'}
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
              onSubmitEditing={() => onHandleSubmit(input3)}
              ref={input3}
              returnKeyType={isLastInput(input3) ? 'default' : 'next'}
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
              onSubmitEditing={() => onHandleSubmit(input4)}
              ref={input4}
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
