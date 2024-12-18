import { View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { fontSize, Icon, IconButton, Text } from 'designSystem'

export type MiniTimerProps = {
  n: number
  onPress?(): void
}

export default function MiniTimer({ n, onPress }: MiniTimerProps) {
  const {
    theme: { colors, isDark },
  } = useAppTheme()

  return (
    <IconButton
      style={{
        position: 'relative',
      }}
      onPress={onPress}
    >
      <Icon
        icon={'stopwatch-outline'}
        color={colors.onPrimary}
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
            backgroundColor: isDark ? colors.shadow : colors.primary,
            width: 22,
            height: 22,
            alignItems: 'center',
            justifyContent: 'center',
            top: 1,
            borderRadius: 100,
          }}
        >
          <Text
            style={{
              fontSize: String(n).length > 2 ? fontSize.xxs : fontSize.sm,
              color: colors.onPrimary,
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
