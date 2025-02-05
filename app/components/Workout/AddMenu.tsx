import React, { useMemo, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { BottomDrawer, Divider, FAB, spacing, Text } from 'designSystem'
import { goBack } from '@/navigators'
import { Exercise } from '@/db/models'

export interface AddMenuProps {
  disabled?: boolean
}

const AddMenu: React.FC<AddMenuProps> = ({ disabled }) => {
  const {
    theme: { colors },
  } = useAppTheme()

  const [visible, setVisible] = useState(false)
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

  const drawerPadding = spacing.lg
  const optionHeight = 70
  const drawerHeight = options.length * optionHeight + drawerPadding * 2

  return (
    <View>
      <BottomDrawer
        visible={visible}
        height={drawerHeight}
        onCollapse={() => {
          setVisible(false)
        }}
      >
        <View
          style={{
            padding: drawerPadding,
            backgroundColor: colors.surfaceContainerLow,
          }}
        >
          {options.map((option, i) => (
            <View
              key={option.text}
              style={{ height: optionHeight }}
            >
              {i !== 0 && (
                <Divider
                  orientation="horizontal"
                  variant="neutral"
                />
              )}

              <TouchableOpacity
                onPress={() => {
                  setVisible(false)
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
      </BottomDrawer>

      <FAB
        icon="plus"
        onPress={() => {
          setVisible(true)
        }}
        disabled={disabled}
        style={{ position: 'relative' }}
      />
    </View>
  )
}

export default AddMenu
