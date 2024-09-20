import { observer } from 'mobx-react-lite'
import React, { useMemo, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'

import EmptyState from 'app/components/EmptyState'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { Exercise, Workout } from 'app/db/models'
import CommentReviewListItem from './CommentReviewListItem'
import WorkoutModal from 'app/components/WorkoutModal'

type Props = {
  exercise?: Exercise
}

const CommentsReview: React.FC<Props> = props => {
  const {
    workoutStore,
    // navStore: { navigate },
  } = useStores()

  const commentedWorkouts = useMemo(
    () => workoutStore.workouts.filter(w => w.hasComments),
    [workoutStore.workouts]
  )

  const [openedWorkout, setOpenedWorkout] = useState<Workout | undefined>()

  return (
    <>
      <View style={styles.screen}>
        {commentedWorkouts.length > 0 ? (
          <ScrollView style={styles.list}>
            {commentedWorkouts.map(workout => {
              return (
                <CommentReviewListItem
                  key={workout.guid}
                  workout={workout}
                  onPress={() => setOpenedWorkout(workout)}
                />
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
  list: {
    flexBasis: 0,
  },
})

export default observer(CommentsReview)
