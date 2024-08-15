import { useState } from 'react'
import { View } from 'react-native'
import { Portal, Modal, Button } from 'react-native-paper'

import { useStores } from '../db/helpers/useStores'
import { Divider } from '../../designSystem'
import DurationInput from '../../designSystem/DurationInput'
import { HeadingLabel } from '../../designSystem/Label'
import colors from '../../designSystem/colors'

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
        <HeadingLabel style={{ padding: 16 }}>Edit Rest Timer</HeadingLabel>
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
            style={{ flex: 1 }}
            textColor={colors.tertiaryText}
            onPress={onClose}
          >
            Cancel
          </Button>
          <Button
            style={{ flex: 1 }}
            textColor={colors.tertiaryText}
            onPress={onConfirm}
          >
            Confirm
          </Button>
        </View>
      </Modal>
    </Portal>
  )
}

export default TimerEditModal
