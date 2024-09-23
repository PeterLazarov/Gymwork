import { observer } from 'mobx-react-lite'
import React, { useCallback, useEffect, useState } from 'react'
import { getSnapshot } from 'mobx-state-tree'
import { Platform, View } from 'react-native'

import SetEditList from './SetEditList'
import SetEditControls from './SetEditControls'
import { useStores } from 'app/db/helpers/useStores'
import {
  Exercise,
  WorkoutSet,
  WorkoutSetModel,
  WorkoutStep,
} from 'app/db/models'
import { SetEditActions } from './SetEditActions'
import { useTimer } from 'app/contexts/TimerContext'
import { useColors } from 'designSystem'
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated'

const defaultReps = 10

export type ExerciseTrackViewProps = {
  step: WorkoutStep
  exercise: Exercise
}

const ExerciseTrackView: React.FC<ExerciseTrackViewProps> = ({
  exercise: focusedExercise,
  step,
}) => {
  const colors = useColors()

  const { stateStore, settingsStore, workoutStore } = useStores()
  const restTimer = useTimer()
  const [selectedSet, setSelectedSet] = useState<WorkoutSet | null>(null)

  useEffect(() => {
    if (selectedSet && focusedExercise.guid !== selectedSet.exercise.guid) {
      setSelectedSet(null)
    }
  }, [focusedExercise])

  useEffect(() => {
    const lastSet =
      workoutStore.exerciseSetsHistoryMap[focusedExercise.guid]?.at(-1)
    const setToClone = selectedSet || lastSet

    const { guid, exercise, reps, ...rest } = setToClone || {}

    stateStore.setProp('draftSet', {
      exercise: focusedExercise.guid,
      reps: reps || (focusedExercise.hasRepMeasument ? defaultReps : undefined),
      ...rest,
    })
  }, [selectedSet, focusedExercise])

  useEffect(() => {
    if (settingsStore.measureRest) {
      stateStore.draftSet!.setProp(
        'restMs',
        restTimer.timeElapsed.as('milliseconds')
      )
    }
  }, [restTimer.timeElapsed, focusedExercise])

  const handleAdd = useCallback(() => {
    if (stateStore.draftSet) {
      const { guid, ...draftCopy } = stateStore.draftSet
      const fromDraft = WorkoutSetModel.create({
        ...draftCopy,
        exercise: focusedExercise.guid,
        date: stateStore.openedDate,
      })
      step.addSet(fromDraft)
    }

    if (settingsStore.measureRest) {
      restTimer.start()
    }

    if (step.type === 'superSet') {
      const index = step.exercises.indexOf(focusedExercise)
      const isLastSet = index === step.exercises.length - 1
      const nextExercise = step.exercises[isLastSet ? 0 : index + 1]!
      stateStore.setProp('focusedExerciseGuid', nextExercise.guid)
    }
  }, [focusedExercise])

  const handleUpdate = useCallback(() => {
    const updatedSet = {
      ...getSnapshot(stateStore.draftSet!),
      exercise: selectedSet!.exercise.guid,
      guid: selectedSet!.guid,
      date: selectedSet!.date,
    }

    step.updateSet(updatedSet)

    setSelectedSet(null)
  }, [stateStore.draftSet, selectedSet])

  const handleRemove = useCallback(() => {
    setSelectedSet(null)
    step.removeSet(selectedSet!.guid)
  }, [selectedSet])

  const keyboard = useAnimatedKeyboard()
  const bottomBarSize = Platform.OS === 'android' ? 56 : 80
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -Math.max(keyboard.height.value - bottomBarSize, 0),
        },
      ],
    }
  })

  return (
    <View
      style={[
        {
          flexDirection: 'column',
          flexGrow: 1,
          gap: 8,
          display: 'flex',
          backgroundColor: colors.surfaceContainerLow,
        },
      ]}
    >
      <SetEditList
        sets={step?.exerciseSetsMap[focusedExercise.guid] ?? []}
        selectedSet={selectedSet}
        setSelectedSet={setSelectedSet}
      />

      <Animated.View
        style={[
          {
            justifyContent: 'flex-end',
            backgroundColor: colors.surfaceContainerLow,
            gap: 8,
          },
          animatedStyles,
        ]}
      >
        {stateStore.draftSet && (
          <View style={{ paddingHorizontal: 8 }}>
            <SetEditControls
              value={stateStore.draftSet}
              onSubmit={handleAdd}
            />
          </View>
        )}
        <SetEditActions
          mode={selectedSet ? 'edit' : 'add'}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onRemove={handleRemove}
        />
      </Animated.View>
    </View>
  )
}

export default observer(ExerciseTrackView)
