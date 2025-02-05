import React, { useMemo, useRef } from 'react'
import { Platform, TouchableOpacity, View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { Divider, Icon, IconButton, spacing, Text } from 'designSystem'
import { goBack } from '@/navigators'
import { Exercise } from '@/db/models'
import { TrueSheet } from '@lodev09/react-native-true-sheet'

export interface AddMenuProps {
  disabled?: boolean
}

const AddMenu: React.FC<AddMenuProps> = ({ disabled }) => {
  const {
    theme: { colors },
  } = useAppTheme()

  const {
    stateStore,
    workoutStore,
    navStore: { navigate },
  } = useStores()

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

    // navigate('WorkoutStep')
  }

  const addExercise = () => {
    navigate('ExerciseSelect', {
      selectMode: 'straightSet',
      // TODO onGoBack?
      // would the previous page still be rendered when this is trigged though?
      onSelect(exercises) {
        createExercisesStep(exercises)
        goBack()
      },
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
        action: () => navigate('WorkoutFeedback'),
      })
    }
    return opts
  }, [stateStore.openedWorkout, addExercise, navigate])

  const { theme } = useAppTheme()
  const sheet = useRef<TrueSheet>(null)

  return (
    <>
      <IconButton
        style={{
          backgroundColor: colors.primary,
          borderRadius: 12,
        }}
        onPress={() => {
          sheet.current?.present()
        }}
        disabled={disabled}
      >
        <Icon icon="add"></Icon>
      </IconButton>

      <TrueSheet
        ref={sheet}
        sizes={['auto', 'large']}
        backgroundColor={colors.surfaceContainer}
        contentContainerStyle={{
          paddingTop: theme.spacing.md,
          paddingBottom: Platform.select({ ios: theme.spacing.md, android: 0 }),
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
                  sheet.current?.dismiss()
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
    </>
  )
}

export default AddMenu
