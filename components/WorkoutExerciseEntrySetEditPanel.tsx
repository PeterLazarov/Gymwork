import React, { useEffect, useState } from 'react'
import { View, TextInput } from 'react-native'

import IncrementDecrementButtons from './IncrementDecrementButtons'
import { WorkoutExerciseSet } from '../db/models'
import { ButtonContainer, ButtonText, Divider } from '../designSystem'
import { SubSectionLabel } from '../designSystem/Label'
import texts from '../texts'

type Props = {
  selectedSet: WorkoutExerciseSet | null
  addSet: (set: Partial<WorkoutExerciseSet>) => void
  updateSet: (set: WorkoutExerciseSet) => void
  removeSet: () => void
}

const WorkoutExerciseEntrySetEditPanel: React.FC<Props> = ({
  selectedSet,
  addSet,
  updateSet,
  removeSet,
}) => {
  const [reps, setReps] = useState(selectedSet?.reps || 0)
  const [weight, setWeight] = useState(selectedSet?.weight || 0)

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
      <View>
        <SubSectionLabel style={{ textTransform: 'uppercase' }}>
          {texts.reps}
        </SubSectionLabel>
        <Divider />
      </View>
      <IncrementDecrementButtons
        value={reps}
        onChange={n => setReps(Math.max(n, 0))}
      >
        <TextInput
          style={{ flexGrow: 1, textAlign: 'center' }}
          inputMode="numeric"
          multiline={false}
          keyboardType="number-pad"
          onChangeText={text => {
            setWeight(isNaN(+text) ? 0 : +Math.max(+text, 0).toFixed(0))
          }}
          maxLength={3}
        >
          {reps}
        </TextInput>
      </IncrementDecrementButtons>

      <View>
        <SubSectionLabel style={{ textTransform: 'uppercase' }}>
          {texts.weight}
        </SubSectionLabel>
        <Divider />
      </View>
      <IncrementDecrementButtons
        value={weight}
        onChange={n => setReps(Math.max(n, 0))}
      >
        <TextInput
          style={{ flexGrow: 1, textAlign: 'center' }}
          inputMode="numeric"
          multiline={false}
          keyboardType="number-pad"
          onChangeText={text => {
            setWeight(isNaN(+text) ? 0 : +Math.max(+text, 0).toFixed(0))
          }}
          maxLength={3}
        >
          {weight}
        </TextInput>
      </IncrementDecrementButtons>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <ButtonContainer
          variant="primary"
          onPress={saveChanges}
        >
          <ButtonText variant="primary">
            {selectedSet ? texts.updateSet : texts.addSet}
          </ButtonText>
        </ButtonContainer>
        {selectedSet && (
          <ButtonContainer
            variant="critical"
            onPress={removeSet}
          >
            <ButtonText variant="critical">{texts.remove}</ButtonText>
          </ButtonContainer>
        )}
      </View>
    </View>
  )
}

export default WorkoutExerciseEntrySetEditPanel
