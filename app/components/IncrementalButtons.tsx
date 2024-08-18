import { View } from 'react-native'

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
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <PressableHighlight
        onPress={() => onChange(value - (step ?? 1))}
        style={{ backgroundColor: colors.primaryLight, padding: 4 }}
      >
        <Icon
          icon="remove"
          color={colors.iconText}
        />
      </PressableHighlight>
      {children}
      <PressableHighlight
        onPress={() => onChange(value + (step ?? 1))}
        style={{ backgroundColor: colors.primaryLight, padding: 4 }}
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
