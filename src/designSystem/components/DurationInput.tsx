import { Duration } from "luxon"
import { forwardRef, RefObject, useEffect, useMemo, useRef } from "react"
import { TextInput as TextInputRN, View } from "react-native"

import { durationFormats } from "@/constants/enums"
import { DurationFormat, manageInputFocus, translate } from "@/utils"
import { Timer } from "@/utils/useTimer"
import { fontSize, spacing } from "../tokens"
import { Icon } from "./Icon"
import { IconButton } from "./IconButton"
import { NumberInput } from "./NumberInput"
import { Text } from "./Text"

type Props = {
  value?: Duration
  onUpdate: (duration: Duration) => void
  format?: DurationFormat
  onSubmitEditing?: () => void
  timer?: Timer
}

const MINUTES_FORMATS = [
  durationFormats.mm,
  durationFormats.mm_ss,
  durationFormats.hh_mm_ss,
] as DurationFormat[]
const SECONDS_FORMATS = [
  durationFormats.ss,
  durationFormats.mm_ss,
  durationFormats.hh_mm_ss,
] as DurationFormat[]

export const DurationInput = forwardRef<TextInputRN, Props>(function DurationInput(
  { value, onUpdate, format = durationFormats.mm_ss, onSubmitEditing, timer },
  ref,
) {
  const showHours = format === durationFormats.hh_mm_ss
  const showMinutes = MINUTES_FORMATS.includes(format)
  const showSeconds = SECONDS_FORMATS.includes(format)

  const shifted = value?.shiftToAll().toObject() ?? {}

  const totalSeconds = value ? Math.round(value.as("seconds")) : undefined
  const totalMinutes = value ? Math.round(value.as("minutes")) : undefined

  const _input1 = useRef<TextInputRN>(null)
  const input1 = (ref ?? _input1) as RefObject<TextInputRN>
  const input2 = useRef<TextInputRN>(null)
  const input3 = useRef<TextInputRN>(null)

  const inputRefs = useMemo(() => {
    const refs = []
    if (showHours) refs.push(input1)
    if (showMinutes) refs.push(showHours ? input2 : input1)
    if (showSeconds) refs.push(showHours ? input3 : showMinutes ? input2 : input1)
    return refs
  }, [format])

  const { onHandleSubmit } = manageInputFocus(inputRefs, () => onSubmitEditing?.())

  useEffect(() => {
    if (timer?.timeElapsed) {
      onUpdate(timer?.timeElapsed)
    }
  }, [timer?.timeElapsed])

  function updateAndSyncTimer(updated: Duration) {
    onUpdate(updated)
    if (timer) {
      timer.setTimeElapsed(updated)
      timer.stop()
    }
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
      }}
    >
      {timer && (
        <View style={{ paddingLeft: 4 }}>
          {timer.isRunning ? (
            <IconButton onPress={timer.stop}>
              <Icon icon="stop" />
            </IconButton>
          ) : (
            <IconButton onPress={timer.resume}>
              <Icon icon="play" />
            </IconButton>
          )}
        </View>
      )}

      {showHours && (
        <>
          <NumberInput
            value={shifted.hours}
            style={{ textAlign: "center", flex: 1 }}
            inputMode="numeric"
            multiline={false}
            keyboardType="number-pad"
            onChange={(hours) => {
              updateAndSyncTimer(
                (value ?? Duration.fromMillis(0)).shiftToAll().set({ hours: hours ?? 0 }),
              )
            }}
            maxLength={2}
            ref={input1}
            returnKeyType="next"
            onSubmitEditing={() => onHandleSubmit(input1)}
            maxDecimals={0}
            label={translate("hours")}
          />
          <Text style={{ fontSize: fontSize.xs }}>:</Text>
        </>
      )}

      {showMinutes && (
        <>
          <NumberInput
            value={format === durationFormats.mm ? totalMinutes : shifted.minutes}
            style={{ textAlign: "center", flex: 1 }}
            inputMode="numeric"
            multiline={false}
            keyboardType="number-pad"
            onChange={(minutes) => {
              if (format === durationFormats.mm) {
                updateAndSyncTimer(Duration.fromObject({ minutes: minutes ?? 0 }))
              } else if (!minutes || minutes <= 59) {
                updateAndSyncTimer(
                  (value ?? Duration.fromMillis(0)).shiftToAll().set({ minutes: minutes ?? 0 }),
                )
              }
            }}
            maxLength={format === durationFormats.mm ? 4 : 2}
            ref={showHours ? input2 : input1}
            returnKeyType={showSeconds ? "next" : "default"}
            onSubmitEditing={() => onHandleSubmit(showHours ? input2 : input1)}
            maxDecimals={0}
            label={translate("minutes")}
          />
          {showSeconds && <Text style={{ fontSize: fontSize.xs }}>:</Text>}
        </>
      )}

      {showSeconds && (
        <NumberInput
          value={format === durationFormats.ss ? totalSeconds : shifted.seconds}
          style={{ textAlign: "center", flex: 1 }}
          inputMode="numeric"
          multiline={false}
          keyboardType="number-pad"
          onChange={(seconds) => {
            if (format === durationFormats.ss) {
              updateAndSyncTimer(Duration.fromObject({ seconds: seconds ?? 0 }))
            } else if (!seconds || seconds <= 59) {
              updateAndSyncTimer(
                (value ?? Duration.fromMillis(0)).shiftToAll().set({ seconds: seconds ?? 0 }),
              )
            }
          }}
          maxLength={format === durationFormats.ss ? 4 : 2}
          ref={showHours ? input3 : showMinutes ? input2 : input1}
          onSubmitEditing={() => onHandleSubmit(showHours ? input3 : showMinutes ? input2 : input1)}
          maxDecimals={0}
          label={translate("seconds")}
        />
      )}
    </View>
  )
})
