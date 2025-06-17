import { ListRenderItemInfo } from '@shopify/flash-list'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Searchbar } from 'react-native-paper'

import EmptyState from 'app/components/EmptyState'
import WorkoutModal from 'app/components/WorkoutModal'
import { useStores } from 'app/db/helpers/useStores'
import { Workout } from 'app/db/models'
import { translate } from 'app/i18n'
import { searchString } from 'app/utils/string'
import {
  Icon,
  IconButton,
  IndicatedScrollList,
  Text,
  spacing,
  useColors,
} from 'designSystem'
import WorkoutReviewListItem from './WorkoutReviewListItem'
import WorkoutsFilterModal, {
  FilterForm,
  applyWorkoutFilter,
  isFilterEmpty,
} from './WorkoutsFilterModal'

const WorkoutsReview: React.FC = () => {
  const { workoutStore } = useStores()

  const [filterString, setFilterString] = useState('')
  const [filter, setFilter] = useState<FilterForm>({})
  const filterEmpty = isFilterEmpty(filter)

  function filterWorkout(workout: Workout) {
    const modalFilterPassed = applyWorkoutFilter(filter, workout)

    const notesFilterPassed =
      filterString === '' ||
      (workout.notes !== '' &&
        searchString(filterString, word =>
          workout.notes.toLowerCase().includes(word)
        ))

    return modalFilterPassed && notesFilterPassed
  }

  const filteredWorkouts = useMemo(() => {
    return workoutStore.sortedReverseWorkouts.filter(filterWorkout)
  }, [workoutStore.workouts, filter, filterString])

  const [openedWorkout, setOpenedWorkout] = useState<Workout | undefined>()
  const [filterModalOpen, setFilterModalOpen] = useState(false)

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Workout>) => {
    return (
      <WorkoutReviewListItem
        key={item.guid}
        workout={item}
        onPress={() => setOpenedWorkout(item)}
      />
    )
  }, [])

  const keyExtractor = useCallback(
    (workout: Workout) => `${workout.date}_${workout.guid}`,
    []
  )

  const colors = useColors()
  const styles = useMemo(() => makeStyles(colors), [colors])

  return (
    <>
      <View style={styles.screen}>
        <Searchbar
          placeholder={translate('search')}
          onChangeText={setFilterString}
          value={filterString}
          mode="bar"
          right={() => (
            <IconButton onPress={() => setFilterModalOpen(true)}>
              {!filterEmpty && <Icon icon="filter" />}
              {filterEmpty && <Icon icon="filter-outline" />}
            </IconButton>
          )}
          style={{ borderRadius: 0 }}
        />
        {filteredWorkouts.length > 0 ? (
          <>
            <IndicatedScrollList
              data={filteredWorkouts}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              estimatedItemSize={243}
            />
            <View style={styles.workoutCount}>
              <Text>
                {translate('workoutsCount', {
                  count: filteredWorkouts.length,
                })}
              </Text>
            </View>
          </>
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
      <WorkoutsFilterModal
        open={filterModalOpen}
        closeModal={() => setFilterModalOpen(false)}
        applyFilter={setFilter}
      />
    </>
  )
}
const makeStyles = (colors: any) =>
  StyleSheet.create({
    screen: {
      display: 'flex',
      flexGrow: 1,
    },
    filterOptionList: {
      flexDirection: 'row',
      margin: spacing.xs,
    },
    filterOption: {
      backgroundColor: 'transparent',
    },
    list: {
      flexBasis: 0,
      // backgroundColor:
    },
    workoutCount: {
      alignItems: 'center',
      paddingVertical: spacing.xxs,
      backgroundColor: colors.surfaceVariant,
    },
  })

export default observer(WorkoutsReview)
