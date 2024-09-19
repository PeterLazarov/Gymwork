import React from 'react'
import { TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-paper'

type Props = {
  onPress: () => void
  text?: string
  error?: boolean
  label?: string
}

const SelectButton: React.FC<Props> = ({ onPress, text, error, label }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <TextInput
        value={text}
        error={error}
        label={label}
        pointerEvents="none"
        focusable={false}
      />
    </TouchableOpacity>
  )
}

export default SelectButton
