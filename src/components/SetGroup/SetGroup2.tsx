import { ReactNode, useCallback, useEffect, useMemo } from "react"
import {
  View,
  StyleSheet,
  ViewStyle,
  PlatformColor,
  Image,
  Pressable,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import type { SortableGridRenderItem } from "react-native-sortables"
import Sortable from "react-native-sortables"

import { SelectSet, set_groups, sets } from "@/db/sqlite/schema"
import { useDB } from "@/db/useDB"
import { useAppTheme } from "@/theme/context"
import { Text } from "../Ignite/Text"
import { rounding } from "@/theme/rounding"
import { Button } from "@expo/ui/swift-ui"
import { AppleIcon } from "react-native-bottom-tabs"
import { SymbolView, SymbolViewProps, SFSymbol } from "expo-symbols"

import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { IosPlatformColor } from "@/utils/iosColors"
import { eq } from "drizzle-orm"
import { useExpoQuery } from "@/db/sqlite/expo/useExpoQuery"
import { delay } from "@/utils/delay"

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
    [setGroupId],
  )

  // const data2 = useExpoQuery(
  //   drizzleDB.query.set_groups.findFirst({
  //     where(fields, operators) {
  //       return operators.eq(fields.id, setGroupId)
  //     },
  //     with: {
  //       sets: {
  //         with: {
  //           exercise: {
  //             columns: {
  //               name: true,

  //               created_at: false,
  //               id: false,
  //               images: false,
  //               instructions: false,
  //               is_favorite: false,
  //               record_config_id: false,
  //               tips: false,
  //             },
  //             with: {
  //               exerciseMetrics: {
  //                 with: {
  //                   metric: true,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   }),
  //   ["sets"],
  // )

  useEffect(() => {
    Date.now()
  }, [data])

  const translateX = useSharedValue(0)
  useEffect(() => {
    translateX.value = withTiming(deleteEnabled ? 32 : 0, { duration: 300 })
    // translateX.value = withSpring(deleteEnabled ? 32 : 0, { duration: 500 })
  }, [deleteEnabled])

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(translateX.value) }],
  }))

  const renderItem = useCallback<SortableGridRenderItem<SelectSet>>(
    ({ item }) => (
      // row
      // <View style={[styles.row, animatedStyles]}>
      <Animated.View style={[styles.row, { transform: [{ translateX }] }]}>
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
          <TouchableOpacity
            key={item.id}
            style={{
              backgroundColor: item.completed_at
                ? PlatformColor("systemGreen")
                : PlatformColor("quaternarySystemFill"),
              padding: spacing.xxs,
              borderRadius: rounding.md,
            }}
            onPress={async () => {
              // wtf... less time than this and the animation breaks
              // await delay(170)

              drizzleDB
                .update(sets)
                .set({ completed_at: item.completed_at ? null : Date.now() })
                .where(eq(sets.id, item.id))
                .execute()
            }}
          >
            <SymbolView
              name="checkmark"
              tintColor={
                item.completed_at
                  ? PlatformColor("systemBackground")
                  : PlatformColor("tertiaryLabel")
              }
            ></SymbolView>
          </TouchableOpacity>
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
    // backgroundColor: "#36877F",
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
