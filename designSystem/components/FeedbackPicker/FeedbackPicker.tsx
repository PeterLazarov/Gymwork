import React, { useState } from 'react'
import { View } from 'react-native'

import { spacing } from 'designSystem'

import FeedbackPickerOption, { FeedbackOption } from './FeedbackPickerOption'

export type FeedbackPickerProps = {
  selected?: string
  onChange: (feeling?: string) => void
  options: FeedbackOption[]
  defaultValue?: string
}
const FeedbackPicker: React.FC<FeedbackPickerProps> = ({
  selected,
  onChange,
  options,
  defaultValue,
}) => {
  const [selectedIcon, setSelectedIcon] = useState(selected || defaultValue)

  function onPress(option: string) {
    const newValue = selected === option ? undefined : option
    setSelectedIcon(newValue)
    onChange(newValue)
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        gap: spacing.md,
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
