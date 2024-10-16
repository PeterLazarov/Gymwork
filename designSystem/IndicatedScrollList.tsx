import React, { forwardRef, useRef, useState } from 'react'
import { FlashList, FlashListProps } from '@shopify/flash-list'
import {
  FlatList,
  FlatListProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native'

import BlurEffect from './BlurEffect'
import Animated from 'react-native-reanimated'

type Props = FlatListProps<any>

const IndicatedScrollList = forwardRef<FlatList<any>, Props>(
  function IndicatedScrollList(
    { onScroll, onContentSizeChange, onLayout, ...otherProps },
    ref
  ) {
    const [canScrollUp, setCanScrollUp] = useState(false)
    const [canScrollDown, setCanScrollDown] = useState(false)

    // To store content and visible area sizes
    const contentHeight = useRef(0)
    const visibleHeight = useRef(0)

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentOffset = Math.round(event.nativeEvent.contentOffset.y)

      // Check if scroll up is possible (not at the top)
      setCanScrollUp(currentOffset > 0)

      // Check if scroll down is possible (not at the bottom)
      setCanScrollDown(
        currentOffset + visibleHeight.current < contentHeight.current
      )

      onScroll?.(event)
    }

    return (
      <View style={{ flex: 1 }}>
        {canScrollUp && (
          <BlurEffect
            height={30}
            position="top"
          />
        )}
        <Animated.FlatList
          ref={ref}
          {...otherProps}
          onContentSizeChange={(width, height) => {
            // Save the content height
            contentHeight.current = Math.round(height)
            // Recalculate scrollability when content changes
            setCanScrollDown(visibleHeight.current < height)

            onContentSizeChange?.(width, height)
          }}
          scrollToOverflowEnabled={true}
          overScrollMode={'always'}
          // over
          onLayout={event => {
            // Save the visible area height
            visibleHeight.current = Math.round(event.nativeEvent.layout.height)
            // Recalculate scrollability when the layout changes
            setCanScrollDown(visibleHeight.current < contentHeight.current)

            onLayout?.(event)
          }}
          onScroll={handleScroll}
        />
        {canScrollDown && (
          <BlurEffect
            height={30}
            position="bottom"
          />
        )}
      </View>
    )
  }
)
export default IndicatedScrollList
