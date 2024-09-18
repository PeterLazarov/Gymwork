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

  const dividerHeight = 1
  const itemHeight = 53
  const modalHeight =
    (options.length + (hideButton ? 1 : 2)) * itemHeight + dividerHeight
  const maxModalHeight = Dimensions.get('screen').height - 100

  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: colors.mat.surfaceContainerLowest,
          marginVertical: 8,
          marginHorizontal: 20,
          maxHeight: maxModalHeight,
        }}
      >
        <View
          style={{
            height: modalHeight,
            maxHeight: maxModalHeight,
          }}
        >
          <Text
            style={{
              fontSize: fontSize.lg,
              textAlign: 'center',
              padding: 16,
            }}
          >
            {header}
          </Text>
          <Divider
            orientation="horizontal"
            variant="accent"
          />
          <View style={{ flex: 1 }}>
            <ScrollView>
              {options.map((option, index) => (
                <OptionListItem
                  key={index}
                  option={option}
                  showDivider={index !== 0}
                  onSelect={onOptionSelect}
                  selectedValues={selectedValues}
                />
              ))}
            </ScrollView>
          </View>
          {!hideButton && (
            <View style={{ flexDirection: 'row' }}>
              <Button
                variant="accent"
                style={{ flex: 1 }}
                onPress={onClose}
              >
                <ButtonText variant="accent">{translate('done')}</ButtonText>
              </Button>
            </View>
          )}
        </View>
      </Modal>
    </Portal>
  )
}

export default SelectOptionsModal
