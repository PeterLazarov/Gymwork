import React from 'react'
import { Text, View } from 'react-native'

import { ExerciseMeasurement } from 'app/db/models'

import { ToggleSwitch, fontSize, useColors } from 'designSystem'
import { translate } from 'app/i18n'

type Props = {
  measurementConfig: ExerciseMeasurement
  onFormChange: () => void
}

const ExerciseEditFormDurationSection: React.FC<Props> = ({
  measurementConfig,
  onFormChange,
}) => {
  const colors = useColors()
  const durationMeasurement = measurementConfig.duration!

  function toggleMoreIsBetter(value: boolean) {
    durationMeasurement.setProp('moreIsBetter', value)
    onFormChange()
  }

  return (
    <>
      <Text style={{ fontSize: fontSize.md, color: colors.neutralText }}>
        {translate('durationMeasurementSettings')}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: fontSize.md }}>
          {translate('moreIsBetter')}
        </Text>
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
