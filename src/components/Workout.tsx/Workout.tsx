import React, { useEffect, useMemo, useState } from "react"
import { ScrollView, View, ViewProps } from "react-native"
import { List, Switch } from "@expo/ui/swift-ui"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import { TextField } from "swiftui-react-native"

import { SetGroup } from "@/components/SetGroup/SetGroup"
import { useDB } from "@/db/useDB"
import { useAppTheme } from "@/theme/context"

import { Text } from "../Ignite/Text"

export interface WorkoutProps extends ViewProps {
  workoutId: string
}

export default function Workout({ workoutId, ...rest }: WorkoutProps) {
  // list modes
  const [editModeEnabled, setEditModeEnabled] = useState(true) // master switch
  const [moveEnabled, setMoveEnabled] = useState(false) // adds left move btn
  const [deleteEnabled, setDeleteEnabled] = useState(true) // ! Starting out with delete disabled means you CANNOT enable it
  const [selectEnabled, setSelectEnabled] = useState(false) // doesn't work?

  const { drizzleDB } = useDB()
  const {
    theme: { rounding, spacing },
  } = useAppTheme()

  const { data } = useLiveQuery(
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

  return (
    // TODO move styles to parent
    <View {...rest}>
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
            value={deleteEnabled}
            variant="button"
            onValueChange={(value) => {
              setDeleteEnabled(value)
              setMoveEnabled(false)
            }}
          ></Switch>
        </View>
      </View>

      <ScrollView
        style={{
          flex: 1,
          // backgroundColor: "brown",
        }}
      >
        {data?.setGroups.map(({ id }) => (
          <SetGroup
            key={id}
            setGroupId={id}
            editModeEnabled={editModeEnabled}
            moveEnabled={moveEnabled}
            deleteEnabled={deleteEnabled}
            selectEnabled={selectEnabled}
          ></SetGroup>
        ))}
      </ScrollView>
    </View>
  )
}
