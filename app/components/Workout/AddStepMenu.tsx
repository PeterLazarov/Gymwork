import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { FAB } from 'react-native-paper'
import { Divider, PressableHighlight, colors, fontSize } from 'designSystem'
import BottomDrawer from 'designSystem/BottomDrawer'
import { translate } from 'app/i18n'
import { navigate } from 'app/navigators'

const AddStepMenu = () => {
  const [visible, setVisible] = useState(false)

  function expand() {
    setVisible(true)
  }

  const options = [
    {
      text: translate('addExercise'),
      action: () => navigate('ExerciseSelect'),
    },
    {
      text: translate('addSuperset'),
      action: () => navigate('ExerciseSelect'),
    },
    {
      text: translate('addComment'),
      action: () => navigate('WorkoutFeedback'),
    },
  ]

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <BottomDrawer
        visible={visible}
        height={150}
        onCollapse={() => {
          setVisible(false)
        }}
      >
        <View style={styles.bottomDrawer}>
          {options.map((option, i) => (
            <>
              {i !== 0 && (
                <Divider
                  orientation="horizontal"
                  variant="neutral"
                />
              )}
              <PressableHighlight
                key={option.text}
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
            </>
          ))}
        </View>
      </BottomDrawer>
      <FAB
        icon="plus"
        style={styles.fab}
        color={colors.primaryText}
        onPress={expand}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  bottomDrawer: {
    padding: 20,
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: colors.neutralLighter,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 'auto',
    left: 'auto',
    bottom: 0,
    backgroundColor: colors.primary,
  },
})

export default AddStepMenu
