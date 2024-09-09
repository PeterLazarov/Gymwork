import React, { Fragment, useState } from 'react'
import { View, Text } from 'react-native'
import {
  BottomDrawer,
  Divider,
  FAB,
  PressableHighlight,
  colors,
  fontSize,
} from 'designSystem'
import { translate } from 'app/i18n'
import { navigate } from 'app/navigators'
import { useStores } from 'app/db/helpers/useStores'

const AddStepMenu = () => {
  const [visible, setVisible] = useState(false)
  const { stateStore } = useStores()

  function expand() {
    setVisible(true)
  }

  const options = [
    {
      text: translate('addExercise'),
      action: () =>
        navigate('ExerciseSelect', {
          selectMode: 'straightSet',
        }),
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
  const height = options.length * 50

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
            width: '100%',
            height,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            backgroundColor: colors.neutralLighter,
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
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSize.md,
                  }}
                >
                  {option.text}
                </Text>
              </PressableHighlight>
            </Fragment>
          ))}
        </View>
      </BottomDrawer>
      <FAB
        icon="plus"
        onPress={expand}
      />
    </View>
  )
}

export default AddStepMenu
