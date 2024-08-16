import React, { useState } from 'react'
import { View, ViewStyle } from 'react-native'

import SelectOptionsModal from './SelectOptionsModal'
import { SelectButton } from 'designSystem'

type Props = {
  options: string[]
  value?: string
  onChange: (selected: string) => void
  placeholder?: string
  containerStyle?: ViewStyle
  hideSelectedItemsRemove?: boolean
}

const Select: React.FC<Props> = ({
  options,
  value,
  onChange,
  placeholder,
  containerStyle = {},
}) => {
  const [selectionOpen, setSelectionOpen] = useState(false)

  const openSelection = () => setSelectionOpen(true)
  const closeSelection = () => setSelectionOpen(false)

  const onOptionSelect = (option: string) => {
    if (option !== value) {
      onChange(option)
      closeSelection()
    }
  }
  return (
    <View style={{ ...containerStyle }}>
      <SelectButton
        text={value ?? placeholder}
        onPress={openSelection}
      />
      <SelectOptionsModal
        header={placeholder}
        open={selectionOpen}
        onClose={closeSelection}
        options={options}
        selectedOptions={value ? [value] : []}
        onOptionSelect={onOptionSelect}
        hideButton
      />
    </View>
  )
}

export default Select
