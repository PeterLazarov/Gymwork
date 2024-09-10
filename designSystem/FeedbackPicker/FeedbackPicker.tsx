import React, { useState } from 'react'
import { View } from 'react-native'

import FeedbackPickerOption, { FeedbackOption } from './FeedbackPickerOption'

type Props = {
  selected?: string
  onChange: (feeling: string) => void
  options: FeedbackOption[]
  defaultValue?: string
}
const FeedbackPicker: React.FC<Props> = ({
  selected,
  onChange,
  options,
  defaultValue,
}) => {
  const [selectedIcon, setSelectedIcon] = useState(selected || defaultValue)

  function onPress(feeling: string) {
    setSelectedIcon(feeling)
    onChange(feeling)
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
      }}
    >
      {options.map(option => (
        <FeedbackPickerOption
          key={option.value}
          option={option}
          isSelected={selectedIcon === option.value}
          onPress={onPress}
        />
      ))}
    </View>
  )
}

export default FeedbackPicker