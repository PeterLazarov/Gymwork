import React, { forwardRef, useRef, useState } from "react"
import { FlashList, FlashListProps, FlashListRef } from "@shopify/flash-list"
import { NativeScrollEvent, NativeSyntheticEvent, Platform, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

import { useColors } from "../tokens/colors"

export const IndicatedScrollList = forwardRef<FlashListRef<any>, FlashListProps<any>>(
  function IndicatedScrollList({ onScroll, onContentSizeChange, onLayout, ...otherProps }, ref) {
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
      setCanScrollDown(currentOffset + visibleHeight.current < contentHeight.current)

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
          ref={ref}
          {...otherProps}
          onContentSizeChange={(width, height) => {
            // Save the content height
            contentHeight.current = Math.round(height)
            // Recalculate scrollability when content changes
            setCanScrollDown(visibleHeight.current < height)

            onContentSizeChange?.(width, height)
          }}
          onLayout={(event) => {
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
  },
)
export default IndicatedScrollList

type BlurEffectProps = {
  height: number
  position: "top" | "bottom"
}

const BlurEffect: React.FC<BlurEffectProps> = ({ height, position }) => {
  const colors = useColors()

  const startY = Platform.OS === "android" ? 0 : -1

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 2,
        overflow: "hidden",
        height,
        top: position === "top" ? 0 : undefined,
        bottom: position === "bottom" ? 0 : undefined,
      }}
    >
      <LinearGradient
        colors={[colors.surfaceContainerHigh, "transparent"]}
        style={{
          height: 20 * height,
          flex: 1,
          transform:
            position === "bottom"
              ? [
                  {
                    rotate: "180deg",
                  },
                ]
              : undefined,
        }}
        start={{ x: 0, y: startY }}
        end={{ x: 0, y: 0.5 }}
      />
    </View>
  )
}
