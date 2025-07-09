import React, { useMemo, useState } from "react"
import { View, ScrollView, Dimensions } from "react-native"
import { useRouter } from "expo-router"
import { Button, Label } from "@expo/ui/swift-ui"
import { and, gte, lte } from "drizzle-orm"
import { chunk } from "lodash"
import { AppleIcon } from "react-native-bottom-tabs"

import { BigButtonIos } from "@/components/BigButton.ios"
import { ExerciseSelect } from "@/components/ExerciseSelect/ExerciseSelect"
import { ListView } from "@/components/Ignite/ListView"
import { Screen } from "@/components/Ignite/Screen"
import { WorkoutOverviewContinueCard } from "@/components/WorkoutOverviewContinueCard"
import { WorkoutTemplateCard } from "@/components/WorkoutTemplateCard"
import { InsertTemplateWorkout, SelectWorkout, workouts } from "@/db/sqlite/schema"
import { useDB } from "@/db/useDB"
import { useAppTheme } from "@/theme/context"

// Inspiration - shortcuts / podcasts apps

const templateCardHeight = 100

const todayWorkouts: Array<SelectWorkout> = Array.from({ length: 2 }).map(
  (_, i): SelectWorkout => ({
    id: `${i}qweqwe`,
    name: `Workout ${new Date().toISOString()}`,
    completed_at: null,
    created_at: Date.now(),
    notes: null,
    scheduled_for: null,
    started_at: null,
    template_id: null,
  }),
)
const templates: Array<InsertTemplateWorkout> = Array.from({ length: 8 }, (_, i) => ({
  id: "123" + i,
  name: `Template ${i}`,
  created_at: Date.now() - i,
  notes: "tons",
}))

export default function Home() {
  const { theme } = useAppTheme()
  const router = useRouter()

  const [isExerciseSelectVisible, setIsExerciseSelectVisible] = useState(false)

  async function startWorkout() {
    setIsExerciseSelectVisible(true)
    // TODO
    // await drizzleDB
    //   .insert(workouts)
    //   .values({
    //     id: new Date().toISOString(),
    //   })
    //   .execute()
    // TODO
    // router.navigate("/(tabs)/expo/(SQLite)/workout")
  }
  const { drizzleDB } = useDB()
  const todayWorkoutsQuery = useMemo(() => {
    return drizzleDB
      .select()
      .from(workouts)
      .where(
        and(
          gte(workouts.created_at, new Date().setHours(0, 0, 0, 0)),
          lte(workouts.created_at, new Date().setHours(23, 59, 59, 999)),
        ),
      )
  }, [])
  // const { data: todayWorkouts } = useLiveQuery(todayWorkoutsQuery, [workouts])

  return (
    <Screen>
      <View
        style={{
          height: "100%",
          zIndex: 1,
          paddingVertical: theme.spacing.md,
          justifyContent: "space-between",
          gap: theme.spacing.md,
        }}
      >
        {/* Workout templates */}
        <View
          style={{
            gap: theme.spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: theme.spacing.md,
            }}
          >
            <Label
              title={templates.length ? "Start Workout From Template" : "Create Workout Templates"}
              systemImage={"list.bullet.rectangle" as AppleIcon["sfSymbol"]}
            />
            <Button
              systemImage={"square.and.pencil" as AppleIcon["sfSymbol"]}
              style={{ marginRight: -theme.spacing.sm }}
              onPress={() => {
                // TODO edit templates page link
              }}
            >
              {""}
            </Button>
          </View>

          <View>
            <ListView
              data={chunk(templates, 3)}
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToAlignment="start"
              snapToInterval={Dimensions.get("window").width / 2 - theme.spacing.md}
              contentContainerStyle={{ paddingHorizontal: theme.spacing.md }}
              estimatedListSize={{
                height: templateCardHeight,
                width: Dimensions.get("window").width / 2 - theme.spacing.md * 2,
              }}
              renderItem={({ item: items }) => (
                <View
                  style={{
                    // backgroundColor: "red",
                    gap: theme.spacing.md,
                  }}
                >
                  {items.map((item) => (
                    <WorkoutTemplateCard
                      style={{
                        height: templateCardHeight,
                        marginRight: theme.spacing.md,
                        width: Dimensions.get("window").width / 2 - theme.spacing.md * 2,
                      }}
                      key={item.name}
                      template={item}
                    />
                  ))}
                </View>
              )}
            />
          </View>
        </View>

        {/* Continue Workout */}
        {todayWorkouts?.length > 0 && (
          <View
            style={{
              flexGrow: 0,
              flexShrink: 0,
              gap: theme.spacing.md,
            }}
          >
            <Label
              systemImage={"dumbbell" as AppleIcon["sfSymbol"]}
              title="Continue Workout"
              style={{
                marginHorizontal: theme.spacing.md,
              }}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              bounces
              snapToInterval={Dimensions.get("window").width - theme.spacing.md * 2}
              snapToAlignment="start"
              decelerationRate="fast"
              style={{ flexGrow: 1, zIndex: 0 }}
              contentContainerStyle={{
                gap: theme.spacing.md,
                paddingHorizontal: theme.spacing.md,
                // backgroundColor: "red",
              }}
            >
              {todayWorkouts?.length ? (
                todayWorkouts.map((workout) => (
                  <WorkoutOverviewContinueCard
                    style={{
                      width: Dimensions.get("window").width - theme.spacing.md * 3,
                    }}
                    key={workout.id}
                    workout={workout}
                  />
                ))
              ) : (
                <Label title="No workouts today" />
              )}
            </ScrollView>
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Button
            variant="borderedProminent"
            onPress={startWorkout}
            systemImage="plus"
          >
            Start Empty Workout
          </Button>
        </View>
      </View>

      <ExerciseSelect
        isVisible={isExerciseSelectVisible}
        onSelect={(id) => {
          // TODO
        }}
        setIsVisible={setIsExerciseSelectVisible}
      />
    </Screen>
  )
}
