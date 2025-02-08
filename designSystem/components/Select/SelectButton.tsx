import React from 'react'
import { TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-paper'

export type SelectButtonProps = {
  onPress: () => void
  text?: string
  error?: boolean
  label?: string
}

const SelectButton: React.FC<SelectButtonProps> = ({
  onPress,
  text,
  error,
  label,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexGrow: 1,
      }}
    >
      <TextInput
        value={text}
        error={error}
        label={label}
        pointerEvents="none"
        focusable={false}
        editable={false}
        style={{ flexGrow: 1 }}
      />
    </TouchableOpacity>
  )
}

export default SelectButton
