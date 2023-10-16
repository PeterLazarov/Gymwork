import { View, Button } from 'react-native'

export default function IncrementDecrementButtons(props: {
  value: number
  onChange(m: number): void
  children?: React.ReactNode
}) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Button
        onPress={() => props.onChange(props.value - 1)}
        title="  -  "
      ></Button>
      {props.children}
      <Button
        onPress={() => props.onChange(props.value + 1)}
        title="  +  "
      ></Button>
    </View>
  )
}
