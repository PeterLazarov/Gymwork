import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { TextInput, IconButton, HelperText } from 'react-native-paper'

import { useStores } from '../../db/helpers/useStores'
import { Exercise } from '../../db/models'
import { Icon } from '../../designSystem'
import Dropdown from '../../designSystem/Dropdown'
import Multiselect from '../../designSystem/Multiselect'
import ExerciseType from '../../enums/ExerciseType'

type Props = {
  exercise: Exercise
  onUpdate: (updated: Exercise, isValid: boolean) => void
}
const ExerciseEditForm: React.FC<Props> = ({ exercise, onUpdate }) => {
  const { exerciseStore } = useStores()

  const [nameError, setNameError] = useState('')
  const [weightIncError, setWeightIncError] = useState('')
  const [musclesError, setMusclesError] = useState('')

  function runValidCheck(data: Exercise) {
    const nameInvalid = data.name.trim() === ''
    const weightIncrementInvalid = data.weightIncrement === 0
    const musclesInvalid = data.muscles.length === 0

    setNameError(nameInvalid ? 'Exercise name cannot be empty.' : '')
    setWeightIncError(
      weightIncrementInvalid ? 'Weight increment cannot be 0.' : ''
    )
    setMusclesError(musclesInvalid ? 'At least one muscle area required.' : '')

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
  function onExerciseChange(measurementType: string) {
    onFormChange({
      ...exercise,
      measurementType,
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
        error={nameError !== ''}
      />
      {nameError !== '' && (
        <HelperText
          type="error"
          visible={nameError !== ''}
        >
          {nameError}
        </HelperText>
      )}
      <TextInput
        value={`${exercise.weightIncrement}`}
        keyboardType="decimal-pad"
        onChangeText={handleNumericChange}
        label="Weight Increment"
        error={weightIncError !== ''}
      />
      {weightIncError !== '' && (
        <HelperText
          type="error"
          visible={weightIncError !== ''}
        >
          {weightIncError}
        </HelperText>
      )}
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
      {musclesError !== '' && (
        <HelperText
          type="error"
          visible={musclesError !== ''}
        >
          {musclesError}
        </HelperText>
      )}
      <Dropdown
        options={Object.values(ExerciseType)}
        selectedOption={exercise.measurementType}
        onSelect={onExerciseChange}
      />
      <Text>TODO: Measurement Unit Type</Text>
    </View>
  )
}
export default observer(ExerciseEditForm)
