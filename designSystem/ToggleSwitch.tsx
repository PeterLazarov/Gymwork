import { Switch } from 'react-native'

import React from 'react'
import { useColors } from './tokens'

interface Props {
  value: boolean
  onValueChange: (value: boolean) => void
  variant: 'primary' | 'critical'
}
const ToggleSwitch: React.FC<Props> = ({ value, onValueChange, variant }) => {
  const colors = useColors()

  const thumbActiveColor =
    variant === 'critical' ? colors.mat.error : colors.mat.primary

  return (
    <Switch
      trackColor={{
        false: colors.mat.surfaceContainerHighest,
        true: colors.mat.surfaceContainerHigh,
      }}
      thumbColor={value ? thumbActiveColor : colors.mat.surfaceContainer}
      ios_backgroundColor={colors.mat.surfaceContainerHighest}
      onValueChange={onValueChange}
      value={value}
    />
  )
}

export default ToggleSwitch
