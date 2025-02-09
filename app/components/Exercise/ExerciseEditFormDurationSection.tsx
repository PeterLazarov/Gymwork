import React from 'react'
import { View } from 'react-native'

import { ExerciseMeasurement } from 'app/db/models'
import { translate } from 'app/i18n'
import { Text, ToggleSwitch } from 'designSystem'

export type ExerciseEditFormDurationSectionProps = {
  measurementConfig: ExerciseMeasurement
  onFormChange: () => void
}

const ExerciseEditFormDurationSection: React.FC<
  ExerciseEditFormDurationSectionProps
> = ({ measurementConfig, onFormChange }) => {
  const durationMeasurement = measurementConfig.duration!

  function toggleMoreIsBetter(value: boolean) {
    durationMeasurement.setProp('moreIsBetter', value)
    onFormChange()
  }

  return (
    <>
      <Text>{translate('durationMeasurementSettings')}</Text>

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
          value={durationMeasurement.moreIsBetter}
          onValueChange={toggleMoreIsBetter}
        />
      </View>
    </>
  )
}
export default ExerciseEditFormDurationSection
