import { useEffect } from "react"
import { Image, PlatformColor, View } from "react-native"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { exercise_equipment, exercise_muscle_areas, exercises } from "@/db/sqlite/schema"
import { useDB } from "@/db/useDB"
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

export function ExerciseSelectContents() {
  const { theme } = useAppTheme()
  const { bottom } = useSafeAreaInsets()
  const { drizzleDB } = useDB()

  const { searchOpen, searchString, sortDirection, sortType, area, equipment } =
    useExerciseSelectContext()

  console.log({ searchOpen, searchString, sortDirection, sortType, area, equipment })

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
    }),
    [exercises, searchString, area, equipment],
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

  return (
    <Screen safeAreaEdges={["top"]}>
      <Animated.View
        style={{
          marginTop: animatedMargin,
          marginBottom: -negativeMargin,
          backgroundColor: PlatformColor(IosPlatformColor.systemBackground),
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
              bottom: (searchOpen ? 0 : searchMargin) + bottom + theme.spacing.xxl,
            }}
            scrollIndicatorInsets={{
              bottom: (searchOpen ? 0 : searchMargin) + bottom + theme.spacing.xxl,
            }}
            renderItem={({ item }) => (
              <ListItem
                style={{
                  flexGrow: 1,
                  height: 64,
                  overflow: "hidden",
                  gap: theme.spacing.sm,
                }}
                containerStyle={{
                  position: "relative",
                }}
                onPress={(e) => {
                  // TODO
                  console.log(e)
                }}
                LeftComponent={
                  <Image
                    width={64}
                    height={64}
                    style={{ height: 64, width: 96 }}
                    source={exerciseImages[item.images[0]]}
                  />
                }
              >
                <View
                  style={{
                    flexDirection: "column",
                    position: "absolute",
                  }}
                >
                  <Text
                    preset="formLabel"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text
                    preset="formHelper"
                    numberOfLines={1}
                  >
                    {item.exerciseMuscleAreas.map((e) => e.muscleArea.name).join(" / ")}
                  </Text>
                </View>
              </ListItem>
            )}
            data={data}
          ></ListView>
        </View>
      </Animated.View>
    </Screen>
  )
}
