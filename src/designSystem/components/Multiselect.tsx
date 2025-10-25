import React, { useState } from "react"
import { View, ViewStyle } from "react-native"

import { spacing, useColors } from "../tokens"
import { Icon } from "./Icon"
import { IconButton } from "./IconButton"
import { Select, SelectOption } from "./Select"
import { Text } from "./Text"

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
  error,
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
        <Select.Button
          onPress={openSelection}
          text={headerText}
          error={error}
        />
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
  const colors = useColors()

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.primary,
        paddingLeft: spacing.xs,
        paddingRight: spacing.xxs,
        paddingVertical: spacing.xs,
        borderRadius: 8,
        gap: spacing.xxs,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: colors.primary,
          textTransform: "capitalize",
        }}
        text={selection}
      />
      {!hideRemove && (
        <IconButton
          onPress={() => onRemove?.(selection)}
          size="sm"
        >
          <Icon
            icon="close"
            size="small"
          />
        </IconButton>
      )}
    </View>
  )
}
