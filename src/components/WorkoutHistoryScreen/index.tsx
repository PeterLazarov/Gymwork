import { useCallback, useEffect, useMemo, useState } from "react"
import { View, StyleSheet, Pressable } from "react-native"
import { Menu, Searchbar } from "react-native-paper"

import { WorkoutModel } from "@/db/models/WorkoutModel"
import {
  EmptyState,
  fontSize,
  Header,
  Icon,
  IconButton,
  IndicatedScrollList,
  palettes,
  spacing,
  Text,
  useColors,
} from "@/designSystem"
import { BaseLayout } from "@/layouts/BaseLayout"
import { navigate } from "@/navigators/navigationUtilities"
import { formatDateIso, msToIsoDate, translate } from "@/utils"
import { ListRenderItemInfo } from "@shopify/flash-list"
import { WorkoutModal } from "../CalendarScreen/WorkoutModal"
import { MuscleMap } from "@/components/shared/MuscleMap"
import { discomfortOptions } from "@/constants/enums"
import { FilterForm, isFilterEmpty, WorkoutsFilterModal } from "./components/WorkoutsFilterModal"
import { useAllWorkoutsFullQuery } from "@/db/queries/useAllWorkoutsFullQuery"

export const WorkoutsHistoryScreen: React.FC = () => {
  const [filterString, setFilterString] = useState("")
  const [filter, setFilter] = useState<FilterForm>({})
  const filterEmpty = isFilterEmpty(filter)
  const [workouts, setWorkouts] = useState<WorkoutModel[]>([])

  const workoutFullQuery = useAllWorkoutsFullQuery()

  useEffect(() => {
    workoutFullQuery(filter, filterString).then((results) => {
      const models = results.map((workout) => new WorkoutModel(workout))
      setWorkouts(models)
    })
  }, [filter, filterString])

  const [openedWorkout, setOpenedWorkout] = useState<WorkoutModel | undefined>()
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const renderItem = useCallback(({ item }: ListRenderItemInfo<WorkoutModel>) => {
    return (
      <WorkoutListItem
        key={item.id}
        workout={item}
        onPress={() => setOpenedWorkout(item)}
      />
    )
  }, [])

  const keyExtractor = useCallback((workout: WorkoutModel) => `${workout.date}_${workout.id}`, [])

  const colors = useColors()
  const styles = useMemo(() => makeStyles(colors), [colors])

  function onBackPress() {
    navigate("Workout")
  }

  function goToFeedback() {
    setMenuOpen(false)
    navigate("UserFeedback", { referrerPage: "WorkoutsHistory" })
  }

  return (
    <BaseLayout>
      <Header>
        <IconButton
          onPress={onBackPress}
          underlay="darker"
        >
          <Icon
            icon="chevron-back"
            color={colors.onPrimary}
          />
        </IconButton>
        <Header.Title title={translate("workouts")} />
        <Menu
          visible={menuOpen}
          onDismiss={() => setMenuOpen(false)}
          anchorPosition="bottom"
          anchor={
            <IconButton
              onPress={() => setMenuOpen(true)}
              underlay="darker"
            >
              <Icon
                icon="ellipsis-vertical"
                color={colors.onPrimary}
              />
            </IconButton>
          }
        >
          <Menu.Item
            onPress={goToFeedback}
            title={translate("giveFeedback")}
          />
        </Menu>
      </Header>
      <View style={styles.screen}>
        <Searchbar
          placeholder={translate("search")}
          onChangeText={setFilterString}
          value={filterString}
          mode="bar"
          right={() => (
            <>
              {(!filterEmpty || filterString.trim() !== "") && (
                <IconButton
                  onPress={() => {
                    setFilter({})
                    setFilterString("")
                  }}
                >
                  <Icon icon="close" />
                </IconButton>
              )}
              <IconButton onPress={() => setFilterModalOpen(true)}>
                {!filterEmpty && <Icon icon="filter" />}
                {filterEmpty && <Icon icon="filter-outline" />}
              </IconButton>
            </>
          )}
          style={{ borderRadius: 0 }}
        />
        {workouts.length > 0 ? (
          <>
            <IndicatedScrollList
              data={workouts}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
            />
            <View style={styles.workoutCount}>
              <Text>{translate("workoutsCount", { count: workouts.length })}</Text>
            </View>
          </>
        ) : (
          <EmptyState text={translate("noWorkoutsEntered")} />
        )}
      </View>
      {openedWorkout && (
        <WorkoutModal
          open={!!openedWorkout}
          workout={openedWorkout}
          onClose={() => setOpenedWorkout(undefined)}
          mode="view"
          showComments
        />
      )}
      <WorkoutsFilterModal
        open={filterModalOpen}
        closeModal={() => setFilterModalOpen(false)}
        applyFilter={setFilter}
      />
    </BaseLayout>
  )
}
const makeStyles = (colors: any) =>
  StyleSheet.create({
    screen: {
      display: "flex",
      flexGrow: 1,
    },
    filterOptionList: {
      flexDirection: "row",
      margin: spacing.xs,
    },
    filterOption: {
      backgroundColor: "transparent",
    },
    list: {
      flexBasis: 0,
      // backgroundColor:
    },
    workoutCount: {
      alignItems: "center",
      paddingVertical: spacing.xxs,
      backgroundColor: colors.surfaceVariant,
    },
  })

