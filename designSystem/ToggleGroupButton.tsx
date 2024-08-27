import React, { useState } from 'react'
import { View } from 'react-native'

import { Button, ButtonText } from '.'

type Props = {
  buttons: {
    text: string
    onPress: () => void
  }[]
  initialActiveIndex?: number
}

const ToggleGroupButton: React.FC<Props> = ({
  buttons,
  initialActiveIndex,
}) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex ?? 0)

  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {buttons.map((button, index) => (
        <Button
          variant={index === activeIndex ? 'primary' : 'secondary'}
          key={index}
          onPress={() => {
            setActiveIndex(index)
            button.onPress()
          }}
          style={{ flex: 1 }}
          // size="small"
        >
          <ButtonText variant={index === activeIndex ? 'primary' : 'secondary'}>
            {button.text}
          </ButtonText>
        </Button>
      ))}
    </View>
  )
}

export default ToggleGroupButton
