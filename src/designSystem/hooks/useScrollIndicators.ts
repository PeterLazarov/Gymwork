import { useRef, useState } from "react"
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native"

type UseScrollIndicatorsProps = {
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  onContentSizeChange?: (width: number, height: number) => void
  onLayout?: (event: any) => void
}

export function useScrollIndicators({
  onScroll,
  onContentSizeChange,
  onLayout,
}: UseScrollIndicatorsProps = {}) {
  const [canScrollUp, setCanScrollUp] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)

  const contentHeight = useRef(0)
  const visibleHeight = useRef(0)

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = Math.round(event.nativeEvent.contentOffset.y)

    setCanScrollUp(currentOffset > 0)

    setCanScrollDown(currentOffset + visibleHeight.current < contentHeight.current)

    onScroll?.(event)
  }

  const handleContentSizeChange = (width: number, height: number) => {
    contentHeight.current = Math.round(height)
    setCanScrollDown(visibleHeight.current < height)

    onContentSizeChange?.(width, height)
  }

  const handleLayout = (event: any) => {
    visibleHeight.current = Math.round(event.nativeEvent.layout.height)
    setCanScrollDown(visibleHeight.current < contentHeight.current)

    onLayout?.(event)
  }

  return {
    canScrollUp,
    canScrollDown,
    handleScroll,
    handleContentSizeChange,
    handleLayout,
  }
}
