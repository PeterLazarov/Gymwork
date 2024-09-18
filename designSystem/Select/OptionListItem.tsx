import React from 'react'

import { Text, Divider, useColors } from 'designSystem'
import { SelectOption } from './types'
import { TouchableOpacity } from 'react-native'

type Props<T = unknown> = {
  option: SelectOption<T>
  showDivider: boolean
  selectedValues: T[]
  onSelect: (option: SelectOption<T>) => void
}
function OptionListItem<T = unknown>({
  option,
  showDivider,
  selectedValues,
  onSelect,
}: Props<T>) {
  const colors = useColors()

  const getOptionLabel = (option: SelectOption): string => {
    return typeof option === 'string' ? option : option.label
  }
  const getOptionValue = (option: SelectOption<T>): T => {
    return typeof option === 'string' ? option : option.value
  }

  const value = getOptionValue(option)
  const label = getOptionLabel(option)

  return (
    <>
      {showDivider && (
        <Divider
          orientation="horizontal"
          variant="neutral"
        />
      )}
      <TouchableOpacity
        style={{
          paddingHorizontal: 10,
          paddingVertical: 15,
          backgroundColor: selectedValues.includes(value)
            ? colors.surfaceContainer
            : colors.surfaceContainerLowest,
        }}
        onPress={() => onSelect(option)}
      >
        <Text>{label}</Text>
      </TouchableOpacity>
    </>
  )
}

export default OptionListItem
