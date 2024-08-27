import React, { useRef } from 'react'
import { TextInput, View } from 'react-native'
import SetEditPanelSection from './SetEditPanelSection'
import { WorkoutSet } from 'app/db/models'
import { translate } from 'app/i18n'
import {
  DistanceEditor,
  DurationInput,
  IncrementNumericEditor,
} from 'designSystem'
import manageInputFocus from 'app/utils/inputFocus'
import convert from 'convert-units'
import { observer } from 'mobx-react-lite'
import Timer from 'app/components/Timer/Timer'

type Props = {
  value: WorkoutSet
  onSubmit(): void
}

const WorkoutExerciseSetEditControls: React.FC<Props> = ({
  value,
  onSubmit,
}) => {
  // TODO add more input options
  const input0 = useRef<TextInput>(null)
  const input1 = useRef<TextInput>(null)
  const input2 = useRef<TextInput>(null)
  const input3 = useRef<TextInput>(null)
  const input4 = useRef<TextInput>(null)
  const inputRefs = [input1, input2, input3, input4]
  const { onHandleSubmit, isLastInput } = manageInputFocus(inputRefs, onSubmit)

  return (
    <View style={{ gap: 8 }}>
      {value.exercise?.measurements.rest && (
        <>
          <SetEditPanelSection text={translate('rest')}>
            <Timer ref={input0} />
          </SetEditPanelSection>
        </>
      )}

      {value.exercise?.hasRepMeasument && (
        <SetEditPanelSection text={translate('reps')}>
          <IncrementNumericEditor
            value={value.reps}
            onChange={reps => value.setProp('reps', reps)}
            onSubmit={() => onHandleSubmit(input1)}
            ref={input1}
            returnKeyType={isLastInput(input1) ? 'default' : 'next'}
          />
        </SetEditPanelSection>
      )}

      {value.exercise!.hasWeightMeasument && (
        <SetEditPanelSection text={translate('weight')}>
          {/* Works in KG */}
          <IncrementNumericEditor
            value={value.weight}
            onChange={weight => value.setWeight(weight)}
            step={value.exercise!.measurements.weight?.step!}
            onSubmit={() => onHandleSubmit(input2)}
            ref={input2}
            returnKeyType={isLastInput(input2) ? 'default' : 'next'}
          />
        </SetEditPanelSection>
      )}

      {value.exercise!.hasDistanceMeasument && (
        <SetEditPanelSection text={translate('distance')}>
          <DistanceEditor
            value={value.distance}
            onChange={distance => value.setDistance(distance)}
            unit={value.exercise!.measurements.distance?.unit!}
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

      {value.exercise!.hasTimeMeasument && (
        <SetEditPanelSection text={translate('duration')}>
          <DurationInput
            valueSeconds={convert(value.durationMs).from('ms').to('s')}
            onUpdate={durationSeconds =>
              value.setDuration(durationSeconds, 's')
            }
            onSubmitEditing={() => onHandleSubmit(input4)}
            ref={input4}
          />
        </SetEditPanelSection>
      )}
    </View>
  )
}

export default observer(WorkoutExerciseSetEditControls)
