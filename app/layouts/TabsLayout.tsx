import { observer } from 'mobx-react-lite'
import React, { ReactNode } from 'react'
import { View } from 'react-native'

import { translate } from '@/i18n'
import { useStores } from 'app/db/helpers/useStores'
import { BottomNavigation, IconProps } from 'designSystem'

import { EmptyLayout } from './EmptyLayout'

type Props = {
  children?: ReactNode
}
const TabsLayout: React.FC<Props> = ({ children }) => {
  const { stateStore, navStore } = useStores()

  const tabs = [
    {
      text: translate('review'),
      routes: ['Review'],
      icon: 'history' as IconProps['icon'],
      onPress: () => navStore.navigate('Review'),
    },
    {
      text: translate('workout'),
      routes: ['Workout', 'WorkoutStep'],
      icon: 'dumbbell' as IconProps['icon'],
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

          if (stateStore.footerHeight !== height) {
            stateStore.setProp('footerHeight', Math.ceil(height))
          }
        }}
      />
    </EmptyLayout>
  )
}

export default observer(TabsLayout)
