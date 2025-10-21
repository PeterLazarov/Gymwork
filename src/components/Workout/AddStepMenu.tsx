import React, { useState } from "react"
import { Pressable, View } from "react-native"
import { Text, BottomDrawer, Divider, FAB, useColors, spacing } from "@/designSystem"
import { translate } from "@/utils"
import { useStores } from "app/db/helpers/useStores"

export const AddStepMenu = () => {
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
    navigate("ExerciseSelect", {
      selectMode: "straightSet",
    })
  }

  const options = [
    {
      text: translate("addExercise"),
      action: addExercise,
    },
    {
      text: translate("addSuperset"),
      action: () =>
        navigate("ExerciseSelect", {
          selectMode: "superSet",
        }),
    },
  ]

  if (stateStore.openedWorkout) {
    options.push({
      text: translate("addComment"),
      action: () => navigate("WorkoutFeedback"),
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

              <Pressable
                onPress={() => {
                  setVisible(false)
                  option.action()
                }}
                style={{
                  flexGrow: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>{option.text}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </BottomDrawer>

      <FAB
        icon="plus"
        onTouchStart={expand}
        // onLongPress={addExercise}
        style={{ position: "relative" }}
      />
    </View>
  )
}
