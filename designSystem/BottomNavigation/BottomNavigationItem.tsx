import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { Text, Icon, useColors, fontSize, spacing, IconProps } from '..'

export type BottomNavigationItemProps = {
  text: string
  routes: string[]
  icon: IconProps['icon']
  onPress: () => void
  isSelected?: boolean
}
export const BottomNavigationItem: React.FC<BottomNavigationItemProps> = ({
  text,
  routes,
  icon,
  onPress,
  isSelected,
}) => {
  const colors = useColors()

  return (
    <TouchableOpacity
      key={text}
      onPress={onPress}
      style={{
        flex: 1,
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.xxs,
        }}
      >
        <Icon
          icon={icon}
          color={isSelected ? colors.primary : colors.onSurfaceVariant}
        />
        <Text
          style={{
            color: isSelected ? colors.primary : colors.onSurfaceVariant,
            fontSize: fontSize.sm,
          }}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  )
}
