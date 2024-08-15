import React from 'react'
import { ScrollView, View, TouchableOpacity } from 'react-native'
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
}
const CalendarWorkoutModal: React.FC<Props> = ({
  header = 'Select an option',
  open,
  onClose,
  options,
  selectedOptions,
  onOptionSelect,
}) => {
  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: colors.white,
          marginVertical: 8,
          marginHorizontal: 20,
          flex: 1,
        }}
      >
        <View style={{ height: '100%' }}>
          <HeadingLabel style={{ padding: 16 }}>{header}</HeadingLabel>
          <Divider orientation="horizontal" />
          <View style={{ flex: 1 }}>
            <ScrollView>
              {options.map((option, index) => (
                <>
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
                        color:
                          selectedOptions.indexOf(option) !== -1
                            ? colors.primary
                            : colors.secondaryText,
                      }}
                    >
                      {option}
                    </BodyLargeLabel>
                  </TouchableOpacity>
                </>
              ))}
            </ScrollView>
          </View>
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
        </View>
      </Modal>
    </Portal>
  )
}

export default CalendarWorkoutModal
