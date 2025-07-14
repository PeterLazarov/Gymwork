import React, { useEffect, useState } from "react"
import { ScrollView, View, ViewProps } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { Switch } from "@expo/ui/swift-ui"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { Screen } from "@/components/Ignite/Screen"
import { Text } from "@/components/Ignite/Text"
import { SetGroup } from "@/components/SetGroup/SetGroup"
import { useDB } from "@/db/useDB"
import { useAppTheme } from "@/theme/context"
import { delay } from "@/utils/delay"
import { useHeader } from "@/utils/useHeader"

export default function WorkoutScreen() {
  const { drizzleDB } = useDB()
  const {
    theme: { rounding, spacing },
  } = useAppTheme()

  const { workoutId } = useLocalSearchParams<{ workoutId: string }>()
  const { data: workout } = useLiveQuery(
    drizzleDB.query.workouts.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, workoutId)
      },
      with: {
        setGroups: {
          columns: {
            id: true,
          },
        },
      },
    }),
  )

  // list modes
  const [moveEnabled, setMoveEnabled] = useState(false) // adds left move btn
  const [deleteEnabled, setDeleteEnabled] = useState(true) // ! Starting out with delete disabled means you CANNOT enable it

  const [scrollViewOpacity, setScrollViewOpacity] = useState(0)

  useHeader(
    {
      title: workoutId,
    },
    [workoutId],
  )

  useEffect(() => {
    delay(0)
      .then(() => {
        setDeleteEnabled(false)
        // return delay(0)
      })
      .then(() => {
        setScrollViewOpacity(1)
      })
  }, [])

  return (
    <Screen
      // style={{ backgroundColor: "red" }}

      contentContainerStyle={{
        // backgroundColor: "blue",
        flex: 1,
      }}
    >
      <Text>Workout Screen</Text>
      <Text>ID: {workoutId}</Text>

      <View
        style={{
          borderRadius: rounding.md,
          flex: 1,
        }}
      >
        <Text>Workout Component</Text>

        <Text>Set Group</Text>

        {/* Move/Delete controls */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <View style={{ width: 200 }}>
            <Switch
              label="Move"
              value={moveEnabled}
              variant="button"
              onValueChange={(value) => {
                setMoveEnabled(value)
                setDeleteEnabled(false)
              }}
            ></Switch>
          </View>
          <View style={{ width: 200 }}>
            <Switch
              label="Delete"
              value={scrollViewOpacity === 1 ? deleteEnabled : false}
              variant="button"
              onValueChange={(value) => {
                setDeleteEnabled((v) => !v)
                setMoveEnabled(false)
              }}
            ></Switch>
          </View>
        </View>

        <ScrollView
          style={{
            flex: 1,
            opacity: scrollViewOpacity,
            // backgroundColor: "brown",
          }}
        >
          {workout?.setGroups.map(({ id }) => (
            <SetGroup
              key={id}
              setGroupId={id}
              editModeEnabled={true}
              moveEnabled={moveEnabled}
              deleteEnabled={deleteEnabled}
              selectEnabled={false}
            ></SetGroup>
          ))}
        </ScrollView>
      </View>
    </Screen>
  )
}
