import React, { useEffect, useRef } from 'react'
import { Keyboard } from 'react-native'
import Animated, {
  useAnimatedKeyboard,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'

type Props = {
  footerHeight?: number
}

export const KeyboardExpandingView: React.FC<Props> = ({
  footerHeight = 0,
}) => {
  const keyboard = useAnimatedKeyboard()

  // Used in older devices where useAnimatedKeyboard doesn't work. Tested on Nexus 4 API 23 emulator
  const kbHeight = useSharedValue(0)
  useEffect(() => {
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

  const useAnimatedHeight = useRef(false)

  const derivedValue = useDerivedValue(() => {
    if (keyboard.height.value !== 0) {
      useAnimatedHeight.current = true
    }

    return Math.max(
      (useAnimatedHeight.current ? keyboard.height.value : kbHeight.value) -
        footerHeight,
      0
    )
  })

  return <Animated.View style={{ height: derivedValue }} />
}
