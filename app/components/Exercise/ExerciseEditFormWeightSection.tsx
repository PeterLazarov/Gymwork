import React from 'react'
import { Text, View } from 'react-native'

import { ExerciseMeasurement, measurementUnits } from 'app/db/models'

import { Select, ToggleSwitch, fontSize } from 'designSystem'
import { translate } from 'app/i18n'
import NumberInput from '../NumberInput'
import { HelperText } from 'react-native-paper'

type Props = {
  measurementConfig: ExerciseMeasurement
  onFormChange: () => void
  weightIncError?: string
}

type weightUnits =
  (typeof measurementUnits.weight)[keyof typeof measurementUnits.weight]

const ExerciseEditFormWeightSection: React.FC<Props> = ({
  measurementConfig,
  onFormChange,
  weightIncError,
}) => {
  const weightMeasurement = measurementConfig.weight!
  function setUnit(unit: weightUnits) {
    weightMeasurement.setProp('unit', unit)
    onFormChange()
  }

  function toggleMoreIsBetter(value: boolean) {
    weightMeasurement.setProp('moreIsBetter', value)
    onFormChange()
  }

  function handleWeightIncrementChange(n: number) {
    weightMeasurement.setProp('step', n)
    onFormChange()
  }

  return (
    <>
      <Text>{translate('weightMeasurementSettings')}</Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: fontSize.md }}>More is better</Text>
        <ToggleSwitch
          value={weightMeasurement.moreIsBetter}
          onValueChange={toggleMoreIsBetter}
        />
      </View>
      <Select
        options={Object.values(measurementUnits.weight)}
        headerText={translate('unit')}
        value={weightMeasurement.unit}
        onChange={unit => setUnit(unit as weightUnits)}
        label={translate('unit')}
      />
      <NumberInput
        value={weightMeasurement.step ?? 0}
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
  )
}
export default ExerciseEditFormWeightSection