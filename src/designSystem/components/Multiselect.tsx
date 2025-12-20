import React, { useState } from "react"
import { View, ViewStyle } from "react-native"

import { spacing } from "../tokens"
import { Select, SelectOption } from "./Select"
import { Button } from "./Button"
import { Tag } from "./Tag"
import { Icon } from "./Icon"

type MultiselectProps<T = unknown> = {
  options: readonly SelectOption<T>[]
  selectedValues: T[]
  onSelect: (selected: T[]) => void
  headerText?: string
  containerStyle?: ViewStyle
  hideSelectedItemsRemove?: boolean
  error?: boolean
}

export function Multiselect<T>({
  options,
  selectedValues,
  onSelect,
  headerText,
  containerStyle = {},
  hideSelectedItemsRemove,
}: MultiselectProps<T>) {
  const [selectionOpen, setSelectionOpen] = useState(false)

  const openSelection = () => setSelectionOpen(true)
  const closeSelection = () => setSelectionOpen(false)

  const getOptionValue = (option: SelectOption<T>): T =>
    typeof option === "string" ? (option as T) : option.value

  const getOptionLabel = (option: SelectOption<T>): string =>
    typeof option === "string" ? option : option.label

  const removeSelection = (selection: T) => {
    const filtered = selectedValues.filter((value) => value !== selection)
    onSelect(filtered)
  }

  const onOptionSelect = (option: SelectOption<T>) => {
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
        <Button
          onPress={openSelection}
          variant="tertiary"
          text={headerText}
          size="small"
          style={{
            justifyContent: "flex-start",
          }}
        >
          <Icon icon="chevron-down" size="small" />
        </Button>
        <View style={{ flexDirection: "row", gap: spacing.xs, flexWrap: "wrap" }}>
          {selectedValues.map((selectedValue, index) => {
            const option = options.find((opt) => getOptionValue(opt) === selectedValue)
            const label = option ? getOptionLabel(option) : String(selectedValue)
            return (
              <SelectedLabel
                key={`${selectedValue}-${index}`}
                selection={label}
                onRemove={() => removeSelection(selectedValue)}
                hideRemove={hideSelectedItemsRemove}
              />
            )
          })}
        </View>
      </View>
      <Select.OptionsModal
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

type SelectedLabelProps = {
  selection: string
  hideRemove?: boolean
  onRemove?: (option: string) => void
}

const SelectedLabel: React.FC<SelectedLabelProps> = ({ selection, hideRemove, onRemove }) => {
  return (
    <Tag
      variant="primary"
      text={selection}
      rightIcon={hideRemove ? undefined : "close"}
      rightIconAction={() => onRemove?.(selection)}
    />
  )
}
