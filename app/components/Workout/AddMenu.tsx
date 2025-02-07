import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useNavigation } from '@react-navigation/native'
import React, { useMemo, useRef } from 'react'
import { Platform, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Exercise } from '@/db/models'
import { useAppTheme } from '@/utils/useAppTheme'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { Divider, Icon, IconButton, Text } from 'designSystem'

import {
  ExerciseSelectSheet,
  showExerciseSelect,
} from '../Exercise/ExerciseSelectSheet'

export interface AddMenuProps {
  disabled?: boolean
}

const AddMenu: React.FC<AddMenuProps> = ({ disabled }) => {
  const {
    theme: { colors },
  } = useAppTheme()
  const { bottom: bottomInset } = useSafeAreaInsets()

  const { stateStore, workoutStore } = useStores()

  function createExercisesStep(exercises: Exercise[]) {
    if (!stateStore.openedWorkout) {
      workoutStore.createWorkout()
    }
    const newStep = stateStore.openedWorkout!.addStep(
      exercises,
      exercises.length > 1 ? 'superSet' : 'straightSet'
    )
    stateStore.setFocusedStep(newStep.guid)
    stateStore.setProp('focusedExerciseGuid', newStep.exercises[0]?.guid)
  }
  const navigation = useNavigation()

  const addExercise = () => {
    showExerciseSelect().then(exercises => {
      createExercisesStep(exercises)
      navigation.navigate('Home', {
        screen: 'WorkoutStack',
        params: {
          screen: 'WorkoutStep',
          params: {},
        },
      })
    })
  }

  const options = useMemo(() => {
    const opts = [
      {
        text: translate('addExercise'),
        action: addExercise,
      },
      {
        text: translate('addSuperset'),
        action: () => addExercise,
      },
    ]
    if (stateStore.openedWorkout) {
      opts.push({
        text: translate('addComment'),
        action: () =>
          navigation.navigate('Home', {
            screen: 'WorkoutStack',
            params: {
              screen: 'WorkoutFeedback',
              params: {},
            },
          }),
      })
    }
    return opts
  }, [stateStore.openedWorkout, addExercise])

  const { theme } = useAppTheme()
  const actionSheet = useRef<TrueSheet>(null)

  return (
    <>
      <IconButton
        style={{
          backgroundColor: disabled ? colors.outlineVariant : colors.primary,
          borderRadius: 12, // TODO add global rounding styles?
        }}
        onPress={() => {
          actionSheet.current?.present()
        }}
        disabled={disabled}
      >
        <Icon icon="add"></Icon>
      </IconButton>

      <TrueSheet
        ref={actionSheet}
        sizes={['auto']}
        blurTint="default"
        contentContainerStyle={{
          paddingTop: bottomInset,
          paddingBottom: bottomInset,
        }}
      >
        <View>
          {options.map((option, i) => (
            <View
              key={option.text}
              style={{ height: 70 }}
            >
              {i !== 0 && (
                <Divider
                  orientation="horizontal"
                  variant="neutral"
                />
              )}

              <TouchableOpacity
                onPress={() => {
                  actionSheet.current?.dismiss()
                  option.action()
                }}
                style={{
                  flexGrow: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text>{option.text}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </TrueSheet>

      <ExerciseSelectSheet />
    </>
  )
}

export default AddMenu
