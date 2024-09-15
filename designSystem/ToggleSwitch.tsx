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

  const thumbActiveColor = colors[variant]
  return (
    <Switch
      trackColor={{ false: colors.neutralDarker, true: colors.primaryLighter }}
      thumbColor={value ? thumbActiveColor : colors.primaryLighter}
      ios_backgroundColor={colors.neutralDarker}
      onValueChange={onValueChange}
      value={value}
    />
  )
}

export default ToggleSwitch
