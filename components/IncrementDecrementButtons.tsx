import { View } from 'react-native'

import { Icon, IconButtonContainer } from '../designSystem'
import colors from '../designSystem/colors'

export default function IncrementDecrementButtons(props: {
  value: number
  onChange(m: number): void
  children?: React.ReactNode
}) {
  return (
    <View
      style={{
        // overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        // alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'blue',
      }}
    >
      <IconButtonContainer
        variant="full"
        onPress={() => props.onChange(props.value - 1)}
      >
        <Icon
          icon="remove"
          color={colors.iconText}
        />
      </IconButtonContainer>
      {props.children}
      <IconButtonContainer
        variant="full"
        onPress={() => props.onChange(props.value + 1)}
      >
        <Icon
          icon="add"
          color={colors.iconText}
        />
      </IconButtonContainer>
    </View>
  )
}
