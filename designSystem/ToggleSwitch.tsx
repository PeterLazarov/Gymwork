import { Switch } from 'react-native'

import React from 'react'
import { colors } from './tokens'

interface Props {
  value: boolean
  onValueChange: (value: boolean) => void
  variant: 'primary' | 'critical'
}
const ToggleSwitch: React.FC<Props> = ({ value, onValueChange, variant }) => {
  const thumbActiveColor = colors[variant]
  return (
    <Switch
      trackColor={{ false: colors.neutralDark, true: colors.primaryLighter }}
      thumbColor={value ? thumbActiveColor : colors.primaryLighter}
      ios_backgroundColor={colors.neutralDark}
      onValueChange={onValueChange}
      value={value}
    />
  )
}

export default ToggleSwitch
