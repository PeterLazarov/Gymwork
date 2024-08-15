import { View } from 'react-native'

import { Icon, IconButtonContainer, colors } from 'designSystem'

type Props = {
  value: number
  onChange(m: number): void
  children?: React.ReactNode
  step?: number
}

const IncrementDecrementButtons: React.FC<Props> = ({
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
      <IconButtonContainer
        variant="full"
        onPress={() => onChange(value - (step ?? 1))}
      >
        <Icon
          icon="remove"
          color={colors.iconText}
        />
      </IconButtonContainer>
      {children}
      <IconButtonContainer
        variant="full"
        onPress={() => onChange(value + (step ?? 1))}
      >
        <Icon
          icon="add"
          color={colors.iconText}
        />
      </IconButtonContainer>
    </View>
  )
}

export default IncrementDecrementButtons
