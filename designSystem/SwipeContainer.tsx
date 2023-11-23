import React, { ReactNode, useState } from 'react'
import { View } from 'react-native'
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
} from 'react-native-gesture-handler'

type Props = {
  children: ReactNode
  onSwipeLeft: (translateX: number) => void
  onSwipeRight: (translateX: number) => void
  horisontalThreshold?: number
}
const SwipeContainer: React.FC<Props> = ({
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
      // State 4 represents the "END" state
      // Reset the swipeTriggered state after the swipe is complete
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
