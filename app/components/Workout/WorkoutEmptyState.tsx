import React, { useMemo } from 'react'
import { Alert, View } from 'react-native'
import { observer } from 'mobx-react-lite'

import { translate } from 'app/i18n'
import { Text, Card, Icon, useColors } from 'designSystem'
import { useStores } from 'app/db/helpers/useStores'
import EmptyState from '../EmptyState'

const WorkoutEmptyState: React.FC = () => {
  const {
    workoutStore,
    navStore: { navigate },
  } = useStores()
  const hasWorkouts = workoutStore.workouts.length > 0
  const hasTemplates = workoutStore.workoutTemplates.length > 0

  const actions = useMemo(() => {
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
    ]

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

  const colors = useColors()

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
      }}
    >
      {actions.length > 0 &&
        actions.map(action => (
          <Card
            key={action.text}
            containerStyle={{ paddingHorizontal: 8 }}
            onPress={action.onPress}
            content={
              <View style={{ alignItems: 'center' }}>
                <Icon
                  color={
                    action.forbidden ? colors.outlineVariant : colors.onSurface
                  }
                  icon={action.icon}
                  style={{ paddingBottom: 10 }}
                />
                <Text
                  style={{
                    color: action.forbidden
                      ? colors.outlineVariant
                      : colors.onSurface,
                  }}
                >
                  {action.text}
                </Text>
              </View>
            }
          />
        ))}
      {actions.length === 0 && (
        <EmptyState text={translate('noWorkoutsEntered')} />
      )}
    </View>
  )
}

export default observer(WorkoutEmptyState)
