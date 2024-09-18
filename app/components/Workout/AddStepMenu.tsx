import React, { Fragment, useState } from 'react'
import { View } from 'react-native'
import {
  Text,
  BottomDrawer,
  Divider,
  FAB,
  PressableHighlight,
  useColors,
} from 'designSystem'
import { translate } from 'app/i18n'
import { useStores } from 'app/db/helpers/useStores'

const AddStepMenu = () => {
  const colors = useColors()

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
  const height = options.length * 70

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <BottomDrawer
        visible={visible}
        height={height}
        onCollapse={() => {
          setVisible(false)
        }}
      >
        <View
          style={{
            padding: 20,
            flexGrow: 1,
            backgroundColor: colors.mat.surfaceContainerLow,
          }}
        >
          {options.map((option, i) => (
            <Fragment key={option.text}>
              {i !== 0 && (
                <Divider
                  orientation="horizontal"
                  variant="neutral"
                />
              )}

              <PressableHighlight
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
              </PressableHighlight>
            </Fragment>
          ))}
        </View>
      </BottomDrawer>
      <FAB
        icon="plus"
        onPress={expand}
        onLongPress={addExercise}
      />
    </View>
  )
}

export default AddStepMenu
