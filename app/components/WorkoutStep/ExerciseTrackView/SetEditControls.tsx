import React, { useRef, useState } from 'react'
import {
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import SetEditPanelSection from './SetEditPanelSection'
import { WorkoutSet } from 'app/db/models'
import { translate } from 'app/i18n'
import {
  Button,
  ButtonText,
  DistanceEditor,
  DurationInput,
  IncrementNumericEditor,
  manageInputFocus,
  Text,
} from 'designSystem'
import { observer } from 'mobx-react-lite'
import RestInput from 'app/components/RestInput'
import { useStores } from 'app/db/helpers/useStores'
import { Duration } from 'luxon'
import { Timer } from 'app/db/models/Timer'
import { SelectOption } from 'designSystem/Select'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'

export type SetEditControlsProps = {
  value: WorkoutSet
  onSubmit(): void
  timer?: Timer
}

const optsPerRow = 3
const weightOptions = Array.from({ length: 200 }, (_, i) => ({
  value: i * 2.5,
  label: String(i * 2.5),
})).reduce(
  (acc, curr, i) => {
    const lastRow = acc.at(-1)!
    if (lastRow.length === optsPerRow) {
      acc.push([curr])
    } else {
      lastRow.push(curr)
    }
    return acc
  },
  [[]] as Array<SelectOption<number>[]>
)

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
  const { settingsStore, stateStore } = useStores()

  const [showWeightSelectModal, setShowWeightSelectModal] = useState(false)
  // function openWeightSelect() { }
  // const weightOptions = useMemo(() => {
  //   const step = stateStore.focusedExercise?.measurements.weight?.step ?? 1

  //   return Array.from({ length: 200 }, (_, i) => ({
  //     value: i * step,
  //     label: String(i * step),
  //   }))
  // }, [stateStore.focusedExercise?.measurements.weight?.step])

  return (
    <View style={{ gap: 8 }}>
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

      {value.exercise?.hasRepMeasument && (
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

      {value.exercise!.hasWeightMeasument && (
        <SetEditPanelSection text={translate('weight')}>
          {/* Works in KG */}
          {/* <IncrementNumericEditor
              value={value.weight}
              onChange={weight => value.setWeight(weight)}
              step={value.exercise!.measurements.weight!.step}
              onSubmit={() => onHandleSubmit(input2)}
              ref={input2}
              returnKeyType={isLastInput(input2) ? 'default' : 'next'}
            /> */}

          {/* <Select
            options={weightOptions}
            value={value.weight ?? 0}
            onChange={weight => value.setWeight(weight)}
            headerText={'Weight'}
            label={'Weight'}
          /> */}

          <Button
            variant="primary"
            onPress={() => {
              setShowWeightSelectModal(true)
            }}
          >
            <ButtonText variant="primary">Open Modal</ButtonText>
          </Button>

          <Modal
            visible={showWeightSelectModal}
            onDismiss={() => {
              setShowWeightSelectModal(false)
            }}
          >
            <SafeAreaInsetsContext.Consumer>
              {insets => (
                <FlatList
                  style={{
                    flex: 1,
                    marginBottom:
                      insets && insets.bottom > 0 ? insets.bottom : 0,
                    marginTop: insets && insets.top > 0 ? insets.top : 0,
                  }}
                  initialScrollIndex={weightOptions.findIndex(opts =>
                    opts.some(opt => opt?.value === value.weight)
                  )}
                  getItemLayout={(data, index) => ({
                    length: 64,
                    offset: 64 * index,
                    index,
                  })}
                  data={weightOptions}
                  renderItem={({ index, item, separators }) => {
                    return (
                      <View style={{ flexDirection: 'row' }}>
                        {item.map(_opt => {
                          const opt =
                            typeof _opt === 'object'
                              ? _opt
                              : { value: _opt as any, label: _opt }

                          return (
                            <TouchableOpacity
                              style={{
                                flexGrow: 1,
                                height: 64,
                                justifyContent: 'center',
                                backgroundColor:
                                  value.weight === opt.value
                                    ? 'red'
                                    : undefined,
                              }}
                              onPress={() => {
                                value.setWeight(opt.value)
                                setShowWeightSelectModal(false)
                              }}
                              key={opt.value}
                            >
                              <Text
                                style={{
                                  textAlign: 'center',
                                }}
                              >
                                {typeof opt === 'object' ? opt.label : opt}
                              </Text>
                            </TouchableOpacity>
                          )
                        })}
                      </View>
                    )
                  }}
                ></FlatList>
              )}
            </SafeAreaInsetsContext.Consumer>
          </Modal>
        </SetEditPanelSection>
      )}

      {value.exercise!.hasDistanceMeasument && (
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

      {value.exercise!.hasTimeMeasument && (
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
