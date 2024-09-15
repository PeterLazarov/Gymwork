import React, { useState } from 'react'
import { View, ViewStyle } from 'react-native'

import { Button, ButtonText, useColors } from '.'

type Props = {
  buttons: {
    text: string
    onPress: () => void
  }[]
  initialActiveIndex?: number
  containerStyle?: ViewStyle
}

const ToggleGroupButton: React.FC<Props> = ({
  buttons,
  initialActiveIndex,
  containerStyle,
}) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex ?? 0)
  const colors = useColors()

  return (
    <View style={[{ flexDirection: 'row' }, containerStyle]}>
      {buttons.map((button, index) => (
        <Button
          variant={index === activeIndex ? 'primary' : 'tertiary'}
          key={index}
          onPress={() => {
            setActiveIndex(index)
            button.onPress()
          }}
          style={{
            flex: 1,
            borderTopLeftRadius: index === 0 ? 999 : 0,
            borderBottomLeftRadius: index === 0 ? 999 : 0,
            borderTopRightRadius: index === buttons.length - 1 ? 999 : 0,
            borderBottomRightRadius: index === buttons.length - 1 ? 999 : 0,
            borderColor: colors.neutralDark,
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
