import React, { useMemo, useState } from "react"
import { Dimensions, Pressable, ScrollView, View, ViewStyle } from "react-native"
import { TextInput } from "react-native-paper"

import { translate } from "@/utils"
import { fontSize, spacing, useColors } from "../tokens"
import { Button } from "./Button"
import { Divider } from "./Divider"
import { Modal } from "./Modal"
import { Text } from "./Text"
import { Tag } from "./Tag"

export type SelectOption<T = unknown> =
  | string
  | {
      value: T
      label: string
    }

type SelectProps<T = unknown> = {
  options: SelectOption<T>[]
  value?: T
  onChange: (selected?: T) => void
  headerText?: string
  placeholder?: string
  containerStyle?: ViewStyle
  buttonStyle?: ViewStyle
  hideSelectedItemsRemove?: boolean
  label?: string
  clearable?: boolean
  hideChevron?: boolean
}

export function Select<T>({
  options,
  value,
  onChange,
  headerText,
  placeholder,
  label,
  containerStyle = {},
  buttonStyle,
  clearable,
  hideChevron
}: SelectProps<T>) {
  const [selectionOpen, setSelectionOpen] = useState(false)

  const openSelection = () => setSelectionOpen(true)
  const closeSelection = () => setSelectionOpen(false)

  const getOptionValue = (option: SelectOption<T>): T => {
    return typeof option === "string" ? (option as T) : option.value
  }
  const selectedOption = useMemo(
    () => options.find((opt) => getOptionValue(opt) === value),
    [value],
  )

  const onOptionSelect = (option: SelectOption<T>) => {
    const selectedValue = getOptionValue(option)
    if (selectedValue !== value) {
      onChange(selectedValue)
      closeSelection()
    }
  }

  function clear() {
    onChange(undefined)
  }
  return (
    <View style={{ ...containerStyle }}>
      <SelectButton
        option={selectedOption}
        onPress={openSelection}
        label={label}
        style={buttonStyle}
        clearable={clearable}
        clear={clear}
        hideChevron={hideChevron}
      />
      <SelectOptionsModal
        header={headerText || placeholder}
        open={selectionOpen}
        onClose={closeSelection}
        options={options}
        selectedValues={value === undefined ? [] : [value]}
        onOptionSelect={onOptionSelect}
        hideButton
      />
    </View>
  )
}

type SelectButtonProps = {
  onPress: () => void
  option?: SelectOption
  error?: boolean
  label?: string
  style?: ViewStyle
  clearable?: boolean
  clear: () => void
  hideChevron?: boolean
}

const SelectButton: React.FC<SelectButtonProps> = ({ onPress, option, label, style, clearable, clear, hideChevron }) => {
  const getOptionLabel = (option: SelectOption): string => {
    return typeof option === "string" ? option : option.label
  }
  const text = option ? getOptionLabel(option) : undefined
  const showClearIcon = clearable && option
  
  return (
    <Tag
      onPress={onPress}
      variant={option ? "primary" : "secondary"}
      text={text || label}
      style={style}
      rightIcon={showClearIcon ? "close" : hideChevron ? undefined : "chevron-down"}
      rightIconAction={showClearIcon ? clear : undefined}
    />
  )
}

type OptionsModalProps<T = unknown> = {
  header?: string
  open: boolean
  onClose: () => void
  options: readonly SelectOption<T>[]
  selectedValues: T[]
  onOptionSelect: (option: SelectOption<T>) => void
  hideButton?: boolean
}

function SelectOptionsModal<T = unknown>({
  header = "Select an option",
  open,
  onClose,
  options,
  selectedValues,
  onOptionSelect,
  hideButton,
}: OptionsModalProps<T>) {
  const colors = useColors()

  const headerHeight = 59
  const buttonHeight = 48
  const listItemHeight = 55
  const modalHeight =
    headerHeight + options.length * listItemHeight + (hideButton ? 0 : buttonHeight)
  const maxModalHeight = Dimensions.get("screen").height - 100

  return (
    <Modal
      open={open}
      onClose={onClose}
      containerStyle={{ justifyContent: "center" }}
    >
      <View
        style={{
          height: modalHeight,
          backgroundColor: colors.surfaceContainerLowest,
          marginVertical: spacing.xs,
          marginHorizontal: spacing.md,
          maxHeight: maxModalHeight,
        }}
      >
        <View style={{ height: headerHeight }}>
          <View
            style={{
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: fontSize.lg,
                textAlign: "center",
              }}
              text={header}
            />
          </View>
          <Divider
            orientation="horizontal"
            variant="primary"
          />
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView>
            {options.map((option, index) => (
              <ListItem
                key={index}
                option={option}
                showDivider={index !== 0}
                onSelect={onOptionSelect}
                selectedValues={selectedValues}
                height={listItemHeight}
              />
            ))}
          </ScrollView>
        </View>
        {!hideButton && (
          <View style={{ flexDirection: "row" }}>
            <Button
              variant="primary"
              style={{ flex: 1, height: buttonHeight }}
              onPress={onClose}
              text={translate("done")}
            />
          </View>
        )}
      </View>
    </Modal>
  )
}

export const OptionListItemHeight = 55

type ListItemProps<T = unknown> = {
  option: SelectOption<T>
  showDivider: boolean
  selectedValues: T[]
  onSelect: (option: SelectOption<T>) => void
  height: number
}
function ListItem<T = unknown>({
  option,
  showDivider,
  selectedValues,
  onSelect,
  height,
}: ListItemProps<T>) {
  const colors = useColors()

  const getOptionLabel = (option: SelectOption): string => {
    return typeof option === "string" ? option : option.label
  }
  const getOptionValue = (option: SelectOption<T>): T => {
    return typeof option === "string" ? (option as T) : option.value
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
      <Pressable
        style={{
          flex: 1,
          paddingHorizontal: 10,
          justifyContent: "center",
          backgroundColor: selectedValues.includes(value)
            ? colors.surfaceContainer
            : colors.surfaceContainerLowest,
        }}
        onPress={() => onSelect(option)}
      >
        <Text text={label} />
      </Pressable>
    </View>
  )
}

Select.Button = SelectButton
Select.OptionsModal = SelectOptionsModal
Select.ListItem = ListItem
