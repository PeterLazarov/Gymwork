import React from 'react'
import { Switch } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'

interface Props {
  value: boolean
  onValueChange: (value: boolean) => void
  variant: 'primary' | 'critical'
}
const ToggleSwitch: React.FC<Props> = ({ value, onValueChange, variant }) => {
  const {
    theme: { colors },
  } = useAppTheme()

  const thumbActiveColor =
    variant === 'critical' ? colors.error : colors.primary

  return (
    <Switch
      trackColor={{
        false: colors.surfaceContainerHighest,
        true: colors.surfaceContainerHigh,
      }}
      thumbColor={value ? thumbActiveColor : colors.surfaceContainer}
      ios_backgroundColor={colors.surfaceContainerHighest}
      onValueChange={onValueChange}
      value={value}
    />
  )
}

export default ToggleSwitch
