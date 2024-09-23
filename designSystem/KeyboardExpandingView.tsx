import React from 'react'

import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated'

type Props = {
  footerHeight?: number
}

export const KeyboardExpandingView: React.FC<Props> = ({
  footerHeight = 0,
}) => {
  const keyboard = useAnimatedKeyboard()

  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: Math.max(keyboard.height.value - footerHeight, 0),
    }
  })

  return <Animated.View style={[{ height: 0 }, animatedStyles]} />
}
