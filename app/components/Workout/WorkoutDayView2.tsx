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
import ExerciseTrackView from '../WorkoutStep/ExerciseTrackView'
import StepSetsList from '../WorkoutStep/StepSetsList/StepSetsList'
import { SetEditActions } from '../WorkoutStep/ExerciseTrackView/SetEditActions'
import SetEditList from '../WorkoutStep/ExerciseTrackView/SetEditList'
import SetEditControls from '../WorkoutStep/ExerciseTrackView/SetEditControls'

type Props = {
  date?: string
}

let temporary: Exercise[] = []

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

  // TODO move sets in and out of exercises?

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceContainer }}>
      <View style={{ flex: 1 }}>
        {/* // Tabs? (supports side swipe, would look odd to highlight cards (vertical) based on side swipe (horizontal)) */}
        <Animated.FlatList
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
              <Text style={{ fontSize: fontSize.xs, textAlign: 'center' }}>
                00:00
              </Text>
            )
          }}
          renderItem={({ item: step }) => (
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

                  stateStore.setProp('focusedExerciseGuid', step.exercise!.guid)
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
                  </Card.Content>
                )}
              </Card>
            </Animated.View>
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
    </View>
  )
}

export default observer(WorkoutDayView)
