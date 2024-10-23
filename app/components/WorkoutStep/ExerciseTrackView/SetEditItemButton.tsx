import { observer } from 'mobx-react-lite'
import React from 'react'

import { Text, Icon, useColors, fontSize, IconProps } from 'designSystem'
import { TouchableOpacity } from 'react-native'

export type SetEditItemButtonProps = {
  icon?: IconProps['icon']
  symbol?: string
  color: string
  onPress: () => void
}
const SetEditItemButton: React.FC<SetEditItemButtonProps> = ({
  icon,
  symbol,
  color,
  onPress,
}) => {
  const colors = useColors()

  return (
    <TouchableOpacity
      style={{
        height: 36,
        width: 36,
        borderColor: colors.outline,
        borderWidth: 1,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        borderBottomRightRadius: 4,
        borderBottomLeftRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={onPress}
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
