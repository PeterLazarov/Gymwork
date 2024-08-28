import { Switch } from 'react-native'

import React from 'react'
import { colors } from './tokens'

interface Props {
  value: boolean
  onValueChange: (value: boolean) => void
}
const ToggleSwitch: React.FC<Props> = ({ value, onValueChange }) => {
  return (
    <Switch
      trackColor={{ false: colors.gray, true: colors.primaryLighter }}
      thumbColor={value ? colors.primary : colors.primaryLighter}
      ios_backgroundColor={colors.gray}
      onValueChange={onValueChange}
      value={value}
    />
  )
}

export default ToggleSwitch
