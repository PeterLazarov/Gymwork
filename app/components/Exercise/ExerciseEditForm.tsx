import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import React, { useMemo, useState } from 'react'
import { Text, View } from 'react-native'
import { TextInput, HelperText } from 'react-native-paper'

import { useStores } from 'app/db/helpers/useStores'
import {
  Exercise,
  ExerciseModel,
  ExerciseSnapshotIn,
  measurementDefaults,
  measurementName,
  measurementTypes,
  measurementUnits,
} from 'app/db/models'

import { Icon, Multiselect, IconButton, Select } from 'designSystem'
import { translate } from 'app/i18n'
import NumberInput from '../NumberInput'

type Props = {
  exercise: Exercise
  onUpdate: (updated: Exercise, isValid: boolean) => void
}

type distanceUnits =
  (typeof measurementUnits.distance)[keyof typeof measurementUnits.distance]
type weightUnits =
  (typeof measurementUnits.weight)[keyof typeof measurementUnits.weight]

// TODO? Exercise measurement types should only be additive
// Otherwise they're destructive?

const ExerciseEditForm: React.FC<Props> = ({ exercise, onUpdate }) => {
  const { exerciseStore } = useStores()

  const edittedExercise = useMemo(() => {
    return ExerciseModel.create(getSnapshot(exercise))
  }, [exercise])

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

  function onFormChange() {
    const valid = runValidCheck(edittedExercise)
    onUpdate(edittedExercise, valid)
  }

  function handleWeightIncrementChange(n: number) {
    edittedExercise.measurements.setProp('weight', {
      ...exercise.measurements.weight!,
      step: n,
    })
    onFormChange()
  }

  function onMusclesChange(selected: string[]) {
    edittedExercise.setProp('muscles', selected as Exercise['muscles'])
    onFormChange()
  }
  function onPropChange(
    field: keyof ExerciseSnapshotIn,
    measurementType: string
  ) {
    edittedExercise.setProp(field, measurementType)
    onFormChange()
  }

  function onAddMusclePress() {
    // Todo: route to muscle create
  }

  function setMeasurementTypes(measurementNames: measurementName[]) {
    edittedExercise.setProp(
      'measurements',
      Object.fromEntries(measurementNames.map(m => [m, measurementDefaults[m]]))
    )

    onFormChange()
  }

  function setDistanceType(unit: distanceUnits) {
    edittedExercise.measurements.setProp('distance', {
      ...edittedExercise.measurements.distance!,
      unit,
    })
    onFormChange()
  }

  function setWeightType(unit: weightUnits) {
    edittedExercise.measurements.setProp('weight', {
      ...edittedExercise.measurements.weight!,
      unit,
    })
    onFormChange()
  }

  // TODO set time type / set weight type?

  return (
    <View style={{ flex: 1, gap: 8, padding: 8 }}>
      <TextInput
        label="Name"
        value={edittedExercise.name}
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
          selectedValues={edittedExercise.muscles}
          onSelect={onMusclesChange}
          containerStyle={{ flex: 1 }}
          headerText={translate('muscleAreas')}
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
        selectedValues={edittedExercise.measurementNames}
        headerText="Measurements"
        onSelect={selection => {
          setMeasurementTypes(selection as measurementName[])
        }}
        error={!!measurementTypeRrror}
      />
      {edittedExercise.hasDistanceMeasument && (
        <>
          <Text>{translate('distanceMeasurementSettings')}</Text>

          <Select
            options={Object.values(measurementUnits.distance)}
            headerText={translate('unit')}
            value={edittedExercise.measurements.distance?.unit}
            onChange={distanceUnit =>
              setDistanceType(distanceUnit as distanceUnits)
            }
            label={translate('unit')}
          />
        </>
      )}
      {edittedExercise.hasWeightMeasument && (
        <>
          <Text>{translate('weightMeasurementSettings')}</Text>
          <Select
            options={Object.values(measurementUnits.weight)}
            headerText={translate('unit')}
            value={edittedExercise.measurements.weight?.unit}
            onChange={unit => setWeightType(unit as weightUnits)}
            label={translate('unit')}
          />
          <NumberInput
            value={edittedExercise.measurements.weight?.step ?? 0}
            onChange={handleWeightIncrementChange}
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
