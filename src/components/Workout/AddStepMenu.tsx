import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { BottomDrawer, Divider, FAB, spacing, Text, useColors } from "@/designSystem"
import { navigate } from "@/navigators/navigationUtilities"
import { translate } from "@/utils"
import React, { useState } from "react"
import { Pressable, View } from "react-native"

export const AddStepMenu = () => {
  const colors = useColors()

  const [visible, setVisible] = useState(false)
  const { openedWorkout } = useOpenedWorkout()

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

  if (openedWorkout) {
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
