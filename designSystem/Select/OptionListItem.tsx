import React from 'react'
import { TouchableOpacity } from 'react-native'

import { BodyLargeLabel, Divider, colors } from 'designSystem'
import { SelectOption } from './types'

type Props = {
  option: SelectOption
  showDivider: boolean
  selectedValues: string[]
  onSelect: (option: SelectOption) => void
}
const OptionListItem: React.FC<Props> = ({
  option,
  showDivider,
  selectedValues,
  onSelect,
}) => {
  const getOptionLabel = (option: SelectOption): string => {
    return typeof option === 'string' ? option : option.label
  }
  const getOptionValue = (option: SelectOption): string => {
    return typeof option === 'string' ? option : option.value
  }

  const value = getOptionValue(option)
  const label = getOptionLabel(option)

  return (
    <>
      {showDivider && (
        <Divider
          orientation="horizontal"
          style={{ backgroundColor: colors.secondary }}
        />
      )}
      <TouchableOpacity
        style={{ paddingHorizontal: 10, paddingVertical: 15 }}
        onPress={() => onSelect(option)}
      >
        <BodyLargeLabel
          style={{
            color: selectedValues.includes(value)
              ? colors.primary
              : colors.secondaryText,
          }}
        >
          {label}
        </BodyLargeLabel>
      </TouchableOpacity>
    </>
  )
}

export default OptionListItem
