import { ReactNode, useEffect, useMemo } from "react"
import { useWindowDimensions, View } from "react-native"
import { List } from "@expo/ui/swift-ui"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { SelectSet } from "@/db/sqlite/schema"
import { useDB } from "@/db/useDB"
import { useAppTheme } from "@/theme/context"

import { Text } from "../Ignite/Text"

export interface SetGroupProps {
  setGroupId: string
  editModeEnabled: boolean
  moveEnabled: boolean
  deleteEnabled: boolean
  selectEnabled: boolean
}

const listAligningTranslate = 10 // otherwise lines are off-center
const iosListHorizontalMargin = 20
const iosListDeleteModeMargin = 20
const iosListMoveModeMargin = 20 // added to the default 20
const iosListMargin = iosListHorizontalMargin * 2 // PROPER sizing
const listRowInnerHeight = 36
const listOuterRowInnerHeight = 44 // ?44?
const exerciseNameHeight = 24

const testColors = ["red", "green", "blue", "orange", "purple", "gray", "black", "teal"]

export function SetGroup({
  setGroupId,
  deleteEnabled,
  editModeEnabled,
  moveEnabled,
  selectEnabled,
}: SetGroupProps) {
  const { drizzleDB } = useDB()
  const { theme } = useAppTheme()
  const { width } = useWindowDimensions()

  // TODO get from exercise config
  // const headerCols = ["Set #", "KG", "Reps", "RPE", "Done"]
  const columns: Array<{
    renderItem: (item: SelectSet, i: number) => ReactNode
    label: string
    styles: {
      width: number
      flexGrow?: number
    }
  }> = useMemo(() => {
    const tableWidth = width - iosListHorizontalMargin // 20
    let widthLeft = tableWidth

    let widthPosition = 40
    widthLeft -= widthPosition

    let widthPrev = 80
    widthLeft -= widthPrev

    let widthWeight = 50
    widthLeft -= widthWeight

    let widthReps = 40
    widthLeft -= widthReps

    let widthRPE = 32
    widthLeft -= widthRPE

    let widthCompletion = 32
    widthLeft -= widthRPE

    widthPosition += widthLeft / 6
    widthPrev += widthLeft / 6
    widthWeight += widthLeft / 6
    widthReps += widthLeft / 6
    widthRPE += widthLeft / 6
    widthCompletion += widthLeft / 6

    return [
      {
        renderItem(item, i) {
          return (
            <View
              key={i}
              style={{
                backgroundColor: "red",
                // height: listRowInnerHeight,
                width: widthPosition,
              }}
            >
              <Text
                style={{ textAlign: "center" }}
                key={item.id + "_set"}
              >
                {item["position"]}
              </Text>
            </View>
          )
        },

        label: "Set #",
        styles: {
          width: widthPosition,
        },
      },
      {
        renderItem(item, i) {
          return (
            <View
              key={i}
              style={{
                backgroundColor: "brown",

                width: widthPrev,
              }}
            >
              <Text
                style={{ textAlign: "center" }}
                key={item.id + "_idk"}
              >
                {`${(item.weight_mcg ?? 0) / 1_000_000_000} x ${item.reps}`}
              </Text>
            </View>
          )
        },
        label: "Previous",
        styles: {
          width: widthPrev,
        },
      },
      {
        renderItem(item, i) {
          return (
            <View
              key={i}
              style={{
                backgroundColor: "yellow",

                width: widthWeight,
              }}
            >
              <Text
                style={{ textAlign: "center" }}
                key={item.id + "_weight"}
              >
                {(item["weight_mcg"] ?? 0) / 1_000_000_000}
              </Text>
            </View>
          )
        },

        label: "KG", // can be +kg, -kg etc
        styles: {
          width: widthWeight,
        },
      },
      {
        renderItem(item, i) {
          return (
            <View
              key={i}
              style={{
                backgroundColor: "green",

                width: widthReps,
              }}
            >
              <Text
                style={{ textAlign: "center" }}
                key={item.id + "_reps"}
              >
                {item["reps"]}
              </Text>
            </View>
          )
        },

        label: "Reps",
        styles: {
          width: widthReps,
        },
      },
      {
        renderItem(item, i) {
          return (
            <View
              key={i}
              style={{
                backgroundColor: "blue",

                width: widthRPE,
              }}
            >
              <Text
                style={{ textAlign: "center" }}
                key={item.id + "_rpe"}
              >
                {item["rpe"]}
              </Text>
            </View>
          )
        },

        label: "RPE",
        styles: {
          width: widthRPE,
        },
      },
      {
        renderItem(item, i) {
          return (
            <View
              key={i}
              style={{
                backgroundColor: "brown",

                width: widthCompletion,
              }}
            >
              <Text
                style={{ textAlign: "center" }}
                key={item.id + "_idk"}
              >
                {item["completed_at"]} compl
              </Text>
            </View>
          )
        },
        label: "Done?",
        styles: {
          width: widthCompletion,
        },
      },
    ]
  }, [])

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
  const exercise = useMemo(() => data?.sets[0].exercise, [data])

  // TODO rework this piece of hot garbage
  const height = useMemo(() => {
    return (
      exerciseNameHeight + // exercuse name
      listRowInnerHeight + // column names
      listOuterRowInnerHeight * (data?.sets.length ?? 0) +
      theme.spacing.lg
    )
  }, [data])

  return (
    <View
      style={{
        height: height,
      }}
    >
      {/* Exercise name */}
      <Text
        style={{
          alignSelf: "center",
          // backgroundColor: "red",
          // transform: [{ translateX: -listAligningTranslate }],
          height: exerciseNameHeight,
        }}
        preset="subheading"
        size="sm"
        numberOfLines={2}
      >
        {exercise?.name ?? " "}
      </Text>

      {/* Header Row */}
      <View
        style={{
          height: listRowInnerHeight,
          width: "100%",
          paddingHorizontal: iosListHorizontalMargin,
          transform: [
            {
              translateX: deleteEnabled
                ? iosListDeleteModeMargin
                : moveEnabled
                  ? -iosListMoveModeMargin
                  : -listAligningTranslate,
            },
          ],
          flexDirection: "row",
          marginRight: iosListMargin,
        }}
      >
        {columns.map((col, i) => (
          <Text
            key={i}
            style={{
              // flex: 1,

              height: 24,
              marginTop: 8,
              textAlign: "center",
              ...col.styles,
              backgroundColor: testColors[i],
            }}
            numberOfLines={1}
            text={col.label}
          ></Text>
        ))}
      </View>

      <List
        scrollEnabled={false}
        editModeEnabled={editModeEnabled}
        onSelectionChange={(items) => alert(`indexes of selected items: ${items.join(", ")}`)}
        moveEnabled={moveEnabled}
        onMoveItem={(from, to) => alert(`moved item at index ${from} to index ${to}`)}
        onDeleteItem={(item) => alert(`deleted item at index: ${item}`)}
        // TODO center the underlines
        style={{
          transform: [{ translateX: -10 }],
        }}
        listStyle="plain"
        deleteEnabled={deleteEnabled}
        selectEnabled={selectEnabled}
      >
        {data?.sets.map((set, i) => (
          // set rows
          <View
            key={i}
            style={{
              flexDirection: "row",
              backgroundColor: "dodgerBlue",
              marginRight: iosListMargin,
              height: listRowInnerHeight,
            }}
          >
            {columns.map((col, i) => col.renderItem(set, i))}
          </View>
        ))}
      </List>
    </View>
  )
}
