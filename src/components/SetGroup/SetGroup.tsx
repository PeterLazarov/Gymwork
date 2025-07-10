import { useEffect, useMemo } from "react"
import { View } from "react-native"
import { List } from "@expo/ui/swift-ui"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"

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

  // TODO get from exercise config
  const headerCols = ["Set #", "KG", "Reps", "RPE", "Done"]

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
                  : 0,
            },
          ],
          flexDirection: "row",
          marginRight: iosListMargin,
        }}
      >
        {headerCols.map((col, i) => (
          <Text
            key={col}
            style={{
              flex: 1,
              height: 24,
              marginTop: 8,
              textAlign: "center",
              // backgroundColor: testColors[i],
            }}
            numberOfLines={1}
            text={col}
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
              // backgroundColor: "red",
              marginRight: iosListMargin,
            }}
          >
            <View
              style={{
                flex: 1,
                height: listRowInnerHeight,
                transform: [
                  { translateX: listAligningTranslate + (moveEnabled || deleteEnabled ? -20 : 0) },
                ],
                justifyContent: "center",
                alignItems: "center",
                // backgroundColor: "blue",
              }}
            >
              <Text>{set.position}</Text>
            </View>
            <View
              style={{
                flex: 1,
                height: listRowInnerHeight,
                transform: [
                  { translateX: listAligningTranslate + (moveEnabled || deleteEnabled ? -20 : 0) },
                ],

                justifyContent: "center",
                alignItems: "center",
                // backgroundColor: "green",
              }}
            >
              <Text>{set.weight_mcg! / 1_000_000_000}</Text>
            </View>
            <View
              style={{
                flex: 1,
                height: listRowInnerHeight,
                transform: [
                  { translateX: listAligningTranslate + (moveEnabled || deleteEnabled ? -20 : 0) },
                ],

                justifyContent: "center",
                alignItems: "center",
                // backgroundColor: "yellow",
              }}
            >
              <Text>{set.reps}</Text>
            </View>
            <View
              style={{
                flex: 1,
                height: listRowInnerHeight,
                transform: [
                  { translateX: listAligningTranslate + (moveEnabled || deleteEnabled ? -20 : 0) },
                ],

                justifyContent: "center",
                alignItems: "center",
                // backgroundColor: "blue",
              }}
            >
              <Text>{set.rpe}</Text>
            </View>
            <View
              style={{
                flex: 1,
                height: listRowInnerHeight,
                transform: [
                  { translateX: listAligningTranslate + (moveEnabled || deleteEnabled ? -20 : 0) },
                ],

                justifyContent: "center",
                alignItems: "center",
                // backgroundColor: "brown",
              }}
            >
              <Text>{set.completed_at ? "Yes" : "No"}</Text>
            </View>
          </View>
        ))}
      </List>
    </View>
  )
}
