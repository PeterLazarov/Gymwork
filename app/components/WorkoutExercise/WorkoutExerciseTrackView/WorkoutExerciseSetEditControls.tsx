import React, { useRef } from 'react'
import { TextInput, View } from 'react-native'
import SetEditPanelSection from './SetEditPanelSection'
import { Exercise, WorkoutSetTrackData } from 'app/db/models'
import { translate } from 'app/i18n'
import {
  DistanceEditor,
  DurationInput,
  IncrementNumericEditor,
} from 'designSystem'
import manageInputFocus from 'app/utils/inputFocus'
import convert from 'convert-units'

type Props = {
  value: WorkoutSetTrackData
  onChange(data: WorkoutSetTrackData): void
  onSubmit(): void
  openedExercise: Exercise
}

const WorkoutExerciseSetEditControls: React.FC<Props> = ({
  onChange,
  value,
  onSubmit,
  openedExercise,
}) => {
  // TODO add more input options
  const input1 = useRef<TextInput>(null)
  const input2 = useRef<TextInput>(null)
  const input3 = useRef<TextInput>(null)
  const input4 = useRef<TextInput>(null)
  const inputRefs = [input1, input2, input3, input4]
  const { onHandleSubmit, isLastInput } = manageInputFocus(inputRefs, onSubmit)

  return (
    <>
      <View style={{ gap: 16, padding: 16 }}>
        {openedExercise?.hasRepMeasument && (
          <SetEditPanelSection text={translate('reps')}>
            <IncrementNumericEditor
              value={value.reps}
              onChange={reps => onChange({ ...value, reps })}
              onSubmit={() => onHandleSubmit(input1)}
              ref={input1}
              returnKeyType={isLastInput(input1) ? 'default' : 'next'}
            />
          </SetEditPanelSection>
        )}

        {openedExercise!.hasWeightMeasument && (
          <SetEditPanelSection text={translate('weight')}>
            {/* Works in KG */}
            <IncrementNumericEditor
              value={convert(value.weightUg!)
                .from('mcg')
                .to(openedExercise!.measurements.weight?.unit!)}
              onChange={weight =>
                onChange({
                  ...value,
                  weightUg: convert(weight).from('kg').to('mcg'),
                })
              }
              step={openedExercise!.measurements.weight?.step!}
              onSubmit={() => onHandleSubmit(input2)}
              ref={input2}
              returnKeyType={isLastInput(input2) ? 'default' : 'next'}
            />
          </SetEditPanelSection>
        )}

        {openedExercise!.hasDistanceMeasument && (
          <SetEditPanelSection text={translate('distance')}>
            <DistanceEditor
              value={convert(value.distanceMm)
                .from('mm')
                .to(openedExercise.measurements.distance?.unit!)}
              onChange={distanceMm => onChange({ ...value, distanceMm })}
              unit={openedExercise!.measurements.distance?.unit!}
              // TODO REDO
              // onUnitChange={distanceUnit =>
              //   onChange({ ...value, distanceUnit })
              // }
              onSubmitEditing={() => onHandleSubmit(input3)}
              ref={input3}
              returnKeyType={isLastInput(input3) ? 'default' : 'next'}
            />
          </SetEditPanelSection>
        )}

        {openedExercise!.hasTimeMeasument && (
          <SetEditPanelSection text={translate('time')}>
            <DurationInput
              valueSeconds={convert(value.durationMs).from('ms').to('s')}
              onUpdate={durationMs => onChange({ ...value, durationMs })}
              onSubmitEditing={() => onHandleSubmit(input4)}
              ref={input4}
            />
          </SetEditPanelSection>
        )}
      </View>
    </>
  )
}

export default WorkoutExerciseSetEditControls
