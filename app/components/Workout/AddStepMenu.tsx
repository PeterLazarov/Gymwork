import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { BottomDrawer, Divider, FAB, spacing, Text } from 'designSystem'

const AddStepMenu = () => {
  const {
    theme: { colors },
  } = useAppTheme()

  const [visible, setVisible] = useState(false)
  const {
    stateStore,
    navStore: { navigate },
  } = useStores()

  function expand() {
    setVisible(true)
  }

  const addExercise = () => {
    navigate('ExerciseSelect', {
      selectMode: 'straightSet',
    })
  }

  const options = [
    {
      text: translate('addExercise'),
      action: addExercise,
    },
    {
      text: translate('addSuperset'),
      action: () =>
        navigate('ExerciseSelect', {
          selectMode: 'superSet',
        }),
    },
  ]

  if (stateStore.openedWorkout) {
    options.push({
      text: translate('addComment'),
      action: () => navigate('WorkoutFeedback'),
    })
  }
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
        onTouchStart={expand}
        // onLongPress={addExercise}
        style={{ position: 'relative' }}
      />
    </View>
  )
}

export default AddStepMenu
