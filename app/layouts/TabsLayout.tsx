import React, { ReactNode } from 'react'
import { KeyboardAvoidingView, Platform, View } from 'react-native'

import { EmptyLayout } from './EmptyLayout'
import { BottomNavigation } from 'designSystem'
import { useStores } from 'app/db/helpers/useStores'
import { observer } from 'mobx-react-lite'
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated'

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

  // const keyboard = useAnimatedKeyboard()
  // const bottomBarSize = Platform.OS === 'android' ? 56 : 80
  // const animatedStyles = useAnimatedStyle(() => {
  //   console.log(keyboard.height.value)
  //   return {
  //     transform: [
  //       {
  //         translateY: Math.min(-keyboard.height.value, -bottomBarSize),
  //       },
  //     ],
  //   }
  // })

  return (
    <EmptyLayout>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      > */}
      <Animated.View
        style={[
          {
            flex: 1,
            // position: 'absolute',
            // top: 0,
            // bottom: 0,
            // left: 0,
            // right: 0,
          },
          // animatedStyles,
        ]}
      >
        {children}
      </Animated.View>
      <BottomNavigation
        activeRoute={navStore.activeRoute}
        items={tabs}
        // style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
      />
    </EmptyLayout>
  )
}

export default observer(TabsLayout)
