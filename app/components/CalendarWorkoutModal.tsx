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
  onConfirm: () => void
  onClose: () => void
  confirmButtonText: string
}
const CalendarWorkoutModal: React.FC<Props> = ({
  open,
  workoutDate,
  onConfirm,
  onClose,
  confirmButtonText,
}) => {
  const { workoutStore } = useStores()
  const workout = workoutStore.getWorkoutForDate(workoutDate)!
  const exercises = workoutStore.getWorkoutExercises(workout)

  const groupedSets = groupBy(workout.sets, 'exercise.guid')

  const luxonDate = DateTime.fromISO(workout.date)
  const label = luxonDate.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)

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
            <ScrollView>
              {exercises.map(exercise => (
                <CalendarWorkoutModalExerciseItem
                  key={exercise.guid}
                  exercise={exercise}
                  sets={groupedSets[exercise.guid] as WorkoutSet[]}
                />
              ))}
            </ScrollView>
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
              onPress={onConfirm}
            >
              {confirmButtonText}
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  )
}

export default CalendarWorkoutModal
