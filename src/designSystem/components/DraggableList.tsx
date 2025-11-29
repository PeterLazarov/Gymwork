import React, { forwardRef } from "react"
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native"
import DragList, { DragListRenderItemInfo } from "react-native-draglist"

import { useScrollIndicators } from "../hooks/useScrollIndicators"
import { ScrollIndicator } from "./ScrollIndicator"

export type DraggableListProps<T> = {
  data: T[]
  renderItem: (info: DragListRenderItemInfo<T>) => React.ReactElement | null
  keyExtractor: (item: T, index: number) => string
  onReorder?: (params: { from: number; to: number }) => void
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  onContentSizeChange?: (width: number, height: number) => void
  onLayout?: (event: any) => void
}

const DraggableListInner = <T = any>(
  { onScroll, onContentSizeChange, onLayout, onReorder, renderItem, ...otherProps }: DraggableListProps<T>,
  ref: React.ForwardedRef<any>,
) => {
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

  const handleReorder = (fromIndex: number, toIndex: number) => {
    onReorder?.({ from: fromIndex, to: toIndex })
  }

  const renderItemWrapper = (info: DragListRenderItemInfo<T>) => {
    const { item, onDragStart, onDragEnd, ...rest } = info
    
    return renderItem({ 
      item, 
      onDragStart, 
      onDragEnd,
      ...rest 
    })
  }

  return (
    <View style={{ flex: 1 }}>
      {canScrollUp && (
        <ScrollIndicator
          height={30}
          position="top"
        />
      )}
      <DragList
        ref={ref}
        renderItem={renderItemWrapper}
        onReordered={handleReorder}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        onScroll={handleScroll}
        {...otherProps}
      />
      {canScrollDown && (
        <ScrollIndicator
          height={30}
          position="bottom"
        />
      )}
    </View>
  )
}

export const DraggableList = forwardRef(DraggableListInner) as <T = any>(
  props: DraggableListProps<T> & { ref?: React.ForwardedRef<any> }
) => React.ReactElement
