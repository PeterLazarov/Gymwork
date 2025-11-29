import { FlashList, FlashListProps, FlashListRef } from "@shopify/flash-list"
import React, { forwardRef } from "react"
import { View } from "react-native"

import { useScrollIndicators } from "../hooks/useScrollIndicators"
import { ScrollIndicator } from "./ScrollIndicator"

export const IndicatedScrollList = forwardRef<FlashListRef<any>, FlashListProps<any>>(
  function IndicatedScrollList({ onScroll, onContentSizeChange, onLayout, ...otherProps }, ref) {
    const {
      canScrollUp,
      canScrollDown,
      handleScroll,
      handleContentSizeChange,
      handleLayout,
    } = useScrollIndicators({
      onScroll,
      onContentSizeChange,
      onLayout,
    })

    return (
      <View style={{ flex: 1 }}>
        {canScrollUp && (
          <ScrollIndicator
            height={30}
            position="top"
          />
        )}
        <FlashList
          ref={ref}
          {...otherProps}
          onContentSizeChange={handleContentSizeChange}
          onLayout={handleLayout}
          onScroll={handleScroll}
        />
        {canScrollDown && (
          <ScrollIndicator
            height={30}
            position="bottom"
          />
        )}
      </View>
    )
  },
)
export default IndicatedScrollList
