import { useColorScheme, View } from "react-native"

import { fontSize, Text, Icon, useColors, IconButton } from "@/designSystem"

export type MiniTimerProps = {
  n: number
  onPress?(): void
}

export function MiniTimer({ n, onPress }: MiniTimerProps) {
  const colors = useColors()
  const scheme = useColorScheme()

  return (
    <IconButton
      style={{
        position: "relative",
      }}
      onPress={onPress}
    >
      <Icon
        icon={"stopwatch-outline"}
        color={colors.onPrimary}
        size="large"
      />
      <View
        style={{
          borderRadius: 100,
          aspectRatio: 1,
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
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
            backgroundColor: scheme === "light" ? colors.primary : colors.shadow,
            width: 22,
            height: 22,
            alignItems: "center",
            justifyContent: "center",
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
