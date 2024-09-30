import { useMemo, useState } from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { Portal, Modal } from 'react-native-paper'

import {
  Text,
  Button,
  ButtonText,
  Divider,
  DurationInput,
  useColors,
  fontSize,
  ToggleSwitch,
} from 'designSystem'
import { translate } from 'app/i18n'
import { observer } from 'mobx-react-lite'
import { Timer } from 'app/db/models/Timer'
import { useStores } from 'app/db/helpers/useStores'
import SettingsToggledItem from '../SettingsToggleItem'

export type WorkoutTimerModalProps = {
  open: boolean
  onClose: () => void
  timer: Timer
  label?: string
}

// TODO i18n
const WorkoutTimerModal: React.FC<WorkoutTimerModalProps> = ({
  open,
  onClose,
  timer,
  label,
}) => {
  const { settingsStore, navStore, timerStore } = useStores()

  const colors = useColors()
  const styles = useMemo(() => makeStyles(colors), [colors])

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
          {'Workout Timer TODO'}
        </Text>
        <Divider
          orientation="horizontal"
          variant="primary"
        />
        {/*  */}

        <View style={{ flexGrow: 1, padding: 8 }}>
          <SettingsToggledItem
            enabled={timerStore.workoutTimerStartOnFirstSet}
            onToggle={() =>
              timerStore.setProp(
                'workoutTimerStartOnFirstSet',
                !timerStore.workoutTimerStartOnFirstSet
              )
            }
          >
            Start timer on first set
          </SettingsToggledItem>

          {/* TODO add workoutTimerEndWorkoutDelayMs config */}

          <SettingsToggledItem
            enabled={timerStore.workoutTimerSnapEndToLastSet}
            onToggle={() =>
              timerStore.setProp(
                'workoutTimerSnapEndToLastSet',
                !timerStore.workoutTimerSnapEndToLastSet
              )
            }
          >
            Snap workout end to last set
          </SettingsToggledItem>
        </View>

        {/*  */}
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

const makeStyles = (colors: any) =>
  StyleSheet.create({
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 64,
      padding: 12,
      gap: 10,
    },
    itemLabel: {
      color: colors.onSurface,
    },
  })

export default observer(WorkoutTimerModal)
