import { Card, Icon, IconProps, Text, spacing, useColors } from "@/designSystem"
import { View } from "react-native"

export type ActionCardProps = {
  onPress(): void
  disabled?: boolean
  icon: IconProps["icon"]
  children: string
}

export const ActionCard: React.FC<ActionCardProps> = ({ onPress, children, icon, disabled }) => {
  const colors = useColors()

  return (
    <Card
      containerStyle={{
        paddingHorizontal: spacing.sm,
      }}
      onPress={onPress}
      content={
        <View style={{ alignItems: "center" }}>
          <Icon
            color={disabled ? colors.outlineVariant : colors.onSurface}
            icon={icon}
            style={{ paddingBottom: spacing.sm }}
          />
          <Text
            style={{
              color: disabled ? colors.outlineVariant : colors.onSurface,
            }}
          >
            {children}
          </Text>
        </View>
      }
    />
  )
}
