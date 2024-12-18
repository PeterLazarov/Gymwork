import { View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { Card, Icon, IconProps, Text } from 'designSystem'

export type ActionCardProps = {
  onPress(): void
  disabled?: boolean
  icon: IconProps['icon']
  children: string
}

const ActionCard: React.FC<ActionCardProps> = ({
  onPress,
  children,
  icon,
  disabled,
}) => {
  const {
    theme: { colors, spacing },
  } = useAppTheme()

  return (
    <Card
      containerStyle={{
        paddingHorizontal: spacing.sm,
      }}
      onPress={onPress}
      content={
        <View style={{ alignItems: 'center' }}>
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

export default ActionCard
