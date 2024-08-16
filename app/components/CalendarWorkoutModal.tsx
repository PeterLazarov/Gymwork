import { DateTime } from 'luxon'
import { ScrollView, View } from 'react-native'
import { Portal, Modal, Button } from 'react-native-paper'

import CalendarWorkoutModalExerciseItem from './CalendarWorkoutModalExerciseItem'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutSet } from 'app/db/models'
import { groupBy } from 'app/utils/array'
import { Divider, HeadingLabel, colors } from 'designSystem'

type Props = {
  open: boolean
  workoutDate: string
  onClose: () => void
  action: () => void
  actionText: string
}
const CalendarWorkoutModal: React.FC<Props> = ({
  open,
  workoutDate,
  onClose,
  action,
  actionText,
}) => {
  const { workoutStore } = useStores()
  const luxonDate = DateTime.fromISO(workoutDate)
  const label = luxonDate.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)

  const workout = workoutStore.getWorkoutForDate(workoutDate)
  const exercises = workout ? workoutStore.getWorkoutExercises(workout) : null
  const groupedSets = workout ? groupBy(workout.sets, 'exercise.guid') : null

  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: colors.white,
          marginVertical: 8,
          marginHorizontal: 20,
          flex: 1,
        }}
      >
        <View style={{ height: '100%' }}>
          <HeadingLabel style={{ padding: 16 }}>{label}</HeadingLabel>
          <Divider orientation="horizontal" />
          <View style={{ flex: 1 }}>
            {workout ? (
              <ScrollView>
                {exercises?.map(exercise => (
                  <CalendarWorkoutModalExerciseItem
                    key={exercise.guid}
                    exercise={exercise}
                    sets={groupedSets?.[exercise.guid] as WorkoutSet[]}
                  />
                ))}
              </ScrollView>
            ) : null}
          </View>
          <Divider orientation="horizontal" />
          <View style={{ flexDirection: 'row' }}>
            <Button
              style={{ flex: 1 }}
              textColor={colors.tertiaryText}
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button
              style={{ flex: 1 }}
              textColor={colors.tertiaryText}
              onPress={action}
            >
              {actionText}
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  )
}

export default CalendarWorkoutModal
