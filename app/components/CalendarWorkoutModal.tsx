import { DateTime } from 'luxon'
import { ScrollView, View, Text } from 'react-native'
import { Portal, Modal } from 'react-native-paper'

import CalendarWorkoutModalExerciseItem from './CalendarWorkoutModalExerciseItem'
import { useStores } from 'app/db/helpers/useStores'
import { Button, ButtonText, Divider, colors, fontSize } from 'designSystem'
import { translate } from 'app/i18n'

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

  const workout = workoutStore.dateWorkoutMap[workoutDate]

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
          <Text
            style={{
              fontSize: fontSize.lg,
              textAlign: 'center',
              padding: 16,
            }}
          >
            {label}
          </Text>
          <Divider orientation="horizontal" />
          <View style={{ flex: 1 }}>
            {workout ? (
              <ScrollView>
                {workout.steps.map(step => (
                  <CalendarWorkoutModalExerciseItem
                    key={step.guid}
                    exercise={step.exercise}
                    sets={step.sets}
                  />
                ))}
              </ScrollView>
            ) : null}
          </View>
          <Divider orientation="horizontal" />
          <View style={{ flexDirection: 'row' }}>
            <Button
              variant="tertiary"
              style={{ flex: 1 }}
              onPress={onClose}
            >
              <ButtonText variant="tertiary">{translate('cancel')}</ButtonText>
            </Button>
            <Button
              variant="tertiary"
              style={{ flex: 1 }}
              onPress={action}
            >
              <ButtonText variant="tertiary"> {actionText}</ButtonText>
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  )
}

export default CalendarWorkoutModal
