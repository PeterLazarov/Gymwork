import { Duration } from "luxon"
import { forwardRef, useEffect, useMemo, useState } from "react"
import { TextInput, View } from "react-native"
import { AnimatedCircularProgress } from "react-native-circular-progress"

import {
  Button,
  Divider,
  DurationInput,
  fontSize,
  Icon,
  IconButton,
  NumberInput,
  spacing,
  Text,
  useColors,
} from "@/designSystem"
import { Timer, translate, useTimer } from "@/utils"
import { Modal, Portal } from "react-native-paper"

export type RestInputProps = {
  value?: Duration
  onChange(duration: Duration): void
  onSubmit?: () => void
}

export const RestInput = forwardRef<TextInput, RestInputProps>(function RestInput(
  { value, onChange, onSubmit },
  ref,
) {
  const colors = useColors()

  const timer = useTimer()

  const percentTimeLeft = useMemo(() => {
    if (!timer) return 0

    if (timer.duration.toMillis() === 0) {
      return 0
    }

    const percentage = Math.min(timer.timeElapsed.toMillis() / timer.duration.toMillis(), 1) * 100

    return percentage
  }, [timer?.duration, timer?.timeElapsed])

  const [settingDialogOpen, setSettingDialogOpen] = useState(false)

  function onSettingsPress() {
    setSettingDialogOpen(true)
  }

  function onResume() {
    if (!timer) return

    if (timer.type !== "rest") {
      timer?.setTimeElapsed(value ?? Duration.fromMillis(0))
      timer.setProp("type", "rest")
    }
    timer.resume()
  }

  // Recompute the timer state to force a rerender
  useMemo(() => timer?.isRunning, [timer?.isRunning])

  useEffect(() => {
    if (timer?.type === "rest") {
      onChange(timer.timeElapsed)
    }
  }, [timer?.timeElapsed, timer?.type])

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: spacing.xxs,
        }}
      >
        {timer && (
          <AnimatedCircularProgress
            size={40}
            width={2}
            fill={percentTimeLeft}
            rotation={0}
            tintColor={colors.primary}
          >
            {() => (
              <View>
                {timer.type === "rest" && timer.isRunning ? (
                  <IconButton onPress={timer.stop}>
                    <Icon icon="stop" />
                  </IconButton>
                ) : (
                  <IconButton onPress={onResume}>
                    <Icon icon="play" />
                  </IconButton>
                )}
              </View>
            )}
          </AnimatedCircularProgress>
        )}

        <NumberInput
          dense
          style={{ flexGrow: 1, textAlign: "center" }}
          value={value ? Math.round(value.as("seconds") ?? 0) : undefined}
          onChange={(seconds) => {
            const duration = Duration.fromDurationLike({ seconds })
            if (timer?.type === "rest") {
              timer?.stop()
              timer?.setTimeElapsed(duration)
            }
            onChange(duration)
          }}
          ref={ref}
          onSubmitEditing={onSubmit}
        />

        {timer && (
          <IconButton
            onPress={onSettingsPress}
            style={{ width: 48, aspectRatio: 1 }}
          >
            <Icon icon="settings-outline" />
          </IconButton>
        )}
      </View>
      {timer && (
        <TimerEditModal
          open={settingDialogOpen}
          onClose={() => {
            setSettingDialogOpen(false)
          }}
          timer={timer}
        />
      )}
    </>
  )
})

type TimerEditModalProps = {
  open: boolean
  onClose: () => void
  timer: Timer
  label?: string
}
const TimerEditModal: React.FC<TimerEditModalProps> = ({ open, onClose, timer, label }) => {
  const colors = useColors()

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
            textAlign: "center",
            padding: spacing.md,
          }}
        >
          {label ?? translate("editRestTimer")}
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
        <View style={{ flexDirection: "row" }}>
          <Button
            variant="tertiary"
            style={{ flex: 1 }}
            onPress={onClose}
            text={translate("cancel")}
          />
          <Button
            variant="tertiary"
            style={{ flex: 1 }}
            onPress={onConfirm}
            text={translate("confirm")}
          />
        </View>
      </Modal>
    </Portal>
  )
}
