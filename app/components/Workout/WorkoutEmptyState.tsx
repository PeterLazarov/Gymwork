import React, { useMemo } from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react-lite'

import { translate } from 'app/i18n'
import { Text, Card, Icon } from 'designSystem'
import { navigate } from 'app/navigators'
import { useStores } from 'app/db/helpers/useStores'
import EmptyState from '../EmptyState'

const WorkoutEmptyState: React.FC = () => {
  const { workoutStore } = useStores()
  const hasWorkouts = workoutStore.workouts.length > 0
  const hasTemplates = workoutStore.workoutTemplates.length > 0

  const actions = useMemo(() => {
    const result = []
    if (hasWorkouts) {
      result.push({
        icon: 'copy-outline',
        text: translate('copyWorkout'),
        onPress: copyWorkout,
      })
    }

    if (hasTemplates) {
      result.push({
        icon: 'download-outline',
        text: translate('useTemplate'),
        onPress: useTemplate,
      })
    }
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
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {actions.length > 0 &&
        actions.map(action => (
          <Card
            key={action.text}
            containerStyle={{ paddingHorizontal: 8 }}
            onPress={action.onPress}
            content={
              <View style={{ alignItems: 'center' }}>
                <Icon
                  icon={action.icon}
                  style={{ paddingBottom: 10 }}
                />
                <Text>{action.text}</Text>
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
