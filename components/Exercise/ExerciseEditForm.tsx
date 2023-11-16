import { observer } from 'mobx-react-lite'
import React from 'react'
import { Text, View } from 'react-native'
import { TextInput, IconButton } from 'react-native-paper'

import { useStores } from '../../db/helpers/useStores'
import { Exercise } from '../../db/models'
import { Icon } from '../../designSystem'
import Multiselect from '../../designSystem/Multiselect'

type Props = {
  exercise: Exercise
  onUpdate: (updated: Exercise, isValid: boolean) => void
}
const ExerciseEditForm: React.FC<Props> = ({ exercise, onUpdate }) => {
  const { exerciseStore } = useStores()

  function runValidCheck(data: Exercise) {
    const nameInvalid = data.name.trim() === ''
    const weightIncrementInvalid = data.weightIncrement === 0
    const musclesInvalid = data.muscles.length === 0

    return !(nameInvalid || weightIncrementInvalid || musclesInvalid)
  }

  function onFormChange(updated: Exercise) {
    const valid = runValidCheck(updated)
    onUpdate(updated, valid)
  }
  function handleNumericChange(text: string) {
    // Remove non-numeric characters using a regular expression
    const sanitizedValue = text.replace(/[^0-9.]/g, '')
    onFormChange({
      ...exercise,
      weightIncrement: Number(sanitizedValue),
    })
  }

  function onMusclesChange(selected: string[]) {
    onFormChange({
      ...exercise,
      muscles: selected as Exercise['muscles'],
    })
  }

  function onAddMusclePress() {
    // Todo: route to muscle create
  }

  return (
    <View style={{ flex: 1, gap: 8 }}>
      <TextInput
        label="Name"
        value={exercise.name}
        onChangeText={text =>
          onFormChange({
            ...exercise,
            name: text,
          })
        }
      />
      <TextInput
        value={`${exercise.weightIncrement}`}
        keyboardType="decimal-pad"
        onChangeText={handleNumericChange}
        label="Weight Increment"
      />
      <View style={{ flexDirection: 'row' }}>
        <Multiselect
          options={exerciseStore.muscleOptions}
          selectedOptions={exercise.muscles}
          onSelect={onMusclesChange}
          containerStyle={{ flex: 1 }}
          selectText="Muscle areas"
        />
        <IconButton
          icon={() => <Icon icon="add" />}
          onPress={onAddMusclePress}
        />
      </View>
      <Text>TODO: Measurement Type</Text>
      <Text>TODO: Measurement Unit Type</Text>
    </View>
  )
}
export default observer(ExerciseEditForm)
