import React, { useMemo, useState } from 'react'
import { View, ViewStyle } from 'react-native'

import SelectButton from './SelectButton'
import SelectOptionsModal from './SelectOptionsModal'
import { SelectOption } from './types'

type Props = {
  options: SelectOption[]
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

  const getOptionLabel = (option: SelectOption): string => {
    return typeof option === 'string' ? option : option.label
  }
  const getOptionValue = (option: SelectOption): string => {
    return typeof option === 'string' ? option : option.value
  }
  const selectedOption = useMemo(
    () => options.find(opt => getOptionValue(opt) === value),
    [value]
  )

  const onOptionSelect = (option: SelectOption) => {
    const selectedValue = getOptionValue(option)
    if (selectedValue !== value) {
      onChange(selectedValue)
      closeSelection()
    }
  }
  return (
    <View style={{ ...containerStyle }}>
      <SelectButton
        text={selectedOption ? getOptionLabel(selectedOption) : placeholder}
        onPress={openSelection}
      />
      <SelectOptionsModal
        header={placeholder}
        open={selectionOpen}
        onClose={closeSelection}
        options={options}
        selectedValues={value ? [value] : []}
        onOptionSelect={onOptionSelect}
        hideButton
      />
    </View>
  )
}

export default Select
