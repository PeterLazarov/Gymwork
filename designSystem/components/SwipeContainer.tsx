import React, { ReactNode, useState } from 'react'
import { View } from 'react-native'
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
} from 'react-native-gesture-handler'

export type SwipeContainerProps = {
  children: ReactNode
  onSwipeLeft: (translateX: number) => void
  onSwipeRight: (translateX: number) => void
  horisontalThreshold?: number
}
const SwipeContainer: React.FC<SwipeContainerProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  horisontalThreshold = 150,
}) => {
  const [swipeTriggered, setSwipeTriggered] = useState(false)

  function onGestureEvent(event: GestureEvent<PanGestureHandlerEventPayload>) {
    const { translationX } = event.nativeEvent

    if (translationX > horisontalThreshold && !swipeTriggered) {
      setSwipeTriggered(true)
      onSwipeRight(translationX)
    } else if (translationX < -1 * horisontalThreshold && !swipeTriggered) {
      setSwipeTriggered(true)
      onSwipeLeft(translationX)
    }
  }

  function onHandlerStateChange(
    event: GestureEvent<PanGestureHandlerEventPayload>
  ) {
    if (event.nativeEvent.state === State.END) {
      setSwipeTriggered(false)
    }
  }

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <View style={{ flex: 1 }}>{children}</View>
    </PanGestureHandler>
  )
}
export default SwipeContainer
