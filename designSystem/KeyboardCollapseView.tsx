import React, { useEffect, useRef, useState } from 'react'
import { KeyboardEventListener, Platform, ViewProps } from 'react-native'
import Animated, {
  AnimateProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { useKeyboardHandlers } from '@good-react-native/keyboard-avoider/src/hooks'
import {
  CommonProps,
  defaultCommonProps,
} from '@good-react-native/keyboard-avoider/src/components/common-props'
import {
  closeAnimation,
  measureFocusedInputBottomY,
  openAnimation,
} from '@good-react-native/keyboard-avoider/src/utilities'

export type KeyboardAvoidMode = 'whole-view' | 'focused-input'

type Props = AnimateProps<ViewProps> &
  CommonProps & {
    footerHeight?: number
    screenHeight: number
  }
export const KeyboardCollapseView: React.FC<Props> = ({
  animationEasing = defaultCommonProps.animationEasing,
  animationTime = defaultCommonProps.animationTime,
  extraSpace = defaultCommonProps.extraSpace,
  screenHeight,
  footerHeight = 0,
  ...props
}) => {
  const ref = useRef<null | Animated.View>(null)
  const [initHeight, setInitHeight] = useState<number | undefined>(undefined)
  const [offset, setOffset] = useState<number | null>(null)
  const animation = useSharedValue(0)
  const keyboardTopRef = useRef<number>(0)

  const handleKeyboardWillShow: KeyboardEventListener = e => {
    setOffset(e.endCoordinates.screenY)
    // if (Platform.OS == 'android') {
    //   measureFocusedInputBottomY((inputBottomY: number) => {
    //     const pannedBy = Math.max(inputBottomY - e.endCoordinates.screenY, 0)
    //   })
    //   return
    // }
    //ios
    // ref.current?.measure((x, y, w, h, px, py) => {
    //   console.log
    //   setHeight(h)
    // })
  }

  function handleKeyboardWillHide() {
    setOffset(null)
  }

  useKeyboardHandlers(
    {
      showHandler: handleKeyboardWillShow,
      hideHandler: handleKeyboardWillHide,
    },
    [extraSpace, animationTime]
  )

  function pos() {
    const calcKeyboardHeight = offset ? screenHeight - offset : 0
    const keyboardScreenOverlap = offset ? calcKeyboardHeight - footerHeight : 0
    console.log({
      initHeight,
      offset,
      calcKeyboardHeight,
      keyboardScreenOverlap,
      screenHeight,
      footerHeight,
      result: initHeight || 0 - keyboardScreenOverlap,
    })
    return (initHeight || 0) - keyboardScreenOverlap
  }

  useEffect(() => {
    const p = pos()
    console.log('collapse to', p)
    if (p <= 0) return
    animation.value = withTiming(
      p,
      openAnimation(animationTime, animationEasing)
    )
  }, [offset])

  const animatedStyle = useAnimatedStyle(() => ({
    height: animation.value || initHeight,
  }))

  useEffect(() => console.log('anim', animation.value), [animation.value])
  return (
    <Animated.View
      {...props}
      style={[
        {
          // If initHeight is not set, we can use flex to occupy space.
          flex: initHeight === undefined ? 1 : undefined,
          backgroundColor: 'red',
        },
        props.style,
        animatedStyle,
      ]}
      ref={ref}
      onLayout={event => {
        const { height } = event.nativeEvent.layout
        // Capture initial height on first layout event
        if (initHeight === undefined) {
          setInitHeight(height)
        }
      }}
    />
  )
}
