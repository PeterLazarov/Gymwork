import React from 'react'
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
      {hasWorkouts && (
        <Card
          containerStyle={{ paddingHorizontal: 8 }}
          onPress={copyWorkout}
          content={
            <View style={{ alignItems: 'center' }}>
              <Icon
                icon="copy-outline"
                style={{ paddingBottom: 10 }}
              />
              <Text>{translate('copyWorkout')}</Text>
            </View>
          }
        />
      )}
      {hasTemplates && (
        <Card
          containerStyle={{ paddingHorizontal: 8 }}
          onPress={useTemplate}
          content={
            <View style={{ alignItems: 'center' }}>
              <Icon
                icon="download-outline"
                style={{ paddingBottom: 10 }}
              />
              <Text>{translate('useTemplate')}</Text>
            </View>
          }
        />
      )}
      {!hasWorkouts && <EmptyState text={translate('noWorkoutsEntered')} />}
    </View>
  )
}

export default observer(WorkoutEmptyState)
