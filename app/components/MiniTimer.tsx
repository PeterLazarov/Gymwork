import { View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { fontSize, Icon, IconButton, Text } from 'designSystem'

export type MiniTimerProps = {
  n: number
  onPress?(): void
  color?: string
  backgroundColor?: string
}

export default function MiniTimer({
  n,
  onPress,
  color: _color,
  backgroundColor: _bgColor,
}: MiniTimerProps) {
  const {
    theme: { colors, isDark },
  } = useAppTheme()

  const bgColor = _bgColor || (isDark ? colors.shadow : colors.surface)
  const mainColor = _color || colors.primary

  return (
    <IconButton
      style={{
        position: 'relative',
      }}
      onPress={onPress}
    >
      <Icon
        icon={'stopwatch-outline'}
        color={mainColor}
        size="large"
      />
      <View
        style={{
          borderRadius: 100,
          aspectRatio: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }}
      >
        <View
          style={{
            // TODO refactor to onHeader?
            backgroundColor: bgColor,
            width: 22,
            height: 22,
            left: -0.25,
            top: 0.9,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 100,
          }}
        >
          <Text
            style={{
              fontSize: String(n).length > 2 ? fontSize.xxs : fontSize.sm,
              color: mainColor,
            }}
            numberOfLines={1}
            ellipsizeMode="clip"
          >
            {Math.min(n, 999)}
          </Text>
        </View>
      </View>
    </IconButton>
  )
}
