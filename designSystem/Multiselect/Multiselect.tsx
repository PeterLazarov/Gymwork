import React, { useState } from 'react'
import { View, ViewStyle } from 'react-native'

import SelectedLabel from './SelectedLabel'
import {
  SelectButton,
  SelectOption,
  SelectOptionsModal,
} from 'designSystem/Select'

type Props = {
  options: SelectOption[]
  selectedValues: string[]
  onSelect: (selected: string[]) => void
  selectText?: string
  containerStyle: ViewStyle
  hideSelectedItemsRemove?: boolean
}

const Multiselect: React.FC<Props> = ({
  options,
  selectedValues,
  onSelect,
  selectText,
  containerStyle = {},
  hideSelectedItemsRemove,
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
          gap: 4,
          ...containerStyle,
        }}
      >
        <SelectButton
          onPress={openSelection}
          text={selectText}
        />
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
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
        header={selectText}
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
