import { observer } from 'mobx-react-lite'
import React, { Fragment, useMemo, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { Exercise, Workout, discomfortOptions } from 'app/db/models'
import CommentReviewListItem from './CommentReviewListItem'
import WorkoutModal from 'app/components/WorkoutModal'
import { Divider, FeedbackPickerOption } from 'designSystem'

type Props = {
  exercise?: Exercise
}

const CommentsReview: React.FC<Props> = props => {
  const { workoutStore } = useStores()

  const [filterDiscomforedLevels, setFilterDiscomforedLevels] = useState<
    string[]
  >([])
  const commentedWorkouts = useMemo(
    () =>
      workoutStore.workouts.filter(
        w =>
          w.hasComments &&
          (filterDiscomforedLevels.length === 0 ||
            (w.pain && filterDiscomforedLevels.includes(w.pain)))
      ),
    [workoutStore.workouts, filterDiscomforedLevels]
  )

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

  return (
    <>
      <View style={styles.screen}>
        <View style={styles.filterOptionList}>
          {Object.values(discomfortOptions).map(option => (
            <FeedbackPickerOption
              option={option}
              isSelected={filterDiscomforedLevels.includes(option.value)}
              onPress={() => onDiscomfortFilterPress(option.value)}
              compactMode
              style={styles.filterOption}
            />
          ))}
        </View>
        {commentedWorkouts.length > 0 ? (
          <ScrollView style={styles.list}>
            {commentedWorkouts.map((workout, index) => {
              return (
                <Fragment key={workout.guid}>
                  <CommentReviewListItem
                    workout={workout}
                    onPress={() => setOpenedWorkout(workout)}
                  />
                  <Divider
                    orientation="horizontal"
                    variant="neutral"
                  />
                </Fragment>
              )
            })}
          </ScrollView>
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
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    marginTop: 16,
    display: 'flex',
    flexGrow: 1,
  },
  filterOptionList: {
    flexDirection: 'row',
  },
  filterOption: {
    backgroundColor: 'transparent',
  },
  list: {
    flexBasis: 0,
  },
})

export default observer(CommentsReview)
