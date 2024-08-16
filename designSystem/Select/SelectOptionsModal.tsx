import React, { Fragment } from 'react'
import { ScrollView, View, TouchableOpacity, Dimensions } from 'react-native'
import { Portal, Modal } from 'react-native-paper'

import {
  BodyLargeLabel,
  Button,
  ButtonText,
  Divider,
  HeadingLabel,
  colors,
} from '..'

type Option = string
type Props = {
  header?: string
  open: boolean
  onClose: () => void
  options: Option[]
  selectedOptions: Option[]
  onOptionSelect: (option: string) => void
  hideButton?: boolean
}
const SelectOptionsModal: React.FC<Props> = ({
  header = 'Select an option',
  open,
  onClose,
  options,
  selectedOptions,
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
                <Fragment key={option}>
                  {index !== 0 && (
                    <Divider
                      orientation="horizontal"
                      style={{ backgroundColor: colors.secondary }}
                    />
                  )}
                  <TouchableOpacity
                    style={{ paddingHorizontal: 10, paddingVertical: 15 }}
                    onPress={() => onOptionSelect(option)}
                  >
                    <BodyLargeLabel
                      style={{
                        color: selectedOptions.includes(option)
                          ? colors.primary
                          : colors.secondaryText,
                      }}
                    >
                      {option}
                    </BodyLargeLabel>
                  </TouchableOpacity>
                </Fragment>
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
