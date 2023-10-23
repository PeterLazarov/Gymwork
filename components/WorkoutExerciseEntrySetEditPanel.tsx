import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native'

import IncrementDecrementButtons from './IncrementDecrementButtons'
import { WorkoutExerciseSet } from '../db/models'
import { ButtonContainer, ButtonText, Divider } from '../designSystem'
import { SubSectionLabel } from '../designSystem/Label'
import texts from '../texts'

type Props = {
  editedSet?: WorkoutExerciseSet
  addSet: (set: Partial<WorkoutExerciseSet>) => void
  updateSet: (set: WorkoutExerciseSet) => void
  removeSet: () => void
}

const WorkoutExerciseEntrySetEditPanel: React.FC<Props> = ({
  editedSet,
  addSet,
  updateSet,
  removeSet,
}) => {
  const [reps, setReps] = useState(editedSet?.reps || 0)
  const [weight, setWeight] = useState(editedSet?.weight || 0)

  function saveChanges() {
    if (editedSet) {
      updateSet({
        ...editedSet,
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
    <>
      <SubSectionLabel>{texts.weight}</SubSectionLabel>
      <Divider />
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

      <SubSectionLabel>{texts.weight}</SubSectionLabel>
      <Divider />
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
            {editedSet ? texts.addSet : texts.updateSet}
          </ButtonText>
        </ButtonContainer>
        {editedSet && (
          <ButtonContainer
            variant="critical"
            onPress={removeSet}
          >
            <ButtonText variant="critical">{texts.remove}</ButtonText>
          </ButtonContainer>
        )}
      </View>
    </>
  )
}

export default WorkoutExerciseEntrySetEditPanel
