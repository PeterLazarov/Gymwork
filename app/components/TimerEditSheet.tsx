import { TrueSheet, TrueSheetProps } from '@lodev09/react-native-true-sheet'
import { observer } from 'mobx-react-lite'
import { forwardRef, useState } from 'react'
import { View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { Timer } from 'app/db/models/Timer'
import { translate } from 'app/i18n'
import {
  Button,
  ButtonText,
  Divider,
  DurationInput,
  fontSize,
  Text,
  spacing,
} from 'designSystem'

export interface TimerEditSheetProps extends TrueSheetProps {
  timer: Timer
  label?: string
}

const TimerEditSheet = forwardRef<TrueSheet, TimerEditSheetProps>(
  ({ timer, label, ...rest }, sheetRef) => {
    const {
      theme: { colors },
    } = useAppTheme()

    const { setDuration, duration } = timer
    const [preferredDuration, setPreferredDuration] = useState(duration)

    function onConfirm() {
      setDuration(preferredDuration)
      sheetRef.current?.dismiss()
    }

    return (
      <TrueSheet
        ref={sheetRef}
        sizes={['small']}
        blurTint="default"
        backgroundColor={colors.surface}
        contentContainerStyle={{ paddingBottom: 48 }}
        FooterComponent={() => (
          <View style={{ flexDirection: 'row', height: 48 }}>
            <Button
              variant="tertiary"
              style={{ flex: 1 }}
              onPress={() => {
                sheetRef.current?.dismiss()
              }}
            >
              <ButtonText variant="tertiary">{translate('cancel')}</ButtonText>
            </Button>
            <Button
              variant="tertiary"
              style={{ flex: 1 }}
              onPress={onConfirm}
            >
              <ButtonText variant="tertiary">{translate('confirm')}</ButtonText>
            </Button>
          </View>
        )}
        {...rest}
      >
        <View>
          <Text
            style={{
              fontSize: fontSize.lg,
              textAlign: 'center',
              padding: spacing.md,
            }}
          >
            {label ?? translate('editRestTimer')}
          </Text>
          <Divider
            orientation="horizontal"
            variant="primary"
          />
          <View style={{ padding: spacing.md }}>
            <DurationInput
              value={preferredDuration}
              onUpdate={setPreferredDuration}
              hideHours
            />
          </View>
        </View>
      </TrueSheet>
    )
  }
)

export default observer(TimerEditSheet)
