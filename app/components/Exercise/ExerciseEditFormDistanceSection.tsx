import React from 'react'
import { View } from 'react-native'

import { ExerciseMeasurement, measurementUnits } from 'app/db/models'
import { translate } from 'app/i18n'
import { Text, Select, ToggleSwitch } from 'designSystem'

export type ExerciseEditFormDistanceSectionProps = {
  measurementConfig: ExerciseMeasurement
  onFormChange: () => void
}

type distanceUnits =
  (typeof measurementUnits.distance)[keyof typeof measurementUnits.distance]

const ExerciseEditFormDistanceSection: React.FC<
  ExerciseEditFormDistanceSectionProps
> = ({ measurementConfig, onFormChange }) => {
  const distanceMeasurement = measurementConfig.distance!
  function setUnit(unit: distanceUnits) {
    distanceMeasurement.setProp('unit', unit)
    onFormChange()
  }

  function toggleMoreIsBetter(value: boolean) {
    distanceMeasurement.setProp('moreIsBetter', value)
    onFormChange()
  }

  return (
    <>
      <Text>{translate('distanceMeasurementSettings')}</Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text>{translate('moreIsBetter')}</Text>
        <ToggleSwitch
          variant="primary"
          value={distanceMeasurement.moreIsBetter}
          onValueChange={toggleMoreIsBetter}
        />
      </View>

      <Select
        options={Object.values(measurementUnits.distance)}
        headerText={translate('unit')}
        value={distanceMeasurement.unit}
        onChange={distanceUnit => setUnit(distanceUnit as distanceUnits)}
        label={translate('unit')}
      />
    </>
  )
}
export default ExerciseEditFormDistanceSection
