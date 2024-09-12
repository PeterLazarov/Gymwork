import React, { useMemo, useState } from 'react'

import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import { colors, boxShadows, Icon } from 'designSystem'
import { BottomNavigation } from 'react-native-paper'
import Workout from './Workout'
import Review from './Review'
import { View } from 'react-native'
import { useStores } from 'app/db/helpers/useStores'

const HomeScreen: React.FC = () => {
  const { stateStore } = useStores()
  const [index, setIndex] = useState(stateStore.homepageTabIndex)

  const routes = useMemo(
    () => [
      {
        key: 'review',
        title: 'Review',
        focusedIcon: () => <Icon icon="history" />,
      },
      {
        key: 'workout',
        title: 'Workout',
        focusedIcon: () => <Icon icon="dumbbell" />,
      },
      {
        key: 'plan',
        title: 'Plan',
        focusedIcon: () => <Icon icon="play-forward-outline" />,
      },
    ],
    []
  )
  const renderScene = BottomNavigation.SceneMap({
    review: Review,
    workout: Workout,
    plan: View,
  })

  return (
    <EmptyLayout>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={{
          backgroundColor: colors.neutralLightest,
          ...boxShadows.lg,
        }}
        activeIndicatorStyle={{ backgroundColor: colors.primaryLight }}
      />
    </EmptyLayout>
  )
}

export default HomeScreen
