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
  Modal,
  NumberInput,
  spacing,
  Text,
  useColors,
} from "@/designSystem"
import { translate } from "@/utils"
import { useTimerContext } from "@/context/TimerContext"

export type RestInputProps = {
  value: number
  onChange(duration: Duration): void
  onSubmit?: () => void
}

export const RestInput = forwardRef<TextInput, RestInputProps>(function RestInput(
  { value, onChange, onSubmit },
  ref,
) {
  const colors = useColors()
  const timer = useTimerContext()
  const restDuration = Duration.fromMillis(value)

  const percentTimeLeft = useMemo(() => {
    if (!timer) return 0

    if (timer.timeLimit!.toMillis() === 0) {
      return 0
    }

    const percentage =
      Math.min(timer.timeElapsed!.toMillis() / timer.timeLimit!.toMillis(), 1) * 100

    return percentage
  }, [timer?.timeLimit, timer?.timeElapsed])

  const [settingDialogOpen, setSettingDialogOpen] = useState(false)

  function onSettingsPress() {
    setSettingDialogOpen(true)
  }

  useMemo(() => timer?.isRunning, [timer?.isRunning])

  useEffect(() => {
    onChange(timer.timeElapsed!)
  }, [timer?.timeElapsed])

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
                {timer.isRunning ? (
                  <IconButton onPress={timer.stop}>
                    <Icon icon="stop" />
                  </IconButton>
                ) : (
                  <IconButton onPress={() => timer.start?.(restDuration)}>
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
          value={Math.round(restDuration.as("seconds") ?? 0)}
          onChange={(seconds) => {
            const duration = Duration.fromDurationLike({ seconds })
            timer.stop?.()
            timer.setTimeElapsed?.(duration)
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
        />
      )}
    </>
  )
})

type TimerEditModalProps = {
  open: boolean
  onClose: () => void
  label?: string
}
const TimerEditModal: React.FC<TimerEditModalProps> = ({ open, onClose, label }) => {
  const colors = useColors()
  const { setTimeLimit, timeLimit } = useTimerContext()

  const [preferredRestDuration, setPreferredRestDuration] = useState(timeLimit)

  function onConfirm() {
    setTimeLimit?.(preferredRestDuration!)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      containerStyle={{ justifyContent: "center" }}
    >
      <View
        style={{
          backgroundColor: colors.surface,
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
            value={preferredRestDuration}
            onUpdate={setPreferredRestDuration}
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
      </View>
    </Modal>
  )
}
