import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import React, { useMemo, useState } from 'react'
import { View } from 'react-native'
import { TextInput, HelperText } from 'react-native-paper'

import { useStores } from 'app/db/helpers/useStores'
import {
  Exercise,
  ExerciseModel,
  ExerciseSnapshotIn,
  measurementDefaults,
  measurementName,
  measurementTypes,
} from 'app/db/models'

import { Icon, Multiselect, IconButton, spacing } from 'designSystem'
import { translate } from 'app/i18n'
import ExerciseEditFormDistanceSection from './ExerciseEditFormDistanceSection'
import ExerciseEditFormWeightSection from './ExerciseEditFormWeightSection'
import ExerciseEditFormDurationSection from './ExerciseEditFormDurationSection'

type Props = {
  exercise: Exercise
  onUpdate: (updated: Exercise, isValid: boolean) => void
}

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

    return !(
      nameInvalid ||
      weightIncrementInvalid ||
      musclesInvalid ||
      measurementsInvalid
    )
  }

  function onFormChange() {
    const valid = runValidCheck(edittedExercise)
    onUpdate(edittedExercise, valid)
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
          style={{ margin: spacing.xxs }}
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
        selectedValues={edittedExercise.measurementNames as string[]}
        headerText="Measurements"
        onSelect={selection => {
          setMeasurementTypes(selection as measurementName[])
        }}
        error={!!measurementTypeRrror}
      />
      {edittedExercise.measurements.distance && (
        <ExerciseEditFormDistanceSection
          measurementConfig={edittedExercise.measurements}
          onFormChange={onFormChange}
        />
      )}
      {edittedExercise.measurements.weight && (
        <ExerciseEditFormWeightSection
          measurementConfig={edittedExercise.measurements}
          onFormChange={onFormChange}
          weightIncError={weightIncError}
        />
      )}
      {edittedExercise.measurements.duration && (
        <ExerciseEditFormDurationSection
          measurementConfig={edittedExercise.measurements}
          onFormChange={onFormChange}
        />
      )}
    </View>
  )
}
export default observer(ExerciseEditForm)
