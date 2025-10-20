import React, { useEffect } from "react"
import { Keyboard } from "react-native"

import Animated, { useSharedValue } from "react-native-reanimated"

type Props = {
  footerHeight?: number
}

export const KeyboardExpandingView: React.FC<Props> = ({ footerHeight = 0 }) => {
  // Used in older devices where useAnimatedKeyboard doesn't work. Tested on Nexus 4 API 23 emulator
  const kbHeight = useSharedValue(0)
  useEffect(() => {
    const subs = [
      Keyboard.addListener("keyboardDidShow", ({ endCoordinates }) => {
        kbHeight.value = endCoordinates.height
      }),
      Keyboard.addListener("keyboardDidHide", (e) => {
        kbHeight.value = 0
      }),
    ]

    return () => {
      subs.forEach((sub) => sub.remove())
    }
  }, [])

  return <Animated.View style={[{ height: kbHeight }]} />
}
