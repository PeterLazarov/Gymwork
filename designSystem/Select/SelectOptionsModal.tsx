import React from 'react'
import { ScrollView, View, Dimensions, Text } from 'react-native'
import { Portal, Modal } from 'react-native-paper'

import { translate } from 'app/i18n'
import { Button, ButtonText, Divider, colors, fontSize } from 'designSystem'
import { SelectOption } from './types'
import OptionListItem from './OptionListItem'

type Props = {
  header?: string
  open: boolean
  onClose: () => void
  options: readonly SelectOption[]
  selectedValues: string[]
  onOptionSelect: (option: SelectOption) => void
  hideButton?: boolean
}
const SelectOptionsModal: React.FC<Props> = ({
  header = 'Select an option',
  open,
  onClose,
  options,
  selectedValues,
  onOptionSelect,
  hideButton,
}) => {
  const maxHeight = Dimensions.get('screen').height - 100
  const itemHeight = 53
  const modalHeight = (options.length + (hideButton ? 1 : 2)) * itemHeight

  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: colors.white,
          marginVertical: 8,
          marginHorizontal: 20,
          maxHeight: maxHeight,
        }}
      >
        <View
          style={{
            height: modalHeight,
            maxHeight: maxHeight,
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
          <Divider orientation="horizontal" />
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
            <>
              <Divider orientation="horizontal" />
              <View style={{ flexDirection: 'row' }}>
                <Button
                  variant="primary"
                  style={{ flex: 1 }}
                  onPress={onClose}
                >
                  <ButtonText variant="primary">{translate('done')}</ButtonText>
                </Button>
              </View>
            </>
          )}
        </View>
      </Modal>
    </Portal>
  )
}

export default SelectOptionsModal
