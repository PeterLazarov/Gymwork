import { observer } from 'mobx-react-lite'
import React from 'react'

import { Text, Icon, useColors, fontSize, IconProps } from 'designSystem'
import { TouchableOpacity } from 'react-native'
import { spacing } from 'designSystem/tokens/spacing'

export type SetEditItemButtonProps = {
  icon?: IconProps['icon']
  symbol?: string
  color: string
  onPress: () => void
  disabled?: boolean
}
const SetEditItemButton: React.FC<SetEditItemButtonProps> = ({
  icon,
  symbol,
  color,
  onPress,
  disabled,
}) => {
  const colors = useColors()

  return (
    <TouchableOpacity
      style={{
        height: 36,
        width: 36,
        borderColor: colors.outline,
        borderWidth: 1,
        borderRadius: spacing.xxs,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
    >
      <>
        {icon ? (
          <Icon
            icon={icon}
            color={color}
          />
        ) : (
          <Text
            style={{
              fontSize: fontSize.sm,
              color,
              fontWeight: 'bold',
            }}
          >
            {symbol}
          </Text>
        )}
      </>
    </TouchableOpacity>
  )
}
export default observer(SetEditItemButton)