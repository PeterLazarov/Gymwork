import { DateTime } from 'luxon'
import { ScrollView, View } from 'react-native'
import { Portal, Modal } from 'react-native-paper'

import CalendarWorkoutModalStepItem from './CalendarWorkoutModalStepItem'
import { useStores } from 'app/db/helpers/useStores'
import {
  Text,
  Button,
  ButtonText,
  Divider,
  ToggleSwitch,
  fontSize,
  useColors,
} from 'designSystem'
import { translate } from 'app/i18n'
import { useState } from 'react'

type Props = {
  open: boolean
  workoutDate: string
  onClose: () => void
  calendarAction: () => void
  mode: 'copy' | 'view'
}
const CalendarWorkoutModal: React.FC<Props> = ({
  open,
  workoutDate,
  onClose,
  calendarAction,
  mode,
}) => {
  const { workoutStore, stateStore } = useStores()
  const [includeSets, setIncludeSets] = useState(true)

  const luxonDate = DateTime.fromISO(workoutDate)
  const label = luxonDate.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)

  const workout = workoutStore.dateWorkoutMap[workoutDate]!

  const colors = useColors()

  const onActionPress = () => {
    if (mode === 'copy') {
      const workout = workoutStore.dateWorkoutMap[workoutDate]

      workoutStore.copyWorkout(workout!, includeSets)
    } else if (mode === 'view') {
      stateStore.setOpenedDate(workoutDate)
    }
    calendarAction()
  }

  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: colors.mat.surface,
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
          <Divider
            orientation="horizontal"
            variant="primary"
          />
          <View style={{ flex: 1 }}>
            <ScrollView>
              {workout.steps.map(step => (
                <CalendarWorkoutModalStepItem
                  key={step.guid}
                  step={step}
                />
              ))}
            </ScrollView>
            {mode === 'copy' && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 5,
                  gap: 10,
                }}
              >
                <Text style={{ color: colors.mat.onSurface }}>
                  {translate('includeSets')}
                </Text>
                <ToggleSwitch
                  variant="primary"
                  value={includeSets}
                  onValueChange={setIncludeSets}
                />
              </View>
            )}
          </View>
          <Divider
            orientation="horizontal"
            variant="primary"
          />
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
              onPress={onActionPress}
            >
              <ButtonText variant="tertiary">
                {translate(mode === 'copy' ? 'copyWorkout' : 'goToWorkout')}
              </ButtonText>
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  )
}

export default CalendarWorkoutModal
