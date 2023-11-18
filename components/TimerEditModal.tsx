import { useState } from 'react'
import { View } from 'react-native'
import { Portal, Modal, Button, TextInput } from 'react-native-paper'

import { useStores } from '../db/helpers/useStores'
import { Divider } from '../designSystem'
import { HeadingLabel } from '../designSystem/Label'
import colors from '../designSystem/colors'

type Props = {
  open: boolean
  onClose: () => void
}
const TimerEditModal: React.FC<Props> = ({ open, onClose }) => {
  const { stateStore } = useStores()

  const [timerSecs, setTimerSecs] = useState(stateStore.timerDurationSecs)
  function onConfirm() {
    stateStore.setTimerDuration(timerSecs)
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
          flex: 1,
        }}
      >
        <View style={{ height: '100%' }}>
          <HeadingLabel style={{ padding: 16 }}>Timer settings</HeadingLabel>
          <Divider />
          <View style={{ flex: 1 }}>
            <TextInput
              value={`${timerSecs}`}
              onChangeText={text => setTimerSecs(Number(text))}
              placeholder="Enter timer duration..."
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
        </View>
      </Modal>
    </Portal>
  )
}

export default TimerEditModal
