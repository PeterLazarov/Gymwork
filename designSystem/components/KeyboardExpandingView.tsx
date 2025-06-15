import React, { useEffect } from 'react'
import { Keyboard, Platform } from 'react-native'
import Animated, { useSharedValue } from 'react-native-reanimated'

export type KeyboardExpandingViewProps = {
  footerHeight?: number
}

const isOlderAndroidDevice = Platform.OS === 'android' && Platform.Version < 26

export const KeyboardExpandingView: React.FC<KeyboardExpandingViewProps> = ({
  footerHeight = 0,
}) => {
  const kbHeight = useSharedValue(0)

  useEffect(() => {
    if (!isOlderAndroidDevice) return

    const subs = [
      Keyboard.addListener('keyboardDidShow', ({ endCoordinates }) => {
        kbHeight.value = endCoordinates.height
      }),
      Keyboard.addListener('keyboardDidHide', e => {
        kbHeight.value = 0
      }),
    ]

    return () => {
      subs.forEach(sub => sub.remove())
    }
  }, [])

  if (!isOlderAndroidDevice) return null

  return <Animated.View style={{ height: kbHeight }} />
}
