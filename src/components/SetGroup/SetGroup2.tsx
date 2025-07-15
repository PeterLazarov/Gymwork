import { ReactNode, useCallback, useMemo } from "react"
import { View, StyleSheet, ViewStyle } from "react-native"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import type { SortableGridRenderItem } from "react-native-sortables"
import Sortable from "react-native-sortables"

import { SelectSet } from "@/db/sqlite/schema"
import { useDB } from "@/db/useDB"
import { useAppTheme } from "@/theme/context"
import { Text } from "../Ignite/Text"
import { rounding } from "@/theme/rounding"
import { Button } from "@expo/ui/swift-ui"
import { AppleIcon } from "react-native-bottom-tabs"

import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated"

const DATA = Array.from({ length: 12 }, (_, index) => `Item ${index + 1}`)

export interface SetGroup2Props {
  setGroupId: string
  editModeEnabled: boolean
  moveEnabled: boolean
  deleteEnabled: boolean
  selectEnabled: boolean
  style?: ViewStyle
}

export function SetGroup2({
  setGroupId,
  deleteEnabled,
  editModeEnabled,
  moveEnabled,
  selectEnabled,
  style,
}: SetGroup2Props) {
  const {
    theme: { rounding, spacing },
  } = useAppTheme()

  const { drizzleDB } = useDB()

  const { data } = useLiveQuery(
    drizzleDB.query.set_groups.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, setGroupId)
      },
      with: {
        sets: {
          with: {
            exercise: {
              columns: {
                name: true,

                created_at: false,
                id: false,
                images: false,
                instructions: false,
                is_favorite: false,
                record_config_id: false,
                tips: false,
              },
              with: {
                exerciseMetrics: {
                  with: {
                    metric: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  )

  const renderItem = useCallback<SortableGridRenderItem<SelectSet>>(
    ({ item }) => (
      // row
      <View style={styles.row}>
        {deleteEnabled && (
          <Animated.View layout={LinearTransition.duration(1000)}>
            <Button
              systemImage={"delete.backward" as AppleIcon["sfSymbol"]}
              onPress={() => {
                alert("deleted ")
              }}
              children=" "
            ></Button>
          </Animated.View>
        )}

        <Animated.View
          layout={LinearTransition.duration(1000)}
          style={[styles.cell, { width: 16, backgroundColor: "red" }]}
        >
          <Text>123</Text>
        </Animated.View>
        <Animated.View
          layout={LinearTransition.duration(1000)}
          style={[styles.cell, { width: 48, backgroundColor: "blue" }]}
        >
          <Text>123</Text>
        </Animated.View>
        <Animated.View
          layout={LinearTransition.duration(1000)}
          style={[styles.cell, { width: 32, backgroundColor: "red" }]}
        >
          <Text>123</Text>
        </Animated.View>
        <Animated.View
          layout={LinearTransition.duration(1000)}
          style={[styles.cell, { width: 64, backgroundColor: "green" }]}
        >
          <Text>123</Text>
        </Animated.View>
        <Animated.View
          layout={LinearTransition.duration(1000)}
          style={[styles.cell, { width: 32, backgroundColor: "red" }]}
        >
          <Text>123</Text>
        </Animated.View>
        <Animated.View
          layout={LinearTransition.duration(1000)}
          style={[styles.cell, { width: 32, backgroundColor: "brown" }]}
        >
          <Text>123</Text>
        </Animated.View>
      </View>
    ),
    [deleteEnabled],
  )

  return (
    <View style={style}>
      <Sortable.Grid
        // key={Number(deleteEnabled)}
        columns={1}
        data={data?.sets ?? []}
        renderItem={renderItem}
        rowGap={0}
        columnGap={0}
        sortEnabled={moveEnabled}
        // Check if properly configured
        hapticsEnabled={true}
        // itemEntering={}
        // itemExiting={}

        rowHeight={40}
        // rows={data?.sets.length || 0}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    // backgroundColor: "#36877F",
    // borderRadius: rounding.sm,
    flexDirection: "row",
    height: 40,
    // justifyContent: "center",
  },
  cell: {
    flexGrow: 1,
    height: 40,
    textAlign: "center",
  },
})
