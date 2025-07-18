import { useEffect, useMemo, useState } from "react"
import { Image, PlatformColor, View } from "react-native"
import { Button, Label } from "@expo/ui/swift-ui"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import { AppleIcon } from "react-native-bottom-tabs"
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { exercise_equipment, exercise_muscle_areas, exercises } from "@/db/sqlite/schema"
import { useDB } from "@/db/sqlite/useDB"
import { useAppTheme } from "@/theme/context"
import { exerciseImages } from "@/utils/exerciseImages"
import { IosPlatformColor } from "@/utils/iosColors"

import { useExerciseSelectContext } from "./ExerciseSelectContext"
import { ListItem } from "../Ignite/ListItem"
import { ListView } from "../Ignite/ListView"
import { Screen } from "../Ignite/Screen"
import { Text } from "../Ignite/Text"

// If the search was left open when the sheet was closed, the state is somehow preserved
const searchMargin = 46
const negativeMargin = -10 // fills space when search is collapse upward
const listElementHeight = 64
const bottomOverlayHeight = 120

export function ExerciseSelectContents() {
  const { theme } = useAppTheme()
  const { bottom } = useSafeAreaInsets()
  const { drizzleDB } = useDB()

  const { searchOpen, searchString, sortDirection, sortType, area, equipment } =
    useExerciseSelectContext()

  const { data } = useLiveQuery(
    drizzleDB.query.exercises.findMany({
      where(fields, operators) {
        const searchStringFilter = searchString
          ? operators.like(fields.name, `%${searchString}%`)
          : null

        const areaFilter = area
          ? operators.exists(
              drizzleDB
                .select()
                .from(exercise_muscle_areas)
                .where(
                  operators.and(
                    operators.eq(exercise_muscle_areas.exercise_id, fields.id),
                    operators.eq(exercise_muscle_areas.muscle_area_id, area),
                  ),
                ),
            )
          : null

        const equipmentFilter = equipment
          ? operators.exists(
              drizzleDB
                .select()
                .from(exercise_equipment)
                .where(
                  operators.and(
                    operators.eq(exercise_equipment.exercise_id, fields.id),
                    operators.eq(exercise_equipment.equipment_id, equipment),
                  ),
                ),
            )
          : null

        const filters = [searchStringFilter, equipmentFilter, areaFilter].filter((f) => f !== null)

        return filters.length ? operators.and(...filters) : undefined
      },
      columns: {
        id: true,
        name: true,
        images: true,
      },
      with: {
        exerciseMuscleAreas: {
          columns: {},
          with: {
            muscleArea: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
      // TODO implement different sorting mechanisms
      orderBy(fields, operators) {
        return sortDirection === "ASC" ? operators.asc(fields.name) : operators.desc(fields.name)
      },
    }),
    [exercises, searchString, area, equipment, sortDirection],
  )

  useEffect(() => {
    // console.log("query & update time ", Date.now() - time)
  }, [data])

  // Animated margin
  const animatedMargin = useSharedValue(searchOpen ? negativeMargin : searchMargin)

  useEffect(() => {
    // Timings similar to iOS native animation
    animatedMargin.value = withTiming(searchOpen ? negativeMargin : searchMargin, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    })
  }, [searchOpen])

  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const nSelected = useMemo(() => Object.keys(selected).length, [selected])

  return (
    <Screen safeAreaEdges={["top"]}>
      <Animated.View
        style={{
          marginTop: animatedMargin,
          marginBottom: -negativeMargin,
          backgroundColor: theme.colors.background,
          height: "100%",
        }}
      >
        {/* Exercise list */}
        <View
          style={{
            flexGrow: 1,
          }}
        >
          <ListView
            contentInset={{
              bottom:
                (searchOpen ? 0 : searchMargin) + bottom + theme.spacing.xl + bottomOverlayHeight,
            }}
            scrollIndicatorInsets={{
              bottom:
                (searchOpen ? 0 : searchMargin) + bottom + theme.spacing.xl + bottomOverlayHeight,
            }}
            extraData={selected}
            ItemSeparatorComponent={() => <View style={{ height: theme.spacing.xxs }}></View>}
            renderItem={({ item }) => (
              <ListItem
                style={{
                  flexGrow: 1,
                  height: listElementHeight,
                  paddingVertical: theme.spacing.sm,
                  paddingHorizontal: theme.spacing.md,
                  gap: theme.spacing.sm,

                  flexDirection: "row",
                  alignItems: "center",

                  backgroundColor:
                    item.id in selected ? PlatformColor(IosPlatformColor.systemGray5) : undefined,
                }}
                containerStyle={{
                  borderColor: "purple",
                  // borderWidth: 2,
                  borderStyle: "dashed",
                }}
                onPress={(e) => {
                  setSelected((obj) => {
                    const wasSelected = item.id in obj
                    if (wasSelected) {
                      delete obj[item.id]
                    } else {
                      obj[item.id] = true
                    }

                    return { ...obj }
                  })
                }}
                LeftComponent={
                  // TODO fallback image
                  // TODO images remove bg
                  <Image
                    width={listElementHeight * 1.5}
                    height={listElementHeight}
                    style={{
                      height: listElementHeight,
                      width: listElementHeight * 1.5,
                    }}
                    source={exerciseImages[item.images[0]]}
                  />
                }
              >
                <View>
                  {/* This view below is normally sized( as tall as expected) */}
                  <View
                    style={{
                      flexDirection: "column",
                      height: listElementHeight,
                      marginTop: -theme.spacing.md - theme.spacing.xxs,

                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      preset="formLabel"
                      weight="normal"
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>

                    <Text
                      preset="formHelper"
                      weight="light"
                      style={{ marginTop: -theme.spacing.xxs }}
                      size="xs"
                      numberOfLines={1}
                    >
                      {item.exerciseMuscleAreas.map((e) => e.muscleArea.name).join(" / ")}
                    </Text>
                  </View>
                </View>
              </ListItem>
            )}
            data={data}
          ></ListView>
        </View>
      </Animated.View>

      <View
        style={{
          position: "absolute",
          bottom: bottom + 32, // 32 accounts for being inside the sheet
          zIndex: 1,
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: bottom,
          paddingTop: theme.spacing.md,
          paddingHorizontal: theme.spacing.md,
          height: bottomOverlayHeight,
          width: "100%",
          backgroundColor: PlatformColor(IosPlatformColor.systemGray6),
          flexDirection: "column",
        }}
      >
        <Label
          title={
            nSelected
              ? `${nSelected} Exercise${nSelected === 1 ? "" : "s"} Selected`
              : "Select Items"
          }
        ></Label>
        <View
          style={{
            flexDirection: "row",
            gap: theme.spacing.md,
            paddingHorizontal: theme.spacing.lg,
          }}
        >
          <Button
            disabled={nSelected === 0}
            variant="accessoryBarAction"
            style={{
              marginTop: 6,
              marginRight: -12,
            }}
            onPress={() => {
              setSelected({})
            }}
            systemImage={"xmark.circle" as AppleIcon["sfSymbol"]}
          >
            {" "}
          </Button>
          <Button
            disabled={nSelected < 2}
            variant="bordered"
            systemImage={"link" as AppleIcon["sfSymbol"]}
          >
            Superset
          </Button>

          <Button
            disabled={nSelected === 0}
            variant="borderedProminent"
            systemImage="list.bullet"
          >
            Add Exercises
          </Button>
        </View>
      </View>
    </Screen>
  )
}
