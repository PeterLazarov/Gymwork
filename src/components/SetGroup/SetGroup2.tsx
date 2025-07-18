import { useCallback, useEffect } from "react"
import { View, StyleSheet, ViewStyle, PlatformColor } from "react-native"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import type { SortableGridRenderItem } from "react-native-sortables"
import Sortable from "react-native-sortables"

import { SelectSet, SelectSetGroup, sets } from "@/db/sqlite/schema"
import { useDB } from "@/db/useDB"
import { useAppTheme } from "@/theme/context"
import { Text } from "../Ignite/Text"
import { Button } from "@expo/ui/swift-ui"
import { AppleIcon } from "react-native-bottom-tabs"

import Animated, { useSharedValue, withTiming } from "react-native-reanimated"
import { IosPlatformColor } from "@/utils/iosColors"
import { eq } from "drizzle-orm"
import { useMutation, useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/db/tanstack/QUERY_KEYS"
import { queryClient } from "../Providers/TanstackQueryProvider"

const DATA = Array.from({ length: 12 }, (_, index) => `Item ${index + 1}`)

export interface SetGroup2Props {
  setGroupId: SelectSetGroup["id"]
  editModeEnabled: boolean
  moveEnabled: boolean
  deleteEnabled: boolean
  selectEnabled: boolean
  style?: ViewStyle
}

let time = 0

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

  const { data } = useQuery({
    queryKey: [QUERY_KEYS.SET_GROUPS, setGroupId],

    // initialData: [],
    queryFn() {
      const q = drizzleDB.query.set_groups.findFirst({
        where(fields, operators) {
          return operators.eq(fields.id, setGroupId)
        },
        with: {
          sets: {
            with: {
              exercise: {
                columns: {
                  name: true,
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
      })

      return q
    },
  })

  useEffect(() => {
    console.log("data fetched for id ", setGroupId)
  }, [data])

  const toggleSetCompletionMutation = useMutation({
    mutationFn: (item: SelectSet) => {
      return drizzleDB
        .update(sets)
        .set({ completed_at: item.completed_at ? null : Date.now() })
        .where(eq(sets.id, item.id))
        .execute()
    },
    onSuccess: (data, variables, ctx) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SET_GROUPS, variables.set_group_id] })
    },
  })

  const translateX = useSharedValue(0)
  useEffect(() => {
    translateX.value = withTiming(deleteEnabled ? 32 : 0, { duration: 300 })
  }, [deleteEnabled])

  const renderItem = useCallback<SortableGridRenderItem<SelectSet>>(
    ({ item }) => (
      <Animated.View
        style={[styles.row, { transform: [{ translateX }] }]}
        key={item.id}
      >
        <View
          style={{
            position: "absolute",
            left: -32,
            zIndex: 0,
            width: 40,
          }}
        >
          <Button
            systemImage={"trash" as AppleIcon["sfSymbol"]}
            color={PlatformColor(IosPlatformColor.systemRed)}
            onPress={() => {
              // alert("deleted ")
            }}
            style={{
              minWidth: 40,
              minHeight: 40,
              maxWidth: 40,
              maxHeight: 40,
            }}
            children=""
          ></Button>
        </View>

        <View style={[styles.cell, { width: 16, backgroundColor: "red" }]}>
          <Text style={styles.cellText}>{item.position + 1}</Text>
        </View>
        <View style={[styles.cell, { width: 64, backgroundColor: "blue" }]}>
          <Text
            style={styles.cellText}
          >{`${item.reps} x ${(item.weight_mcg ?? 0) / 1_000_000_000}`}</Text>
        </View>
        <View style={[styles.cell, { width: 32, backgroundColor: "red" }]}>
          <Text style={styles.cellText}>{item.reps}</Text>
        </View>
        <View style={[styles.cell, { width: 32, backgroundColor: "green" }]}>
          <Text style={styles.cellText}>{(item.weight_mcg ?? 0) / 1_000_000_000}</Text>
        </View>
        <View style={[styles.cell, { width: 32, backgroundColor: "red" }]}>
          <Text style={styles.cellText}>{item.rpe}</Text>
        </View>
        <View
          style={[
            styles.cell,
            {
              width: 24,
              // backgroundColor: "brown",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={{
              // backgroundColor: "yellow",
              width: 32,
              height: 32,
              overflow: "hidden",
            }}
          >
            <Button
              systemImage="checkmark"
              children=""
              style={{
                minHeight: 32,
                minWidth: 32 + 8,

                // alignSelf: "flex-end",
              }}
              color={
                item.completed_at ? PlatformColor("systemGreen") : PlatformColor("systemGray4")
              }
              onPress={() => {
                time = Date.now()

                toggleSetCompletionMutation.mutate(item)
              }}
            ></Button>
          </View>
        </View>
      </Animated.View>
    ),
    [data, deleteEnabled],
  )

  return (
    <View style={style}>
      {/* thead */}
      <Animated.View style={[styles.row, { transform: [{ translateX }] }]}>
        <View style={[styles.cell, { width: 16 }]}>
          <Text style={styles.cellText}>Set #</Text>
        </View>
        <View style={[styles.cell, { width: 64 }]}>
          <Text style={styles.cellText}>Previous</Text>
        </View>
        <View style={[styles.cell, { width: 32 }]}>
          <Text style={styles.cellText}>Reps</Text>
        </View>
        <View style={[styles.cell, { width: 32 }]}>
          <Text style={styles.cellText}>KG</Text>
        </View>
        <View style={[styles.cell, { width: 32 }]}>
          <Text style={styles.cellText}>RPE</Text>
        </View>
        <View style={[styles.cell, { width: 32 }]}>
          <Text style={styles.cellText}>Done?</Text>
        </View>
      </Animated.View>

      {/* tbody */}
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
    backgroundColor: "#36877F",
    // borderRadius: rounding.sm,
    flexDirection: "row",
    height: 40,
    // justifyContent: "center",
  },
  cell: {
    flexGrow: 1,
    height: 40,
  },
  cellText: {
    textAlign: "center",
  },
})