type WorkoutListItemProps = {
  workout: WorkoutModel
  onPress: () => void
}

const WorkoutListItem: React.FC<WorkoutListItemProps> = ({ workout, onPress }) => {
  const colors = useColors()
  const styles = makeWorkoutItemStyles(colors)

  const muscles = useMemo(() => workout.muscles, [workout.muscles])
  const muscleAreas = useMemo(() => workout.muscleAreas, [workout.muscleAreas])

  const muscleMapContainerStyle = useMemo(() => [styles.muscleMapContainer], [styles])
  const rowStyle = useMemo(() => [styles.row], [styles])
  const betweenStyle = useMemo(() => [styles.between], [styles])

  return (
    <Pressable
      onPress={onPress}
      style={styles.container}
    >
      <View>
        <View style={betweenStyle}>
          <View>
            <Text style={styles.title}>{formatDateIso(msToIsoDate(workout.date!), "long")}</Text>
          </View>

          <View style={rowStyle}>
            <View style={muscleMapContainerStyle}>
              <MuscleMap
                muscles={muscles}
                muscleAreas={muscleAreas}
                back={false}
                activeColor={palettes.gold["80"]}
                inactiveColor={colors.outline}
                baseColor={colors.bodyBase}
              />
            </View>
            <View style={muscleMapContainerStyle}>
              <MuscleMap
                muscles={muscles}
                muscleAreas={muscleAreas}
                back={true}
                activeColor={palettes.gold["80"]}
                inactiveColor={colors.outline}
                baseColor={colors.bodyBase}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.stats}>
        {workout.comments.name && (
          <View style={styles.surface}>
            <Text>{workout.comments.name}</Text>
          </View>
        )}
        {workout.durationMs && (
          <View style={styles.surface}>
            <Text
              numberOfLines={1}
              style={styles.surfaceTitle}
            >
              {translate("duration")}
              {workout.durationMs}
              {typeof workout.durationMs}
              {workout.durationMs}
              {translate("duration")}
            </Text>

            <Text
              numberOfLines={1}
              style={styles.surfaceBodyBold}
            >
              {translate("durationMinutes" as any, {
                count: Math.ceil(workout.durationMs!),
              })}
            </Text>
          </View>
        )}

        {workout.rpe && (
          <View style={styles.surface}>
            <Text
              numberOfLines={1}
              style={styles.surfaceTitle}
            >
              {translate("difficulty")}
            </Text>
            <Text
              numberOfLines={1}
              style={styles.surfaceBodyBold}
            >
              {translate("diffValue", { rpe: workout.rpe })}
            </Text>
          </View>
        )}

        {workout.pain && (
          <View style={styles.surface}>
            <Text
              numberOfLines={1}
              style={styles.surfaceTitle}
            >
              {translate("discomfort")}
            </Text>

            <Text
              numberOfLines={1}
              style={styles.surfaceBodyBold}
            >
              {discomfortOptions[workout.pain].label}
            </Text>
          </View>
        )}
      </View>

      {workout.comments.notes.length > 0 && (
        <View style={styles.surface}>
          <Text>{workout.comments.notes}</Text>
        </View>
      )}
    </Pressable>
  )
}

const makeWorkoutItemStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      display: "flex",
      flex: 1,
      justifyContent: "center",
      padding: spacing.xs,
      gap: spacing.sm,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: fontSize.lg,
      fontWeight: "500",
      marginLeft: spacing.sm,
      textAlign: "center",
    },
    stats: { flex: 1, gap: spacing.xs, flexDirection: "row" },
    surface: {
      backgroundColor: colors.surfaceContainer,
      borderRadius: spacing.sm,
      padding: spacing.sm,
      flex: 1,
    },
    surfaceTitle: {
      fontSize: fontSize.xs,
      color: colors.onSurfaceVariant,
      textTransform: "capitalize",
    },
    surfaceBodyBold: {
      fontSize: fontSize.sm,
      fontWeight: "500",
      color: colors.onSurface,
    },
    muscleMapContainer: {
      height: 80,
      width: 60,
    },
    row: {
      flexDirection: "row",
    },
    between: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  })
