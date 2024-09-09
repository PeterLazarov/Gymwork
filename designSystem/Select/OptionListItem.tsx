import React from 'react'
import { Text } from 'react-native'

import { Divider, PressableHighlight, colors, fontSize } from 'designSystem'
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
          variant="neutral"
        />
      )}
      <PressableHighlight
        style={{
          paddingHorizontal: 10,
          paddingVertical: 15,
          backgroundColor: selectedValues.includes(value)
            ? colors.accentLightest
            : colors.neutralLightest,
        }}
        onPress={() => onSelect(option)}
      >
        <Text
          style={{
            fontSize: fontSize.md,
            color: colors.neutralText,
          }}
        >
          {label}
        </Text>
      </PressableHighlight>
    </>
  )
}

export default OptionListItem
