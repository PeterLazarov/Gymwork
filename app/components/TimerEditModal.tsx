import { useState } from 'react'
import { View } from 'react-native'
import { Portal, Modal } from 'react-native-paper'

import {
  Text,
  Button,
  ButtonText,
  Divider,
  DurationInput,
  useColors,
  fontSize,
} from 'designSystem'
import { translate } from 'app/i18n'
import { observer } from 'mobx-react-lite'
import { useStores } from 'app/db/helpers/useStores'
import { restTimerKey } from 'app/db/stores/TimerStore'

type Props = {
  open: boolean
  onClose: () => void
}
const TimerEditModal: React.FC<Props> = ({ open, onClose }) => {
  const colors = useColors()

  const { timerStore } = useStores()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { setDuration, duration } = timerStore.timers.get(restTimerKey)!

  // TODO explore MST-Utils createViewModel?
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
          marginVertical: 8,
          marginHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontSize: fontSize.lg,
            textAlign: 'center',
            padding: 16,
          }}
        >
          {translate('editRestTimer')}
        </Text>
        <Divider
          orientation="horizontal"
          variant="primary"
        />
        <View style={{ padding: 16 }}>
          <DurationInput
            value={preferredDuration}
            onUpdate={setPreferredDuration}
            hideHours
            hideTimer
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
