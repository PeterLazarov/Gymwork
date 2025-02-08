import { observer } from 'mobx-react-lite'
import { View } from 'react-native'

import { useStores } from 'app/db/helpers/useStores'
import { Timer } from 'app/db/models/Timer'
import { translate } from 'app/i18n'
import {
  Button,
  ButtonText,
  Divider,
  DurationInput,
  fontSize,
  spacing,
  Text,
} from 'designSystem'

export type WorkoutTimerSettingsProps = {
  timer: Timer
}

const WorkoutTimerSettings: React.FC<WorkoutTimerSettingsProps> = ({
  timer,
}) => {
  const { stateStore } = useStores()
  const {
    timerStore: { workoutTimer },
  } = useStores()

  return (
    <View>
      <Text
        style={{
          fontSize: fontSize.lg,
          textAlign: 'center',
          padding: spacing.md,
        }}
      >
        {translate('workoutDuration')}
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
            <ButtonText variant="tertiary">{translate('stopTimer')}</ButtonText>
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
      </View>
    </View>
  )
}

export default observer(WorkoutTimerSettings)
