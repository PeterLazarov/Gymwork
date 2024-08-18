import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { TextInput, HelperText } from 'react-native-paper'

import { useStores } from 'app/db/helpers/useStores'
import {
  Exercise,
  ExerciseSnapshotIn,
  measurementDefaults,
  measurementName,
  measurementTypes,
  measurementUnits,
} from 'app/db/models'

import { Icon, Multiselect, IconButton, Select } from 'designSystem'

type Props = {
  exercise: Exercise
  onUpdate: (updated: Exercise, isValid: boolean) => void
}
// TODO? Exercise measurement types should only be additive
// Otherwise they're destructive?
const ExerciseEditForm: React.FC<Props> = ({ exercise, onUpdate }) => {
  const { exerciseStore } = useStores()

  const [nameError, setNameError] = useState('')
  const [weightIncError, setWeightIncError] = useState('')
  const [musclesError, setMusclesError] = useState('')
  const [measurementTypeRrror, setMeasurementTypeRrror] = useState('')

  function runValidCheck(data: Exercise) {
    const nameInvalid = data.name.trim() === ''
    const weightIncrementInvalid = data.measurements.weight?.step === 0
    const musclesInvalid = data.muscles.length === 0
    const measurementsInvalid = data.measurementNames.length === 0

    setNameError(nameInvalid ? 'Exercise name cannot be empty.' : '')
    setWeightIncError(
      weightIncrementInvalid ? 'Weight increment cannot be 0.' : ''
    )
    setMusclesError(musclesInvalid ? 'At least one muscle area required.' : '')
    setMeasurementTypeRrror(
      measurementsInvalid ? 'At least one measurement type required.' : ''
    )

    return !(nameInvalid || weightIncrementInvalid || musclesInvalid)
  }

  function onFormChange(updated: Exercise) {
    const valid = runValidCheck(updated)
    onUpdate(updated, valid)
  }

  function handleWeightIncrementChange(text: string) {
    // Remove non-numeric characters using a regular expression
    const sanitizedValue = text.replace(/[^0-9.]/g, '')

    exercise.setProp('measurements', {
      ...exercise.measurements,
      weight: {
        ...exercise.measurements.weight!,
        step: +sanitizedValue,
      },
    })
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

  function setMeasurementTypes(measurementNames: measurementName[]) {
    exercise.setProp(
      'measurements',
      Object.fromEntries(measurementNames.map(m => [m, measurementDefaults[m]]))
    )

    onFormChange(exercise)
  }

  function setDistanceType(unit: string) {
    exercise.setProp('measurements', {
      ...exercise.measurements,
      distance: {
        ...exercise.measurements.distance!,
        unit,
      },
    })
    onFormChange(exercise)
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
          headerText="Muscle areas"
          error={musclesError !== ''}
        />
        <IconButton
          onPress={onAddMusclePress}
          style={{ margin: 4 }}
        >
          <Icon icon="add" />
        </IconButton>
      </View>
      {musclesError !== '' && (
        <HelperText
          type="error"
          visible={musclesError !== ''}
        >
          {musclesError}
        </HelperText>
      )}
      <Multiselect
        options={measurementTypes}
        selectedValues={exercise.measurementNames}
        headerText="Measurements"
        onSelect={selection => {
          setMeasurementTypes(selection as measurementName[])
        }}
        error={!!measurementTypeRrror}
      />
      <Text>TODO: Imperial / Metric Unit Type</Text>
      {exercise.hasDistanceMeasument && (
        <Select
          options={Object.values(measurementUnits.distance)}
          value={exercise.measurements.distance?.unit}
          onChange={distanceUnit => setDistanceType(distanceUnit)}
        />
      )}
      {exercise.hasWeightMeasument && (
        <>
          <TextInput
            value={`${exercise.measurements.weight?.step}`}
            keyboardType="decimal-pad"
            onChangeText={handleWeightIncrementChange}
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
