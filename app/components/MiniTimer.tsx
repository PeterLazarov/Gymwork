import { fontSize, Text, Icon, useColors, IconButton } from 'designSystem'
import { View } from 'react-native'

export type MiniTimerProps = {
  n: number
  onPress?(): void
}

export default function MiniTimer({ n = 99, onPress }: MiniTimerProps) {
  const colors = useColors()

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
            backgroundColor: colors.primary,
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
          >
            {n}
          </Text>
        </View>
      </View>
    </IconButton>
  )
}
