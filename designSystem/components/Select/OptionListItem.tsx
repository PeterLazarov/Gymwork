import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { Divider, Text } from 'designSystem'

import { SelectOption } from './types'

export const OptionListItemHeight = 55

type Props<T = unknown> = {
  option: SelectOption<T>
  showDivider: boolean
  selectedValues: T[]
  onSelect: (option: SelectOption<T>) => void
  height: number
}
function OptionListItem<T = unknown>({
  option,
  showDivider,
  selectedValues,
  onSelect,
  height,
}: Props<T>) {
  const {
    theme: { colors },
  } = useAppTheme()

  const getOptionLabel = (option: SelectOption): string => {
    return typeof option === 'string' ? option : option.label
  }
  const getOptionValue = (option: SelectOption<T>): T => {
    return typeof option === 'string' ? option : option.value
  }

  const value = getOptionValue(option)
  const label = getOptionLabel(option)

  return (
    <View style={{ height }}>
      {showDivider && (
        <Divider
          orientation="horizontal"
          variant="neutral"
        />
      )}
      <TouchableOpacity
        style={{
          flex: 1,
          paddingHorizontal: 10,
          justifyContent: 'center',
          backgroundColor: selectedValues.includes(value)
            ? colors.surfaceContainer
            : colors.surfaceContainerLowest,
        }}
        onPress={() => onSelect(option)}
      >
        <Text>{label}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default OptionListItem
