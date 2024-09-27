import React, { forwardRef, useCallback } from 'react'
import {
  useWindowDimensions,
  FlatList,
  FlatListProps,
  View,
  ViewabilityConfig,
  ViewToken,
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

type LockedProps = 'onScroll' | 'getItemLayout' | 'horizontal'

type Props = Omit<FlatListProps<any>, LockedProps> & {
  onScreenChange?: (index: number) => void
}

const viewabilityConfig: ViewabilityConfig = {
  itemVisiblePercentThreshold: 60,
}

const HorizontalScreenList = forwardRef<FlatList<any>, Props>(
  (
    {
      onScreenChange,
      initialScrollIndex,
      renderItem: externalRenderItem,
      ...rest
    },
    ref
  ) => {
    const width = useWindowDimensions().width

    const handleViewChange = useCallback(function (info: {
      viewableItems: ViewToken[]
      changed: ViewToken[]
    }) {
      const index = info?.viewableItems[0]?.index
      if (typeof index === 'number' && index >= 0) {
        onScreenChange?.(index)
      }
    },
    [])

    const renderItem = (props: any) => (
      <View style={{ width, flex: 1 }}>{externalRenderItem!(props)}</View>
    )

    const getItemLayout = (
      data: ArrayLike<any> | null | undefined,
      index: number
    ) => ({
      length: width,
      offset: width * index,
      index,
    })

    const translationX = useSharedValue(0)

    const panGesture = Gesture.Pan()
      .activeOffsetX([-25, 25]) // This ensures horizontal gestures are recognized only when dragging past the threshold
      .failOffsetY([-10, 10]) // If the user is scrolling more vertically, we fail the horizontal gesture
      .onUpdate(event => {
        // Check if horizontal translation is significant (past threshold)
        if (Math.abs(event.translationX) > 25) {
          // Apply horizontal translation
          translationX.value = event.translationX
        }
      })
      .onEnd(() => {
        // Reset translation when gesture ends
        translationX.value = withSpring(0)
      })

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translationX.value }],
    }))

    return (
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              flex: 1,
            },
            animatedStyle,
          ]}
        >
          <FlatList
            ref={ref}
            showsHorizontalScrollIndicator={false}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={handleViewChange}
            pagingEnabled
            keyExtractor={(item, index) => String(index)}
            getItemLayout={getItemLayout}
            renderItem={renderItem}
            horizontal
            snapToAlignment="center"
            initialScrollIndex={initialScrollIndex}
            {...rest}
          />
        </Animated.View>
      </GestureDetector>
    )
  }
)

export default HorizontalScreenList
