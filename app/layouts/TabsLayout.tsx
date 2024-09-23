import React, { ReactNode } from 'react'
import { View } from 'react-native'

import { EmptyLayout } from './EmptyLayout'
import { BottomNavigation } from 'designSystem'
import { useStores } from 'app/db/helpers/useStores'
import { observer } from 'mobx-react-lite'

type Props = {
  children?: ReactNode
}
const TabsLayout: React.FC<Props> = ({ children }) => {
  const { stateStore, navStore } = useStores()

  const tabs = [
    {
      text: 'Review',
      routes: ['Review'],
      icon: 'history',
      onPress: () => navStore.navigate('Review'),
    },
    {
      text: 'Workout',
      routes: ['Workout', 'WorkoutStep'],
      icon: 'dumbbell',
      onPress: () => {
        if (stateStore.focusedStep) {
          navStore.navigate('WorkoutStep')
        } else {
          navStore.navigate('Workout')
        }
      },
    },
  ]

  return (
    <EmptyLayout hasFooter>
      <View style={{ flex: 1 }}>{children}</View>
      <BottomNavigation
        activeRoute={navStore.activeRoute}
        items={tabs}
        onLayout={event => {
          const { height } = event.nativeEvent.layout
          // Capture initial height on first layout event
          if (stateStore.footerHeight !== height) {
            stateStore.setProp('footerHeight', height)
          }
        }}
      />
    </EmptyLayout>
  )
}

export default observer(TabsLayout)
