import React, { useEffect, useState } from 'react'
import { View, TextInput } from 'react-native'
import { Button } from 'react-native-paper'

import { useStores } from '../../db/helpers/useStores'
import { WorkoutSet } from '../../db/models'
import { Divider } from '../../designSystem'
import { SubSectionLabel } from '../../designSystem/Label'
import colors from '../../designSystem/colors'
import texts from '../../texts'
import IncrementDecrementButtons from '../IncrementDecrementButtons'

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
  const { openedExercise } = useStores()

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
            setReps(isNaN(+text) ? 0 : +Math.max(+text, 0).toFixed(0))
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
        onChange={n => setWeight(Math.max(n, 0))}
        step={openedExercise!.weightIncrement}
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
