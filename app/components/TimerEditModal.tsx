import { useState } from 'react'
import { View } from 'react-native'
import { Portal, Modal } from 'react-native-paper'

import { useStores } from 'app/db/helpers/useStores'
import {
  Button,
  ButtonText,
  Divider,
  DurationInput,
  HeadingLabel,
  colors,
} from 'designSystem'
import { translate } from 'app/i18n'

type Props = {
  open: boolean
  onClose: () => void
}
const TimerEditModal: React.FC<Props> = ({ open, onClose }) => {
  const { stateStore, timeStore } = useStores()

  const [timerSecs, setTimerSecs] = useState(stateStore.timerDurationSecs)
  function onConfirm() {
    stateStore.setTimerDuration(timerSecs)
    timeStore.stopTimer()
    onClose()
  }

  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: colors.white,
          marginVertical: 8,
          marginHorizontal: 20,
        }}
      >
        <HeadingLabel style={{ padding: 16 }}>
          {translate('editRestTimer')}
        </HeadingLabel>
        <Divider orientation="horizontal" />
        <View style={{ paddingVertical: 16 }}>
          <DurationInput
            valueSeconds={timerSecs}
            onUpdate={setTimerSecs}
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

export default TimerEditModal
