import React from 'react'
import { Text, View } from 'react-native'
import { HelperText } from 'react-native-paper'

import { ExerciseMeasurement, measurementUnits } from 'app/db/models'
import {
  NumberInput,
  Select,
  ToggleSwitch,
  fontSize,
  useColors,
} from 'designSystem'
import { translate } from 'app/i18n'

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
  const colors = useColors()
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
        <Text style={{ fontSize: fontSize.md, color: colors.neutralText }}>
          {translate('moreIsBetter')}
        </Text>
        <ToggleSwitch
          variant="primary"
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
