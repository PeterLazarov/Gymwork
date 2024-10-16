import { Card, Icon, IconProps, useColors, Text } from 'designSystem'
import { View } from 'react-native'

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
  const colors = useColors()

  return (
    <Card
      containerStyle={{
        // flexGrow: 1,
        paddingHorizontal: 8,
        // flexShrink: 0,
      }}
      onPress={onPress}
      content={
        <View style={{ alignItems: 'center' }}>
          <Icon
            color={disabled ? colors.outlineVariant : colors.onSurface}
            icon={icon}
            style={{ paddingBottom: 10 }}
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
