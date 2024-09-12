import React, { ReactNode } from 'react'
import { View } from 'react-native'

import { navigate } from 'app/navigators'
import { EmptyLayout } from './EmptyLayout'
import { BottomNavigation } from 'designSystem'
import { useStores } from 'app/db/helpers/useStores'
import { observer } from 'mobx-react-lite'

type Props = {
  children?: ReactNode
}
const TabsLayout: React.FC<Props> = ({ children }) => {
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
        activeRoute={stateStore.activeRoute}
        items={tabs}
      />
    </EmptyLayout>
  )
}

export default observer(TabsLayout)
