import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import { observer } from 'mobx-react-lite'
import React, { useMemo, useRef, useState } from 'react'
import { Button, Platform, StyleSheet, View } from 'react-native'
import { Searchbar } from 'react-native-paper'
import { TrueSheet } from '@lodev09/react-native-true-sheet'

import { TabHeightCompensation } from '@/navigators/constants'
import { useAppTheme } from '@/utils/useAppTheme'
import EmptyState from 'app/components/EmptyState'
import WorkoutModal from 'app/components/WorkoutModal'
import { useStores } from 'app/db/helpers/useStores'
import { Workout, discomfortOptions } from 'app/db/models'
import { translate } from 'app/i18n'
import { searchString } from 'app/utils/string'
import { FAB, FeedbackPickerOption, spacing, Text } from 'designSystem'

import WorkoutReviewListItem from './WorkoutReviewListItem'

const WorkoutsReview: React.FC = () => {
  const { workoutStore, exerciseStore } = useStores()

  const [filterString, setFilterString] = useState('')
  const [filterDiscomforedLevels, setFilterDiscomforedLevels] = useState<
    string[]
  >([])
  const [filterMuscleAreas, setFilterMuscleAreas] = useState([] as string[])

  function filterWorkout(workout: Workout) {
    const discomfortFilter =
      filterDiscomforedLevels.length === 0 ||
      (workout.pain && filterDiscomforedLevels.includes(workout.pain))

    const notesFilter =
      filterString === '' ||
      (workout.notes !== '' &&
        searchString(filterString, word =>
          workout.notes.toLowerCase().includes(word)
        ))

    const workoutMuscleAreas = workout.exercises.flatMap(
      e => e.muscleAreas
    ) as string[]

    const muscleAreaFilter = filterMuscleAreas.every(area =>
      workoutMuscleAreas.includes(area)
    )

    return discomfortFilter && notesFilter && muscleAreaFilter
  }

  const filteredWorkouts = useMemo(() => {
    return workoutStore.sortedReverseWorkouts.filter(filterWorkout)
  }, [
    workoutStore.workouts,
    filterDiscomforedLevels,
    filterString,
    filterMuscleAreas,
  ])

  const [openedWorkout, setOpenedWorkout] = useState<Workout | undefined>()

  function onDiscomfortFilterPress(optionValue: string) {
    const isSelected = filterDiscomforedLevels.includes(optionValue)
    if (isSelected) {
      setFilterDiscomforedLevels(oldValue =>
        oldValue.filter(opt => opt !== optionValue)
      )
    } else {
      setFilterDiscomforedLevels(oldValue => [...oldValue, optionValue])
    }
  }

  const { theme } = useAppTheme()

  const renderItem = ({ item }: ListRenderItemInfo<Workout>) => {
    return (
      <WorkoutReviewListItem
        workout={item}
        onPress={() => setOpenedWorkout(item)}
      />
    )
  }

  // filter logic
  const sheet = useRef<TrueSheet>(null)

  const showFilters = async () => {
    await sheet.current?.present()
  }

  const reset = async () => {
    setFilterMuscleAreas([])
    setFilterDiscomforedLevels([])
    setFilterString('')
  }

  function toggleMuscleArea(muscle: string) {
    setFilterMuscleAreas(muscles =>
      muscles.includes(muscle)
        ? muscles.filter(m => m !== muscle)
        : muscles.concat(muscle)
    )
  }

  return (
    <>
      <View style={styles.screen}>
        {filteredWorkouts.length > 0 ? (
          <FlashList
            data={filteredWorkouts}
            renderItem={renderItem}
            keyExtractor={workout => `${workout.date}_${workout.guid}`}
            contentContainerStyle={{ paddingBottom: TabHeightCompensation }}
          />
        ) : (
          <EmptyState text={translate('commentsLogEmpty')} />
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

      <FAB
        icon="filter"
        onPress={showFilters}
        style={{
          bottom: theme.spacing.lg + TabHeightCompensation,
          right: theme.spacing.lg,
        }}
      />

      <TrueSheet
        ref={sheet}
        sizes={['auto', 'large']}
        contentContainerStyle={{
          paddingTop: theme.spacing.md,
          paddingBottom: Platform.select({ ios: theme.spacing.md, android: 0 }),
        }}
      >
        <Searchbar
          placeholder={translate('search')}
          onChangeText={setFilterString}
          value={filterString}
          mode="view"
        />
        <View style={styles.filterOptionList}>
          {Object.values(discomfortOptions).map(option => (
            <FeedbackPickerOption
              key={option.value}
              option={option}
              isSelected={filterDiscomforedLevels.includes(option.value)}
              onPress={() => onDiscomfortFilterPress(option.value)}
              compactMode
              style={styles.filterOption}
            />
          ))}
        </View>

        <View style={{ padding: theme.spacing.xs, gap: theme.spacing.xs }}>
          <Text>{translate('muscleAreas')}</Text>

          <View
            style={{
              gap: theme.spacing.xs,
              flexWrap: 'wrap',
              flexDirection: 'row',
            }}
          >
            {exerciseStore.muscleAreaOptions.map(muscle => (
              // fake-ass chips because react-native-paper ones shift layout on activaion
              <Button
                onPress={() => toggleMuscleArea(muscle)}
                key={muscle}
                color={
                  filterMuscleAreas.includes(muscle)
                    ? theme.colors.primary
                    : theme.colors.outline
                }
                title={muscle}
              />
            ))}
          </View>
        </View>

        <Button
          onPress={reset}
          title={translate('reset')}
          color={theme.colors.primary}
        />
      </TrueSheet>
    </>
  )
}

const styles = StyleSheet.create({
  filterOption: {
    backgroundColor: 'transparent',
  },
  filterOptionList: {
    flexDirection: 'row',
    margin: spacing.xs,
  },
  list: {
    flexBasis: 0,
    // backgroundColor:
  },
  screen: {
    display: 'flex',
    flexGrow: 1,
  },
})

export default observer(WorkoutsReview)
