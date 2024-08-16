import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { TextInput, IconButton, HelperText } from 'react-native-paper'

import { useStores } from 'app/db/helpers/useStores'
import { Exercise, ExerciseSnapshotIn } from 'app/db/models'
import DistanceType from 'app/enums/DistanceType'
import ExerciseType from 'app/enums/ExerciseType'
import { Icon, Multiselect, Select } from 'designSystem'

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
    exercise.setProp('weightIncrement', Number(sanitizedValue))
    onFormChange(exercise)
  }

  function onMusclesChange(selected: string[]) {
    exercise.setProp('muscles', selected as Exercise['muscles'])
    onFormChange(exercise)
  }
  function onPropChange(
    field: keyof ExerciseSnapshotIn,
    measurementType: string
  ) {
    exercise.setProp(field, measurementType)
    onFormChange(exercise)
  }

  function onAddMusclePress() {
    // Todo: route to muscle create
  }

  return (
    <View style={{ flex: 1, gap: 8, padding: 8 }}>
      <TextInput
        label="Name"
        value={exercise.name}
        onChangeText={text => onPropChange('name', text)}
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
      <View style={{ flexDirection: 'row' }}>
        <Multiselect
          options={exerciseStore.muscleOptions}
          selectedValues={exercise.muscles}
          onSelect={onMusclesChange}
          containerStyle={{ flex: 1 }}
          selectText="Muscle areas"
          error={musclesError !== ''}
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
      <Select
        options={Object.values(ExerciseType)}
        value={exercise.measurementType}
        onChange={type => onPropChange('measurementType', type)}
      />
      <Text>TODO: Imperial / Metric Unit Type</Text>
      {exercise.hasDistanceMeasument && (
        <Select
          options={Object.values(DistanceType)}
          value={exercise.distanceUnit}
          onChange={distanceUnit => onPropChange('distanceUnit', distanceUnit)}
        />
      )}
      {exercise.hasWeightMeasument && (
        <>
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
        </>
      )}
    </View>
  )
}
export default observer(ExerciseEditForm)
