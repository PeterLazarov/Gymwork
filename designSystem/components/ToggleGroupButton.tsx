import React, { useState } from 'react'
import { View, ViewStyle } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'

import { Button, ButtonText } from '.'

export type ToggleGroupButtonProps = {
  buttons: {
    text: string
    value: string
  }[]
  initialActiveIndex?: number
  containerStyle?: ViewStyle
  unselectable?: boolean
  onChange: (value: string | undefined) => void
}

const ToggleGroupButton: React.FC<ToggleGroupButtonProps> = ({
  buttons,
  initialActiveIndex,
  containerStyle,
  unselectable,
  onChange,
}) => {
  const [activeIndex, setActiveIndex] = useState(
    initialActiveIndex ?? (unselectable ? undefined : 0)
  )
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <View style={[{ flexDirection: 'row' }, containerStyle]}>
      {buttons.map((button, index) => (
        <Button
          variant={index === activeIndex ? 'primary' : 'tertiary'}
          key={index}
          onPress={() => {
            const isUnselect = unselectable && activeIndex === index

            setActiveIndex(isUnselect ? undefined : index)
            onChange(isUnselect ? undefined : button.value)
          }}
          style={{
            flex: 1,
            borderTopLeftRadius: index === 0 ? 999 : 0,
            borderBottomLeftRadius: index === 0 ? 999 : 0,
            borderTopRightRadius: index === buttons.length - 1 ? 999 : 0,
            borderBottomRightRadius: index === buttons.length - 1 ? 999 : 0,
            borderColor: colors.outlineVariant,
            borderWidth: 1,
            borderLeftWidth: index === 0 ? 1 : 0,
          }}
        >
          <ButtonText variant={index === activeIndex ? 'primary' : 'tertiary'}>
            {button.text}
          </ButtonText>
        </Button>
      ))}
    </View>
  )
}

export default ToggleGroupButton
