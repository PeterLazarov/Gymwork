import { StyleProp, View, ViewStyle } from 'react-native'

import { Icon, PressableHighlight, colors } from 'designSystem'

type Props = {
  value: number
  onChange(m: number): void
  children?: React.ReactNode
  step?: number
}

const IncrementalButtons: React.FC<Props> = ({
  value,
  onChange,
  children,
  step,
}) => {
  const btnStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.primaryLight,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
  }

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <PressableHighlight
        onPress={() => onChange(value - (step ?? 1))}
        style={btnStyle}
      >
        <Icon
          icon="remove"
          color={colors.iconText}
        />
      </PressableHighlight>
      <View style={{ flexGrow: 1 }}>{children}</View>
      <PressableHighlight
        onPress={() => onChange(value + (step ?? 1))}
        style={btnStyle}
      >
        <Icon
          icon="add"
          color={colors.iconText}
        />
      </PressableHighlight>
    </View>
  )
}

export default IncrementalButtons
