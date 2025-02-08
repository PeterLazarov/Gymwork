import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { View } from 'react-native'
import { Modal, Portal } from 'react-native-paper'

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
} from 'designSystem'

export type TimerEditModalProps = {
  open: boolean
  onClose: () => void
  timer: Timer
  label?: string
}
const TimerEditModal: React.FC<TimerEditModalProps> = ({
  open,
  onClose,
  timer,
  label,
}) => {
  const {
    theme: { colors, spacing },
  } = useAppTheme()

  const { setDuration, duration } = timer
  const [preferredDuration, setPreferredDuration] = useState(duration)

  function onConfirm() {
    setDuration(preferredDuration)
    onClose()
  }

  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: colors.surface,
          marginVertical: spacing.sm,
          marginHorizontal: spacing.md,
        }}
      >
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
        <View style={{ flexDirection: 'row' }}>
          <Button
            variant="tertiary"
            style={{ flex: 1 }}
            onPress={onClose}
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
      </Modal>
    </Portal>
  )
}

export default observer(TimerEditModal)
