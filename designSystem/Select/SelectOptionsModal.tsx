import React from 'react'
import { ScrollView, View, Dimensions } from 'react-native'
import { Portal, Modal } from 'react-native-paper'

import { Button, ButtonText, Divider, HeadingLabel, colors } from 'designSystem'
import { SelectOption } from './types'
import OptionListItem from './OptionListItem'

type Props = {
  header?: string
  open: boolean
  onClose: () => void
  options: SelectOption[]
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
  const modalHeight = (options.length + 1) * itemHeight

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
          <HeadingLabel style={{ padding: 16 }}>{header}</HeadingLabel>
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
                  <ButtonText variant="primary">Done</ButtonText>
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
