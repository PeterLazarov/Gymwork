import { useState } from 'react'
import { View, Text } from 'react-native'
import { Portal, Modal } from 'react-native-paper'

import {
  Button,
  ButtonText,
  Divider,
  DurationInput,
  colors,
  fontSize,
} from 'designSystem'
import { translate } from 'app/i18n'
import useTimer from 'app/db/stores/useTimer'
import { Duration } from 'luxon'

type Props = {
  open: boolean
  onClose: () => void
}
const TimerEditModal: React.FC<Props> = ({ open, onClose }) => {
  const { setDuration, duration } = useTimer()

  const [timerSecs, setTimerSecs] = useState(duration.as('seconds'))

  function onConfirm() {
    setDuration(Duration.fromDurationLike({ seconds: timerSecs }))
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
