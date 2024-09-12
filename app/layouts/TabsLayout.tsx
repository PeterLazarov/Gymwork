import React, { ReactNode } from 'react'
import { View } from 'react-native'

import { AppStackParamList, navigate } from 'app/navigators'
import { EmptyLayout } from './EmptyLayout'
import { BottomNavigation } from 'designSystem'
import { useStores } from 'app/db/helpers/useStores'

type Props = {
  children?: ReactNode
  activeRoute: keyof AppStackParamList
}
export const TabsLayout: React.FC<Props> = ({ children, activeRoute }) => {
  const { stateStore } = useStores()

  const tabs = [
    {
      text: 'Review',
      routes: ['Review'],
      icon: 'history',
      onPress: () => navigate('Review'),
    },
    {
      text: 'Workout',
      routes: ['Workout', 'WorkoutStep'],
      icon: 'dumbbell',
      onPress: () => {
        if (stateStore.focusedStep) {
          navigate('WorkoutStep')
        } else {
          navigate('Workout')
        }
      },
    },
  ]

  return (
    <EmptyLayout>
      <View style={{ flex: 1 }}>{children}</View>
      <BottomNavigation
        activeRoute={activeRoute}
        items={tabs}
      />
    </EmptyLayout>
  )
}
