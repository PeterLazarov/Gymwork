import { View } from 'react-native'

import { Icon, IconButtonContainer } from '../designSystem'

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
      <IconButtonContainer onPress={() => props.onChange(props.value - 1)}>
        <Icon icon="minus" />
      </IconButtonContainer>
      {props.children}
      <IconButtonContainer onPress={() => props.onChange(props.value + 1)}>
        <Icon icon="plus" />
      </IconButtonContainer>
    </View>
  )
}
