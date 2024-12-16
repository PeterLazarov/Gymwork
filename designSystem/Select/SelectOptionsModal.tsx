import React from 'react'
import { ScrollView, View, Dimensions } from 'react-native'
import { Portal, Modal } from 'react-native-paper'

import { translate } from 'app/i18n'
import {
  Text,
  Button,
  ButtonText,
  Divider,
  useColors,
  fontSize,
  spacing,
} from 'designSystem'
import { SelectOption } from './types'
import OptionListItem from './OptionListItem'

type Props<T = unknown> = {
  header?: string
  open: boolean
  onClose: () => void
  options: readonly SelectOption<T>[]
  selectedValues: T[]
  onOptionSelect: (option: SelectOption<T>) => void
  hideButton?: boolean
}

function SelectOptionsModal<T = unknown>({
  header = 'Select an option',
  open,
  onClose,
  options,
  selectedValues,
  onOptionSelect,
  hideButton,
}: Props<T>) {
  const colors = useColors()

  const headerHeight = 59
  const buttonHeight = 48
  const listItemHeight = 55
  const modalHeight =
    headerHeight +
    options.length * listItemHeight +
    (hideButton ? 0 : buttonHeight)
  const maxModalHeight = Dimensions.get('screen').height - 100

  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: colors.surfaceContainerLowest,
          marginVertical: spacing.xs,
          marginHorizontal: spacing.md,
          maxHeight: maxModalHeight,
        }}
      >
        <View
          style={{
            height: modalHeight,
            maxHeight: maxModalHeight,
          }}
        >
          <View
            style={{
              height: headerHeight,
            }}
          >
            <View
              style={{
                flexGrow: 1,
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: fontSize.lg,
                  textAlign: 'center',
                }}
              >
                {header}
              </Text>
            </View>
            <Divider
              orientation="horizontal"
              variant="primary"
            />
          </View>

          <View style={{ flex: 1 }}>
            <ScrollView>
              {options.map((option, index) => (
                <OptionListItem
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
            <View style={{ flexDirection: 'row' }}>
              <Button
                variant="primary"
                style={{ flex: 1, height: buttonHeight }}
                onPress={onClose}
              >
                <ButtonText variant="primary">{translate('done')}</ButtonText>
              </Button>
            </View>
          )}
        </View>
      </Modal>
    </Portal>
  )
}

export default SelectOptionsModal
