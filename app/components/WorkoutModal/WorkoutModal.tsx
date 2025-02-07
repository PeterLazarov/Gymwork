import { DateTime } from 'luxon'
import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Modal, Portal } from 'react-native-paper'

import { useAppTheme } from '@/utils/useAppTheme'
import { useStores } from 'app/db/helpers/useStores'
import { Workout } from 'app/db/models'
import { translate } from 'app/i18n'
import {
  Button,
  ButtonText,
  Divider,
  Text,
  ToggleSwitch,
  fontSize,
  spacing,
} from 'designSystem'

import WorkoutCommentsCard from '../Workout/WorkoutCommentsCard'

import WorkoutModalStepItem from './WorkoutModalStepItem'
import { useNavigation } from '@react-navigation/native'

type Props = {
  open: boolean
  workout: Workout
  onClose: () => void
  mode: 'copy' | 'view'
  showComments?: boolean
}
const WorkoutModal: React.FC<Props> = ({
  open,
  workout,
  onClose,
  mode,
  showComments,
}) => {
  const { workoutStore, stateStore } = useStores()
  const [includeSets, setIncludeSets] = useState(true)

  const luxonDate = DateTime.fromISO(workout.date)
  const label = luxonDate.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)

  const { navigate } = useNavigation()

  const {
    theme: { colors },
  } = useAppTheme()

  const onActionPress = () => {
    if (mode === 'copy') {
      workoutStore.copyWorkout(workout!, includeSets)
    } else if (mode === 'view') {
      stateStore.setOpenedDate(workout.date)
    }

    navigate('Home', {
      screen: 'WorkoutStack',
      params: { screen: 'Workout', params: {} },
    })

    onClose()
  }

  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: colors.surface,
          marginVertical: spacing.xs,
          marginHorizontal: spacing.md,
          flex: 1,
        }}
      >
        <View style={{ height: '100%' }}>
          <Text
            style={{
              fontSize: fontSize.lg,
              textAlign: 'center',
              padding: spacing.md,
            }}
          >
            {label}
          </Text>
          <Divider
            orientation="horizontal"
            variant="primary"
          />
          <View style={{ flex: 1 }}>
            {showComments && workout.hasComments && (
              <WorkoutCommentsCard
                workout={workout}
                compactMode
              />
            )}
            <ScrollView>
              {workout.steps.map(step => (
                <WorkoutModalStepItem
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
                  padding: spacing.xxs,
                  gap: spacing.xs,
                }}
              >
                <Text style={{ color: colors.onSurface }}>
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

export default WorkoutModal
