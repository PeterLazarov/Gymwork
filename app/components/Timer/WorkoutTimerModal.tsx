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
  spacing,
} from 'designSystem'
import { translate } from 'app/i18n'
import { observer } from 'mobx-react-lite'
import { Timer } from 'app/db/models/Timer'
import { useStores } from 'app/db/helpers/useStores'

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
}) => {
  const { stateStore } = useStores()

  const colors = useColors()

  const {
    timerStore: { workoutTimer },
  } = useStores()

  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: colors.surface,
          marginVertical: spacing.xs,
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
          {'Workout Duration'}
        </Text>
        <Divider
          orientation="horizontal"
          variant="primary"
        />

        <View style={{ flexGrow: 1, padding: spacing.xs }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {/* TODO? onFocus pause updates for easy edit */}
            <DurationInput
              value={workoutTimer.timeElapsed}
              onUpdate={time => {
                stateStore.openedWorkout?.setProp('durationMs', time.toMillis())
                workoutTimer.setTimeElapsed(time)
              }}
            />
          </View>

          {/* <SettingsToggleItem
            enabled={timerStore.workoutTimerStartOnFirstSet}
            onToggle={() =>
              timerStore.setProp(
                'workoutTimerStartOnFirstSet',
                !timerStore.workoutTimerStartOnFirstSet
              )
            }
          >
            Start timer on first set
          </SettingsToggleItem> */}

          {/* TODO add workoutTimerEndWorkoutDelayMs config */}
          {/* 
          <SettingsToggleItem
            enabled={timerStore.workoutTimerSnapEndToLastSet}
            onToggle={() =>
              timerStore.setProp(
                'workoutTimerSnapEndToLastSet',
                !timerStore.workoutTimerSnapEndToLastSet
              )
            }
          >
            End workout X min after last set
          </SettingsToggleItem> */}
        </View>

        <View style={{ flexDirection: 'row' }}>
          {timer.isRunning ? (
            <Button
              variant="tertiary"
              style={{ flex: 1 }}
              onPress={() => {
                // TODO revisit for historical workouts
                timer.stop()
                if (stateStore.openedWorkout) {
                  stateStore.openedWorkout.setProp('endedAt', new Date())
                }
              }}
            >
              <ButtonText variant="tertiary">
                {translate('stopTimer')}
              </ButtonText>
            </Button>
          ) : (
            <Button
              variant="tertiary"
              style={{ flex: 1 }}
              onPress={timer.resume}
            >
              <ButtonText variant="tertiary">
                {translate('startTimer')}
              </ButtonText>
            </Button>
          )}

          <Button
            variant="tertiary"
            style={{ flex: 1 }}
            onPress={onClose}
          >
            <ButtonText variant="tertiary">{translate('close')}</ButtonText>
          </Button>
        </View>
      </Modal>
    </Portal>
  )
}

export default observer(WorkoutTimerModal)
