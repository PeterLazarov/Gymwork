import React, { useState } from 'react'
import { View, ViewStyle } from 'react-native'

import {
  SelectButton,
  SelectOption,
  SelectOptionsModal,
  spacing,
} from 'designSystem'

import SelectedLabel from './SelectedLabel'

type Props = {
  options: readonly SelectOption[]
  selectedValues: string[]
  onSelect: (selected: string[]) => void
  headerText?: string
  containerStyle?: ViewStyle
  hideSelectedItemsRemove?: boolean
  error?: boolean
}

const Multiselect: React.FC<Props> = ({
  options,
  selectedValues,
  onSelect,
  headerText,
  containerStyle = {},
  hideSelectedItemsRemove,
  error,
}) => {
  const [selectionOpen, setSelectionOpen] = useState(false)

  const openSelection = () => setSelectionOpen(true)
  const closeSelection = () => setSelectionOpen(false)

  const getOptionValue = (option: SelectOption): string =>
    typeof option === 'string' ? option : option.value

  const getOptionLabel = (option: SelectOption): string =>
    typeof option === 'string' ? option : option.label

  const removeSelection = (selection: string) => {
    const filtered = selectedValues.filter(value => value !== selection)
    onSelect(filtered)
  }

  const onOptionSelect = (option: SelectOption) => {
    const optionValue = getOptionValue(option)

    if (selectedValues.includes(optionValue)) {
      removeSelection(optionValue)
    } else {
      onSelect([...selectedValues, optionValue])
    }
  }

  return (
    <>
      <View
        style={{
          gap: spacing.xxs,
          ...containerStyle,
        }}
      >
        <SelectButton
          onPress={openSelection}
          text={headerText}
          error={error}
        />
        <View
          style={{ flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' }}
        >
          {selectedValues.map(selectedValue => {
            const option = options.find(
              opt => getOptionValue(opt) === selectedValue
            )
            return (
              <SelectedLabel
                key={selectedValue}
                selection={option ? getOptionLabel(option) : selectedValue}
                onRemove={() => removeSelection(selectedValue)}
                hideRemove={hideSelectedItemsRemove}
              />
            )
          })}
        </View>
      </View>
      <SelectOptionsModal
        header={headerText}
        open={selectionOpen}
        onClose={closeSelection}
        options={options}
        selectedValues={selectedValues}
        onOptionSelect={onOptionSelect}
      />
    </>
  )
}

export default Multiselect
