import { useFocusEffect } from "@react-navigation/native"
import { memo, useCallback, useMemo, useState } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { Searchbar } from "react-native-paper"

import { MuscleMap } from "@/components/shared/MuscleMap"
import { discomfortOptions } from "@/constants/enums"
import { WorkoutModel } from "@/db/models/WorkoutModel"
import { useAllWorkoutsFullQuery } from "@/db/queries/useAllWorkoutsFullQuery"
import {
  AppColors,
  EmptyState,
  fontSize,
  Header,
  Icon,
  IconButton,
  IndicatedScrollList,
  Menu,
  palettes,
  spacing,
  Text,
  useColors,
} from "@/designSystem"
import { BaseLayout } from "@/layouts/BaseLayout"
import { navigate } from "@/navigators/navigationUtilities"
import { formatDateIso, msToIsoDate, translate } from "@/utils"
import type { FlashListProps, ListRenderItemInfo } from "@shopify/flash-list"
import { WorkoutModal } from "../CalendarScreen/WorkoutModal"
import { FilterForm, isFilterEmpty, WorkoutsFilterModal } from "./components/WorkoutsFilterModal"

const ITEM_ESTIMATED_HEIGHT = 240

export const WorkoutsHistoryScreen: React.FC = () => {
  const [filterString, setFilterString] = useState("")
  const [filter, setFilter] = useState<FilterForm>({})
  const trimmedFilterString = filterString.trim()
  const filterEmpty = isFilterEmpty(filter)
  const hasAppliedFilters = !filterEmpty || trimmedFilterString.length > 0

  const rawWorkouts = useAllWorkoutsFullQuery(filter, trimmedFilterString)
  const workouts = useMemo(
    () => rawWorkouts.map((workout) => new WorkoutModel(workout)),
    [rawWorkouts],
  )

  const [openedWorkout, setOpenedWorkout] = useState<WorkoutModel | undefined>()
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useFocusEffect(
    useCallback(() => {
      return () => setMenuOpen(false)
    }, []),
  )

  const colors = useColors()
  const styles = useMemo(() => makeStyles(colors), [colors])

  function onBackPress() {
    navigate("Workout")
  }

  function resetFilters() {
    setFilter({})
    setFilterString("")
  }

  function goToFeedback() {
    setMenuOpen(false)
    requestAnimationFrame(() => navigate("UserFeedback", { referrerPage: "WorkoutsHistory" }))
  }

  const overrideItemLayout = useCallback<
    NonNullable<FlashListProps<WorkoutModel>["overrideItemLayout"]>
  >((layout, _item, _index, _maxColumns) => {
    const layoutWithSize = layout as { span?: number; size?: number }
    if (layoutWithSize.size == null) {
      layoutWithSize.size = ITEM_ESTIMATED_HEIGHT
    }
  }, [])

  const renderSearchActions = useCallback(() => {
    return (
      <>
        {hasAppliedFilters && (
          <IconButton onPress={resetFilters}>
            <Icon icon="close" />
          </IconButton>
        )}
        <IconButton onPress={() => setFilterModalOpen(true)}>
          {filterEmpty ? <Icon icon="filter-outline" /> : <Icon icon="filter" />}
        </IconButton>
      </>
    )
  }, [filterEmpty, hasAppliedFilters])

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<WorkoutModel>) => (
      <WorkoutListItem
        workout={item}
        onPress={setOpenedWorkout}
      />
    ),
    [setOpenedWorkout],
  )

  const keyExtractor = useCallback((workout: WorkoutModel) => `${workout.date}_${workout.id}`, [])

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
          position="bottom-right"
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
          right={renderSearchActions}
          style={styles.searchbar}
        />
        {workouts.length > 0 ? (
          <>
            <IndicatedScrollList
              data={workouts}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              overrideItemLayout={overrideItemLayout}
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
const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    screen: {
      display: "flex",
      flexGrow: 1,
    },
    searchbar: {
      borderRadius: 0,
    },
    workoutCount: {
      alignItems: "center",
      paddingVertical: spacing.xxs,
      backgroundColor: colors.surfaceVariant,
    },
  })

type WorkoutListItemProps = {
  workout: WorkoutModel
  onPress: (workout: WorkoutModel) => void
}

const WorkoutListItem: React.FC<WorkoutListItemProps> = ({ workout, onPress }) => {
  const colors = useColors()
  const styles = useMemo(() => makeWorkoutItemStyles(colors), [colors])

  return (
    <Pressable
      onPress={() => onPress(workout)}
      style={styles.container}
    >
      <View>
        <View style={styles.between}>
          <View>
            <Text style={styles.title}>{formatDateIso(msToIsoDate(workout.date!), "long")}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.muscleMapContainer}>
              <MuscleMap
                muscles={workout.muscles}
                muscleAreas={workout.muscleAreas}
                back={false}
                activeColor={palettes.gold["80"]}
                inactiveColor={colors.outline}
                baseColor={colors.bodyBase}
              />
            </View>
            <View style={styles.muscleMapContainer}>
              <MuscleMap
                muscles={workout.muscles}
                muscleAreas={workout.muscleAreas}
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

const makeWorkoutItemStyles = (colors: AppColors) =>
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
