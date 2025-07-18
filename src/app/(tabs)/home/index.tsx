import React, { useMemo, useState } from "react"
import { View, ScrollView, FlatList, useWindowDimensions } from "react-native"
import { useRouter } from "expo-router"
import { Button, Label } from "@expo/ui/swift-ui"
import { and, gte, lte } from "drizzle-orm"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import { chunk } from "lodash"
import { AppleIcon } from "react-native-bottom-tabs"

import { ExerciseSelect } from "@/components/ExerciseSelect/ExerciseSelect"
import { Screen } from "@/components/Ignite/Screen"
import { WorkoutOverviewContinueCard } from "@/components/WorkoutOverviewContinueCard"
import { WorkoutTemplateCard } from "@/components/WorkoutTemplateCard"
import { InsertTemplateWorkout, SelectWorkout, workouts } from "@/db/sqlite/schema"
import { useDB } from "@/db/useDB"
import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"

// Inspiration - shortcuts / podcasts apps

const templateCardHeight = 100
const templateCardRows = 3

const todayWorkouts: Array<SelectWorkout> = Array.from({ length: 3 }).map(
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
const templates: Array<InsertTemplateWorkout> = Array.from({ length: 15 }, (_, i) => ({
  id: "123" + i,
  name: `Template ${i}`,
  created_at: Date.now() - i,
  notes: "tons",
}))

const listSpacing = spacing.sm
const templateCardCols = 2
const overlapSize = spacing.xxs
const listHorizontalPadding = spacing.md

export default function Home() {
  const { theme } = useAppTheme()
  const router = useRouter()
  const { width } = useWindowDimensions()
  const { drizzleDB } = useDB()

  // const { data: todayWorkouts } = useLiveQuery(todayWorkoutsQuery, [workouts])
  const { data: testWorkout } = useLiveQuery(
    drizzleDB.query.workouts.findFirst({
      columns: {
        id: true,
      },
    }),
  )

  const [isExerciseSelectVisible, setIsExerciseSelectVisible] = useState(false)

  // TODO rename to templateListIsScrollable
  const templateListScrollable = useMemo(
    () => templates.length > templateCardCols * templateCardRows,
    [templates.length],
  )
  const continueWorkoutListScrollable = useMemo(
    () => todayWorkouts.length > 1,
    [todayWorkouts.length],
  )

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

  const templateCardWidth = useMemo(() => {
    let allCardsWidth = width
    allCardsWidth -= listSpacing * (templateCardCols - 1)
    allCardsWidth -= listHorizontalPadding // left padding

    if (templateListScrollable)
      return (allCardsWidth - overlapSize - listSpacing) / templateCardCols // right spacing

    return (allCardsWidth - listHorizontalPadding) / templateCardCols
  }, [templateListScrollable, width])

  const workoutCardWidth = useMemo(() => {
    let allCardsWidth = width
    allCardsWidth -= listHorizontalPadding // left padding

    if (continueWorkoutListScrollable) return allCardsWidth - overlapSize - listSpacing // right spacing

    return allCardsWidth - listHorizontalPadding
  }, [continueWorkoutListScrollable, width])

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
            {/* Flashlist does not size properly */}
            <FlatList
              data={chunk(templates, templateCardRows)}
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToAlignment="start"
              snapToInterval={templateCardWidth + listSpacing}
              contentContainerStyle={{
                paddingHorizontal: listHorizontalPadding,
              }}
              ItemSeparatorComponent={(x) => <View style={{ height: 0, width: listSpacing }} />}
              renderItem={({ item: items }) => (
                <View
                  style={{
                    gap: listSpacing,
                    width: templateCardWidth,
                  }}
                >
                  {items.map((item) => (
                    <WorkoutTemplateCard
                      style={{
                        height: templateCardHeight,
                        width: templateCardWidth,
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
              snapToInterval={workoutCardWidth + listSpacing}
              snapToAlignment="start"
              decelerationRate="fast"
              style={{ flexGrow: 1, zIndex: 0 }}
              contentContainerStyle={{
                gap: listSpacing,
                paddingHorizontal: listHorizontalPadding,
              }}
            >
              {todayWorkouts?.length ? (
                todayWorkouts.map((workout) => (
                  <WorkoutOverviewContinueCard
                    style={{
                      width: workoutCardWidth,
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

          <Button
            variant="borderedProminent"
            disabled={!testWorkout?.id}
            onPress={() => {
              router.push(`/(tabs)/home/${testWorkout?.id}`, {})
            }}
            systemImage="plus"
          >
            Go to test workout
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
