import React, { useRef, useState } from 'react'
import { FlashList, FlashListProps } from '@shopify/flash-list'
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native'

import BlurEffect from './BlurEffect'

type Props = FlashListProps<any>

const IndicatedScrollList: React.FC<Props> = ({
  onScroll,
  onContentSizeChange,
  onLayout,
  ...otherProps
}) => {
  const [canScrollUp, setCanScrollUp] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)

  // To store content and visible area sizes
  const contentHeight = useRef(0)
  const visibleHeight = useRef(0)

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y

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
      <FlashList
        {...otherProps}
        onContentSizeChange={(width, height) => {
          // Save the content height
          contentHeight.current = height
          // Recalculate scrollability when content changes
          setCanScrollDown(visibleHeight.current < height)

          onContentSizeChange?.(width, height)
        }}
        onLayout={event => {
          // Save the visible area height
          visibleHeight.current = event.nativeEvent.layout.height
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
export default IndicatedScrollList
