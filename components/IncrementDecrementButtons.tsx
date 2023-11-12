import { View } from 'react-native'

import { Icon, IconButtonContainer } from '../designSystem'
import colors from '../designSystem/colors'

// TODO snap to increment
export default function IncrementDecrementButtons(props: {
  value: number
  onChange(m: number): void
  children?: React.ReactNode
  step?: number
}) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <IconButtonContainer
        variant="full"
        onPress={() => props.onChange(props.value - (props.step ?? 1))}
      >
        <Icon
          icon="remove"
          color={colors.iconText}
        />
      </IconButtonContainer>
      {props.children}
      <IconButtonContainer
        variant="full"
        onPress={() => props.onChange(props.value + (props.step ?? 1))}
      >
        <Icon
          icon="add"
          color={colors.iconText}
        />
      </IconButtonContainer>
    </View>
  )
}
