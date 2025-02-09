import React, { forwardRef } from 'react'
import { ScrollView, View } from 'react-native'
import { TrueSheet, TrueSheetProps } from '@lodev09/react-native-true-sheet'

import { useAppTheme } from '@/utils/useAppTheme'
import { translate } from 'app/i18n'
import {
  Button,
  ButtonText,
  Divider,
  fontSize,
  spacing,
  Text,
} from 'designSystem'

import OptionListItem from './OptionListItem'
import { SelectOption } from './types'

type SelectOptionsSheetProps<T = unknown> = TrueSheetProps & {
  header?: string
  options: readonly SelectOption<T>[]
  selectedValues: T[]
  onOptionSelect: (option: SelectOption<T>) => void
  hideButton?: boolean
}

const SelectOptionsSheet = forwardRef<TrueSheet, SelectOptionsSheetProps>(
  (
    {
      header = 'Select an option', // TODO i18n
      options,
      selectedValues,
      onOptionSelect,
      hideButton,
      ...rest
    },
    sheetRef
  ) => {
    const {
      theme: { colors },
    } = useAppTheme()

    const listItemHeight = 55

    return (
      <TrueSheet
        ref={sheetRef}
        sizes={['large']}
        blurTint="default"
        backgroundColor={colors.surfaceContainerLowest}
        contentContainerStyle={{ paddingBottom: 48 }}
        FooterComponent={() =>
          !hideButton ? (
            <View style={{ flexDirection: 'row', height: 48 }}>
              <Button
                variant="primary"
                style={{ flex: 1 }}
                onPress={() => {
                  sheetRef.current?.dismiss()
                }}
              >
                <ButtonText variant="primary">{translate('done')}</ButtonText>
              </Button>
            </View>
          ) : null
        }
        {...rest}
      >
        <View style={{ height: '100%' }}>
          <Text
            style={{
              fontSize: fontSize.lg,
              textAlign: 'center',
              padding: spacing.md,
            }}
          >
            {header}
          </Text>
          <Divider
            orientation="horizontal"
            variant="primary"
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
                  height={listItemHeight}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </TrueSheet>
    )
  }
)

export default SelectOptionsSheet
