import React, { useState } from "react"
import { View, ViewStyle } from "react-native"

import { Icon, IconButton, Text, Select, spacing, useColors, SelectOption } from "@/designSystem"

type MultiselectProps = {
  options: readonly SelectOption[]
  selectedValues: string[]
  onSelect: (selected: string[]) => void
  headerText?: string
  containerStyle?: ViewStyle
  hideSelectedItemsRemove?: boolean
  error?: boolean
}

export const Multiselect: React.FC<MultiselectProps> = ({
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
    typeof option === "string" ? option : option.value

  const getOptionLabel = (option: SelectOption): string =>
    typeof option === "string" ? option : option.label

  const removeSelection = (selection: string) => {
    const filtered = selectedValues.filter((value) => value !== selection)
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
        <Select.Button
          onPress={openSelection}
          text={headerText}
          error={error}
        />
        <View style={{ flexDirection: "row", gap: spacing.xs, flexWrap: "wrap" }}>
          {selectedValues.map((selectedValue) => {
            const option = options.find((opt) => getOptionValue(opt) === selectedValue)
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
