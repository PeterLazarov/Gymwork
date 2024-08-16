import React, { useState } from 'react'
import { View, ViewStyle } from 'react-native'

import SelectedLabel from './SelectedLabel'
import { SelectButton, SelectOptionsModal } from 'designSystem'

type Props = {
  options: string[]
  selectedOptions: string[]
  onSelect: (selected: string[]) => void
  selectText?: string
  containerStyle: ViewStyle
  hideSelectedItemsRemove?: boolean
}

const Multiselect: React.FC<Props> = ({
  options,
  selectedOptions,
  onSelect,
  selectText,
  containerStyle = {},
  hideSelectedItemsRemove,
}) => {
  const [selectionOpen, setSelectionOpen] = useState(false)

  const openSelection = () => setSelectionOpen(true)
  const closeSelection = () => setSelectionOpen(false)

  const removeSelection = (selection: string) => {
    const filtered = selectedOptions.filter(i => i !== selection)
    onSelect(filtered)
  }

  const onOptionSelect = (option: string) => {
    if (selectedOptions.indexOf(option) !== -1) {
      removeSelection(option)
    } else {
      onSelect([...selectedOptions, option])
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
          {selectedOptions.map(selection => (
            <SelectedLabel
              key={selection}
              selection={selection}
              onRemove={removeSelection}
              hideRemove={hideSelectedItemsRemove}
            />
          ))}
        </View>
      </View>
      <SelectOptionsModal
        header={selectText}
        open={selectionOpen}
        onClose={closeSelection}
        options={options}
        selectedOptions={selectedOptions}
        onOptionSelect={onOptionSelect}
      />
    </>
  )
}

export default Multiselect
