import React from 'react'
import { Text, View } from 'react-native'

import { ExerciseMeasurement, measurementUnits } from 'app/db/models'

import { Select, ToggleSwitch, fontSize } from 'designSystem'
import { translate } from 'app/i18n'

type Props = {
  measurementConfig: ExerciseMeasurement
  onFormChange: () => void
}

type durationUnits =
  (typeof measurementUnits.duration)[keyof typeof measurementUnits.duration]

const ExerciseEditFormDurationSection: React.FC<Props> = ({
  measurementConfig,
  onFormChange,
}) => {
  const durationMeasurement = measurementConfig.duration!
  function setUnit(unit: durationUnits) {
    durationMeasurement.setProp('unit', unit)
    onFormChange()
  }

  function toggleMoreIsBetter(value: boolean) {
    durationMeasurement.setProp('moreIsBetter', value)
    onFormChange()
  }

  return (
    <>
      <Text style={{ fontSize: fontSize.md }}>
        {translate('durationMeasurementSettings')}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: fontSize.md }}>More is better</Text>
        <ToggleSwitch
          variant="primary"
          value={durationMeasurement.moreIsBetter}
          onValueChange={toggleMoreIsBetter}
        />
      </View>

      <Select
        options={Object.values(measurementUnits.duration)}
        headerText={translate('unit')}
        value={durationMeasurement.unit}
        onChange={distanceUnit => setUnit(distanceUnit as durationUnits)}
        label={translate('unit')}
      />
    </>
  )
}
export default ExerciseEditFormDurationSection
