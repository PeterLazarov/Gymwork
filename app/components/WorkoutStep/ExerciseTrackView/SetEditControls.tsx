import { Duration } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { useRef } from 'react'
import { TextInput, View } from 'react-native'

import RestInput from 'app/components/RestInput'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutSet } from 'app/db/models'
import { Timer } from 'app/db/models/Timer'
import { translate } from 'app/i18n'
import {
  DistanceEditor,
  DurationInput,
  IncrementNumericEditor,
  manageInputFocus,
} from 'designSystem'
import { spacing } from 'designSystem/theme/spacing'

import SetEditPanelSection from './SetEditPanelSection'

export type SetEditControlsProps = {
  value: WorkoutSet
  onSubmit(): void
  timer?: Timer
}

const SetEditControls: React.FC<SetEditControlsProps> = ({
  value,
  onSubmit,
  timer,
}) => {
  // TODO add more input options
  const input0 = useRef<TextInput>(null)
  const input1 = useRef<TextInput>(null)
  const input2 = useRef<TextInput>(null)
  const input3 = useRef<TextInput>(null)
  const input4 = useRef<TextInput>(null)
  const input5 = useRef<TextInput>(null)
  const inputRefs = [input1, input2, input3, input4, input5]
  const { onHandleSubmit, isLastInput } = manageInputFocus(inputRefs, onSubmit)
  const { settingsStore } = useStores()

  return (
    <View style={{ gap: spacing.xs }}>
      {settingsStore.measureRest && (
        <SetEditPanelSection text={translate('rest')}>
          <RestInput
            ref={input0}
            value={value.restMs ? Duration.fromMillis(value.restMs) : undefined}
            onSubmit={() => onHandleSubmit(input0)}
            onChange={rest => value.setRest(rest.as('milliseconds'), 'ms')}
            timer={timer}
          />
        </SetEditPanelSection>
      )}

      {value.exercise?.measurements.reps && (
        <SetEditPanelSection text={translate('reps')}>
          <IncrementNumericEditor
            value={value.reps}
            onChange={reps => value.setProp('reps', reps)}
            onSubmit={() => onHandleSubmit(input1)}
            ref={input1}
            returnKeyType={isLastInput(input1) ? 'default' : 'next'}
            maxDecimals={0}
          />
        </SetEditPanelSection>
      )}

      {value.exercise!.measurements.weight && (
        <SetEditPanelSection text={translate('weight')}>
          {/* Works in KG */}
          <IncrementNumericEditor
            value={value.weight}
            onChange={weight => value.setWeight(weight)}
            step={value.exercise!.measurements.weight!.step}
            onSubmit={() => onHandleSubmit(input2)}
            ref={input2}
            returnKeyType={isLastInput(input2) ? 'default' : 'next'}
          />
        </SetEditPanelSection>
      )}

      {value.exercise!.measurements.distance && (
        <SetEditPanelSection text={translate('distance')}>
          <DistanceEditor
            value={value.distance}
            onChange={distance => value.setDistance(distance)}
            unit={value.exercise!.measurements.distance!.unit}
            onSubmitEditing={() => onHandleSubmit(input3)}
            ref={input3}
            returnKeyType={isLastInput(input3) ? 'default' : 'next'}
          />
        </SetEditPanelSection>
      )}

      {value.exercise!.measurements.duration && (
        <SetEditPanelSection text={translate('duration')}>
          <DurationInput
            value={
              value.durationMs
                ? Duration.fromMillis(value.durationMs)
                : undefined
            }
            onUpdate={duration => value.setDuration(duration.toMillis(), 'ms')}
            onSubmitEditing={() => onHandleSubmit(input4)}
            timer={timer}
            ref={input4}
          />
        </SetEditPanelSection>
      )}

      {value.exercise!.measurements.speed && (
        <SetEditPanelSection text={translate('speed')}>
          <IncrementNumericEditor
            value={value.speed}
            onChange={speed => value.setProp('speedKph', speed)}
            onSubmit={() => onHandleSubmit(input5)}
            ref={input5}
            returnKeyType={isLastInput(input1) ? 'default' : 'next'}
            maxDecimals={2}
            label={value.exercise.measurements.speed.unit}
            placeholder={
              !value.speed && value.inferredSpeed
                ? String(value.inferredSpeed.toFixed(2))
                : undefined
            }
          />
        </SetEditPanelSection>
      )}
    </View>
  )
}

export default observer(SetEditControls)
