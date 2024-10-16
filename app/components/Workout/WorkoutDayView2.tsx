import React, { useState } from 'react'
import {
  Pressable,
  ScrollView,
  SectionList,
  TouchableOpacity,
  View,
} from 'react-native'
import { observer } from 'mobx-react-lite'

import { useStores } from 'app/db/helpers/useStores'
import WorkoutStepList from './WorkoutStepList'
import WorkoutEmptyState from './WorkoutEmptyState'
import WorkoutCommentsCard from './WorkoutCommentsCard'
import {
  Button,
  ButtonText,
  useColors,
  Text,
  IconButton,
  Icon,
  fontSize,
} from 'designSystem'
import { DateTime } from 'luxon'
import ExerciseSelectLists from '../Exercise/ExerciseSelectLists'
import {
  Exercise,
  WorkoutSet,
  WorkoutSetModel,
  WorkoutStep,
} from 'app/db/models'
import { Card } from 'react-native-paper'
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated'
import {
  DndProvider,
  DndProviderProps,
  Draggable,
  Droppable,
} from '@mgcrea/react-native-dnd'

import ExerciseTrackView from '../WorkoutStep/ExerciseTrackView'
import StepSetsList from '../WorkoutStep/StepSetsList/StepSetsList'
import { SetEditActions } from '../WorkoutStep/ExerciseTrackView/SetEditActions'
import SetEditList from '../WorkoutStep/ExerciseTrackView/SetEditList'
import SetEditControls from '../WorkoutStep/ExerciseTrackView/SetEditControls'
import { State } from 'react-native-gesture-handler'

type Props = {
  date?: string
}

let temporary: Exercise[] = []

const handleDragEnd: DndProviderProps['onDragEnd'] = ({ active, over }) => {
  'worklet'
  if (over) {
    console.log('onDragEnd', { active, over })
  }
}

const handleBegin: DndProviderProps['onBegin'] = () => {
  'worklet'
  console.log('onBegin')
}

const handleFinalize: DndProviderProps['onFinalize'] = ({ state }) => {
  'worklet'
  console.log('onFinalize')
  if (state !== State.FAILED) {
    console.log('onFinalize')
  }
}

const WorkoutDayView: React.FC<Props> = ({
  date = DateTime.now().toISODate(),
}) => {
  const colors = useColors()

  const {
    workoutStore,
    settingsStore,
    stateStore,
    navStore: { navigate },
  } = useStores()

  const workout = workoutStore.dateWorkoutMap[date]

  const [exerciseSelectOpen, setExerciseSelectOpen] = useState(false)
  const [focusedSet, setFocusedSet] = useState<WorkoutSet>()

  if (!workout) return <WorkoutEmptyState />

  // TODO reimplement separators as parts of a card? so that they get access to set
  const idGen = (function* () {
    for (let index = 0; index < Infinity; index++) {
      yield index
    }
  })()

  // TODO move sets in and out of exercises?

  return (
    <DndProvider
      style={{ flex: 1, backgroundColor: colors.surfaceContainer }}
      onBegin={handleBegin}
      onFinalize={handleFinalize}
      onDragEnd={handleDragEnd}
    >
      <View style={{ flex: 1 }}>
        {/* // Tabs? (supports side swipe, would look odd to highlight cards (vertical) based on side swipe (horizontal)) */}

        <Animated.FlatList
          // TODO disable scroll on dnd
          scrollEnabled={false}
          style={{
            flex: 1,
            height: stateStore.focusedStep ? 0 : undefined,
            gap: 8,
          }}
          // Does this even work?
          itemLayoutAnimation={LinearTransition}
          data={
            stateStore.focusedStep ? [stateStore.focusedStep] : workout.steps
          }
          ItemSeparatorComponent={() => {
            // TODO rest timer?
            return (
              <Droppable id={String(idGen.next().value ?? 0)}>
                <Text style={{ fontSize: fontSize.xs, textAlign: 'center' }}>
                  00:00
                </Text>
              </Droppable>
            )
          }}
          renderItem={({ item: step }) => (
            <Draggable id={step.guid}>
              <Animated.View
                key={step.guid}
                exiting={FadeOut}
                entering={FadeIn}
              >
                <Card
                  onPress={() => {
                    stateStore.setFocusedStep(
                      stateStore.focusedStepGuid === step.guid ? '' : step.guid
                    )
                    if (step.sets.length === 0) {
                      step.addSet(
                        WorkoutSetModel.create({
                          completed: false,
                          exercise: step.exercise!.guid,
                        })
                      )
                    }

                    stateStore.setProp(
                      'focusedExerciseGuid',
                      step.exercise!.guid
                    )
                    setFocusedSet(step.sets.at(-1) ?? undefined)
                  }}
                  style={{
                    // backgroundColor:
                    //   stateStore.focusedStepGuid === step.guid
                    //     ? colors.tertiary
                    //     : undefined,
                    margin: 8,
                  }}
                >
                  <Card.Title
                    title={step.exercise?.name}
                    // subtitle="Card Subtitle"
                    right={size => (
                      <IconButton>
                        <Icon
                          // size="default"
                          icon={'add'}
                        />
                      </IconButton>
                    )}
                  />

                  {step.sets.length > 0 && (
                    <Card.Content style={{}}>
                      <Draggable id={step.guid + 'sets'}>
                        <SetEditList
                          step={step}
                          sets={step.sets}
                          selectedSet={focusedSet ?? null}
                          setSelectedSet={set => {
                            stateStore.setFocusedStep(step.guid)
                            stateStore.setProp(
                              'focusedExerciseGuid',
                              step.exercise!.guid
                            )
                            setFocusedSet(set ?? undefined)
                          }}
                          hideFallback
                        ></SetEditList>
                      </Draggable>

                      {/* <View></View> */}
                    </Card.Content>
                  )}
                </Card>
              </Animated.View>
            </Draggable>
          )}
        />

        {stateStore.focusedStep && stateStore.focusedStep.exercise && (
          <SetEditControls
            value={stateStore.focusedStep.sets.at(-1)}
            onSubmit={() => {
              //
            }}
            // timer={timer}
          />
        )}

        {/* // Bottom controls */}
        {stateStore.focusedStep ? (
          <></>
        ) : (
          // <SetEditActions mode="edit" />
          <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
            <Button
              variant="primary"
              onPress={() => {
                setExerciseSelectOpen(true)
              }}
            >
              <ButtonText variant="primary">Add exercises</ButtonText>
            </Button>
          </View>
        )}
      </View>

      {exerciseSelectOpen && (
        <View
          style={{ flex: 1, zIndex: 1, position: 'absolute', height: '100%' }}
        >
          <ExerciseSelectLists
            multiselect={true}
            selected={workout?.exercises ?? []}
            onChange={exercises => {
              temporary = exercises
            }}
          />

          <Button
            variant="primary"
            onPress={() => {
              temporary.forEach(exercise => {
                workout?.addStep([exercise], 'straightSet')
              })
              // temporary = []
              setExerciseSelectOpen(false)
            }}
          >
            <ButtonText variant="primary">Confirm Selection</ButtonText>
          </Button>
        </View>
      )}
    </DndProvider>
  )
}

export default observer(WorkoutDayView)
