import React, { useMemo, useState } from 'react'
import { View, ViewStyle } from 'react-native'

import SelectButton from './SelectButton'
import SelectOptionsSheet from './SelectOptionsSheet'
import { SelectOption } from './types'

type Props<T = unknown> = {
  options: SelectOption<T>[]
  value?: T
  onChange: (selected: T) => void
  headerText?: string
  placeholder?: string
  containerStyle?: ViewStyle
  hideSelectedItemsRemove?: boolean
  label?: string
}

function Select<T>({
  options,
  value,
  onChange,
  headerText,
  placeholder,
  label,
  containerStyle = {},
}: Props<T>) {
  const [selectionOpen, setSelectionOpen] = useState(false)

  const openSelection = () => setSelectionOpen(true)
  const closeSelection = () => setSelectionOpen(false)

  const getOptionLabel = (option: SelectOption): string => {
    return typeof option === 'string' ? option : option.label
  }
  const getOptionValue = (option: SelectOption): T => {
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
        label={label}
      />
      <SelectOptionsSheet
        header={headerText || placeholder}
        open={selectionOpen}
        onClose={closeSelection}
        options={options}
        selectedValues={value === undefined ? [] : [value]}
        onOptionSelect={onOptionSelect}
        hideButton
      />
    </View>
  )
}

export default Select
