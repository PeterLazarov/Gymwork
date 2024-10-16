import React, { useMemo } from 'react'
import { Alert, View } from 'react-native'
import { observer } from 'mobx-react-lite'

import { translate } from 'app/i18n'
import { useStores } from 'app/db/helpers/useStores'
import ActionCard from '../ActionCard'

const WorkoutEmptyState: React.FC = () => {
  const {
    workoutStore,
    navStore: { navigate },
  } = useStores()
  const hasWorkouts = workoutStore.workouts.length > 0
  const hasTemplates = workoutStore.workoutTemplates.length > 0

  function startWorkout() {
    workoutStore.createWorkout()
    navigate('ExerciseSelect')
  }

  const secondaryActions = useMemo(() => {
    const result = [
      {
        icon: 'copy-outline',
        text: translate('copyWorkout'),
        onPress: hasWorkouts
          ? copyWorkout
          : () => Alert.alert('', translate('copyWorkoutAlert')),
        forbidden: !hasWorkouts,
      },
      {
        icon: 'download-outline',
        text: translate('useTemplate'),
        onPress: hasTemplates
          ? useTemplate
          : () =>
              // TODO revisit once templates can be created apart from workouts
              Alert.alert('', translate('useTemplateAlert')),
        forbidden: !hasTemplates,
      },
    ] as const

    return result
  }, [hasWorkouts, hasTemplates])

  function copyWorkout() {
    navigate('Calendar', {
      copyWorkoutMode: true,
    })
  }

  function useTemplate() {
    navigate('TemplateSelect')
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 16, justifyContent: 'center' }}>
      <ActionCard
        onPress={startWorkout}
        icon="dumbbell"
      >
        {translate('startEmptyWorkout')}
      </ActionCard>
      <View
        style={{
          flexDirection: 'row',
          gap: 16,
        }}
      >
        {secondaryActions.map(action => (
          <View
            style={{ flexGrow: 1 }}
            key={action.text}
          >
            <ActionCard
              onPress={action.onPress}
              disabled={action.forbidden}
              icon={action.icon}
            >
              {action.text}
            </ActionCard>
          </View>
        ))}
      </View>
    </View>
  )
}

export default observer(WorkoutEmptyState)
